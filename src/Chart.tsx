/**
 * 图表的绘制，
 * TODO： 按照声明式去配置
 */

import G2 = require("g2");
import { find, filter, fromPairs, isEmpty, isEqual,
  isMatch, map, merge, pick, some, uniq, zip, zipObject } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {ChartProps, DrawParamsProps, Granulariy, Metric, Source} from "./ChartProps";
import { formatNumber, formatPercent } from "./utils";
import * as moment from "moment";
moment.locale("zh-cn");

interface G2Scale {
  type: string;
  formatter?: (n: string|number) => string;
  range?: [number, number];
  alias?: string;
  tickCount?: number;
  tickInterval?: number;
  ticks?: string[];
  mask?: string;
  nice?: boolean;
  min?: number;
  max?: number;
}
interface SourceConfig {
  [colName: string]: G2Scale;
}
const countTick = (maxTick: number, total: number) => {
  const interval = Math.ceil(total / maxTick);
  return Math.ceil(total / interval);
};
const getChartConfig: any = (chartType: string) => {
  const defaultMetric = {
    combineMetrics: true,
    geom: "line",
    margin: [10, 30, 30, 60]
  };
  // TODO: 将图表类型变成不同步骤的组合
  const chartTypeMap: any[string] = {
    area: { geom: "area" },
    bar:    { combineMetrics: false, geom: "interval", label: true, margin: [40, 40, 10, 10], reflect: "y",
      transpose: true },
    bubble: { geom: "point", pos: "MM", combineMetrics: false, shape: "circle" },
    comparison: {geom: "area", pos: "MMD", combineMetrics: false, hideAxis: true, tooltipchange: "custom",
      colorTheme: "252, 95, 58", margin: [10, 30, 50, 50] },
    dualaxis: { geom: "interval", pos: "MMD", combineMetrics: false, margin: [10, 50, 50, 50] },
    funnel: { geom: "line", size: 2, combineMetrics: false, skipMetric: true, margin: [10, 30, 50, 40] },
    funnelChart: { geom: "line", size: 2, combineMetrics: false, skipMetric: true, legendPosition: "top", margin: [10, 30, 50, 40] },
    line: {geom: "line", size: 2},
    retention: { geom: "line", size: 2, counter: "day", margin: [10, 30, 50, 40] },
    singleNumber: { geom: "area", shape: "smooth", size: 2, combineMetrics: false, axis: false, tooltip: false,
      margin: [0, 0, 0, 0], colorTheme: "252, 95, 58" },
    vbar:   { geom: "interval" }
  };
  return merge({}, defaultMetric, chartTypeMap[chartType]);
};

class Chart extends React.Component <ChartProps, any> {
  private chart: any;
  private legends: any;
  // private selectMode: string = "multiple";
  private lastSelectedShape: any = null;
  private constructor(props: ChartProps) {
    super();
    // 强制切换theme
    /* const colors = [
      "#fc5f3a", "#fa9d1b",
      "#48a1f9", "#9ecefe",
      "#349a38", "#7fd182",
      "#d5375f", "#ff8ba8",
      "#3e4a9c", "#8d9bf3",
      "#525566", "#a1a4b3",
      "#25ada1", "#8ae1d8",
      "#755920", "#dab873",
      "#8d49a4", "#da97f1",
      "#f5d360", "#ffbd9c"
    ]; */
    const colors = [
      "#5FB6C7", "#FFD159",
      "#C9C77C", "#FA7413",
      "#D6DCE3", "#6F5D45",
      "#FDF0A1", "#bf1f41",
      "#A1EBDE", "#CBBD8C",
      "#B96285", "#8a73c9",
      "#005a03", "#320096",
      "#673000", "#2d396b"
    ];
    const defaultColor = "#5FB6C7";
    // G2 的主题有bug，legend读的是G2.Theme的颜色，因此直接覆盖Theme更合适
    const theme = G2.Util.mix(true, G2.Theme, {
      animate: false,
      axis: {
        bottom: {
          labels: { autoRotate: false },
          title: null
        },
        left: {
          line: null,
          labels: { autoRotate: false },
          tickLine: { lineWidth: 0, stroke: "#fcc" },
          title: null
        },
        right: {
          labels: { autoRotate: false },
          title: null
        }
      },
      colors: {
        default: colors,
        intervalStack: colors
      },
      defaultColor,
      legend: {
        bottom: {
          dy: 15
        }
      },
      shape: {
        area: { fill: "#5FB6C7" },
        hollowPoint: {fill: "#5FB6C7" },
        interval: { fill: "#abce5b", fillOpacity: 1 },
        line: { stroke: "#5FB6C7" },
        point: {fill: "#5FB6C7", fillOpacity: .5 }
      },
      tooltip: {
        tooltipMarker: {
          stroke: "#5FB6C7"
        }
      }
    });
    // G2.track(false);
    G2.Global.animate = navigator.hardwareConcurrency && navigator.hardwareConcurrency > 7;
    G2.Global.setTheme(theme);
  }
  public render() {
    return <div className="giochart" style={this.props.style} />;
  }

  // 按理不需要绘制对不上的图
  private isValidParams(chartParams: DrawParamsProps, source: Source) {
    if (chartParams.chartType === "comparison" && source.length && !source[0].tm_) {
      return false;
    } else if (chartParams.chartType === "bar") {
      // 是否有非tm的维度
      const dim = find(chartParams.columns, {isDim: true});
      return dim.id !== "tm";
    }
    return true;
  }
  // 这个函数是用来区分changeData还是draw, 通常尽量不要用componentWillReceiveProps
  private componentWillReceiveProps(nextProps: ChartProps) {
    if (isEmpty(nextProps.source)) {
      return;
    }
    const source: Source = nextProps.source;
    // 若是chartParams和source不合法,那说明数据没有传输到，
    if (!this.isValidParams(nextProps.chartParams, nextProps.source)) {
      return;
    }
    if (!isEmpty(nextProps.selected)) { // 需要筛选数据
      const dimCols = map(filter(nextProps.chartParams.columns, { isDim: true }), "id");
      const filteredSelected = filter(nextProps.selected, (item) =>  isEmpty(pick(item, dimCols)));
      if (isEmpty(filteredSelected)) {
        return;
      }
      const filterSource = filter(source, (sourceItem) =>
        some(filteredSelected, (selectedItem) =>
          isMatch(sourceItem, selectedItem)
        )
      );
      this.changeData(filterSource || source);
    } else { // 不需要筛选数据，或者取消筛选
      if (JSON.stringify(this.props.chartParams) !== JSON.stringify(nextProps.chartParams)) { // 配置修改了，重新绘制
        if (this.chart) {
          this.chart.destroy();
          ReactDOM.findDOMNode(this).innerHTML = "";
        }
        this.drawChart(nextProps.chartParams, source, nextProps.isThumb);
      } else if (JSON.stringify(source) !== JSON.stringify(this.props.source)) {
        // this.changeData(source);
        if (this.chart) {
          this.chart.destroy();
          ReactDOM.findDOMNode(this).innerHTML = "";
        }
        this.drawChart(nextProps.chartParams, source, nextProps.isThumb);
      }
    }
  }
  private changeData(source: Source) {
    if (this.chart) {
      const chartParams = this.props.chartParams;
      const chartCfg = getChartConfig(chartParams.chartType);
      // 检验是否需要合并对做处理
      let frame      = new G2.Frame(source);
      // 需要多值域合并
      const metricCols = map(filter(chartParams.columns, { isDim: false }), "id");
      const dimCols    = map(filter(chartParams.columns, { isDim: true }), "id");

      if (chartCfg.combineMetrics && metricCols.length > 1) {
        frame = G2.Frame.combinColumns(frame, metricCols, "val", "metric", dimCols);
        const metricNames = map(filter(chartParams.columns, { isDim: false }), "name");
      }
      this.chart.changeData(frame);
    } else {
      this.drawChart(this.props.chartParams, source, this.props.isThumb);
    }
  }
  private componentDidMount() {
    const { chartParams, isThumb, source } = this.props;

    if (!this.isValidParams(chartParams, source)) {
      return;
    }
    if (source) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.drawChart(chartParams, source, isThumb);
    }
  }

  private componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
      ReactDOM.findDOMNode(this).innerHTML = "";
    }
  }

  private drawChart(chartParams: DrawParamsProps, source: any[], isThumb: boolean = false) {
    try {
      const dom = document.createElement("div");
      dom.style.height = "100%";
      ReactDOM.findDOMNode(this).appendChild(dom);

      const canvasRect = dom.getBoundingClientRect();
      if (canvasRect.width < 10) {
        return;
      }
      if (!chartParams.chartType) {
        // TODO invariant
        console.error("Error 101: 图表没有指定类型或类型不合法，请访问ChartParams.md获取类型定义的方案");
        return;
        /*
         } else if (canvasRect.height === 0) {
         console.error("Error 103: 绘制图形取决于外框高度,而当前外框的高度为0,如果你已经设置了高度，那可能绘制发生在了样式生效前");
         return;
         */
      }
      const chartCfg = getChartConfig(chartParams.chartType);
      const sourceDef = this.buildSourceConfig(chartParams);

      // 建立Frame
      let metricCols: string[] = map(filter(chartParams.columns, {isDim: false}), (n: any) => n.id);
      let dimCols: string[] = map(filter(chartParams.columns, {isDim: true}), (n: any) => n.id);
      let frame = new G2.Frame(source);

      // 周期对比图 的 hook
      if (chartParams.chartType === "comparison") {
        // 给frame增加字段， 用以显示tooltip的title
        frame.addCol("rate", (record: any) => (
          record[metricCols[1]] ? (record[metricCols[0]] / record[metricCols[1]] - 1) : 0
        ));
        sourceDef.rate = {
          formatter: formatPercent,
          type: "linear",
        };

        // 获取metricid, 计算最大值,统一两条线的区间范围
        const mids = map(filter(chartParams.columns, {isDim: false}), "id");
        const maxScale: number = Math.max.apply(null, map(mids, (col: string) => G2.Frame.max(frame, col)));
        mids.forEach((id: string) => {
          sourceDef[id].min = 0;
          sourceDef[id].max = maxScale;
        });
      } else if (chartParams.chartType === "singleNumber") {
        dimCols = ["tm"];
      } else if (chartCfg.skipMetric === true) {
        // 漏斗铲掉人数
        chartCfg.appendTip = [metricCols[0]];
        metricCols = [metricCols[1]];
      }
      // wash record
      if (chartCfg.pos === "MM") {
        frame = G2.Frame.filter(frame, (obj: any) => metricCols.every(
          (col: string) => (typeof obj[col] === "number")
        ));
      }

      // 需要多值域合并
      if (chartCfg.combineMetrics && metricCols.length > 1) {
        frame = G2.Frame.combinColumns(frame, metricCols, "val", "metric", dimCols);
        dimCols.push("metric");
        const metricNames = map(filter(chartParams.columns, { isDim: false }), "name");
        const metricDict = fromPairs(zip(metricCols, metricNames));
        sourceDef.metric = {
          type: "cat",
          formatter: (n: string): string => metricDict[n]
        };
        sourceDef.val = {
          type: "linear",
          formatter: metricCols.length > 1 ? formatNumber : sourceDef[metricCols[0]].formatter
        }
        metricCols = ["val"];
      } else {
        if (chartCfg.pos !== "MMD") {
          chartCfg.margin[3] += 10;
        }
      }

      // 针对分组的线图重新排序
      if (dimCols.length > 1 && chartCfg.pos !== "MM" && !chartCfg.skipMetric) {
        const stat = G2.Stat.summary.sum(dimCols[1] + "*" + metricCols[0]);
        stat.init();
        const groupFrame = stat.execFrame(frame);
        const sortedDim = G2.Frame.sort(groupFrame, metricCols[0]).colArray(dimCols[1]);
        frame = G2.Frame.sortBy(frame, (a: any, b: any) => {
          const legendDim: string = dimCols[1];
          return sortedDim.indexOf(a[legendDim]) < sortedDim.indexOf(b[legendDim]) ? 1 : -1;
        });
      }
      // 计算legend的留空，tick的留空
      let canvasHeight: number = canvasRect.height;

      if (!isThumb && chartCfg.pos !== "MMD" && dimCols.length > 1) {
        if (!chartParams.aggregates || chartParams.aggregates.length < 2) {
          chartCfg.legendPosition = "bottom";
        }
        // 自动绘制底部的legend
        const colNames: string[] = frame.colArray(dimCols[1]);
        const legendDom = this.drawLegend(
          dimCols[1],
          uniq(colNames),
          sourceDef[dimCols[1]],
          chartCfg.legendPosition === "top" ? chartParams.aggregates : null
        );
        if (chartCfg.legendPosition === "top") {
          legendDom.className = "giochart-legends top-legends";
          ReactDOM.findDOMNode(this).insertBefore(legendDom, dom);
        } else {
          ReactDOM.findDOMNode(this).appendChild(legendDom);
        }
        const legendHeight = legendDom.getBoundingClientRect().height;
        dom.style.height = `calc( 100% - ${legendHeight}px)`;
        canvasHeight = canvasRect.height - legendHeight;
        // 确定Legend高度
      }
      // 存在legend的可能有
      // 横向bar图， 需要计算左侧的距离
      // 补丁: tm的值不仅跟interval有关，也跟timeRange有关，但是取不到timeRange,就以source为准
      if (sourceDef.tm && sourceDef.tm.type === "time") {
        const range = G2.Frame.range(frame, "tm");
        const tmLength: number = G2.Frame.group(frame, ["tm"]).length;
        // TODO: 计算tickInterval
        const [startTime, endTime] = G2.Frame.range(frame, "tm");
        const interval = (endTime - startTime)  / (canvasRect.width - 90) * 80;
        if (endTime - startTime > 86400000) {
          sourceDef.tm.tickInterval = Math.ceil(interval / 86400000) * 86400000;
        } else {
          sourceDef.tm.tickInterval = Math.ceil(interval / 3600000) * 3600000;
        }
      }
      if (chartParams.adjust === "percent") {
        sourceDef["..percent"] = {
          formatter: formatPercent,
          type: "linear"
        };
      }
      if (chartParams.chartType === "bar") {
        const maxWordLength = Math.max.apply(null, map(frame.colArray(dimCols[0]), "length"));
        chartCfg.margin[3] = Math.min(120, 25 + 12 * maxWordLength);
        canvasHeight = Math.max(15 * frame.rowCount(), canvasHeight);
        // 横向柱图微图显示时，文字重叠
        // if (canvasRect.width < 400) {
        sourceDef[metricCols[0]].tickCount = 4;
        // }
      }
      // TODO：排序
      // frame = this.sort(frame);

      const chart = new G2.Chart({
        container: dom,
        forceFit: true,
        height: canvasHeight || 300,
        plotCfg: {
          margin: isThumb ? [0, 0, 0, 0] : chartCfg.margin
        }
      });

      chart.source(frame, sourceDef);
      if (!isThumb) { // 如果是Thumb，禁止显示
        if (chartCfg.pos !== "MMD" && !chartCfg.legendPosition && !chartCfg.skipMetric) {
          metricCols.forEach((s: string) => {
            if (s !== "val") {
              if (chartCfg.transpose) {
                chart.axis(s, {title: {fill: "#999", textAlign: "right"}, titleOffset: 30});
              } else {
                chart.axis(s, {title: {fill: "#999", textAlign: "center"}});
              }
            }
          });
        }
      }
      if (chartCfg.axis !== undefined) {
        chart.axis(chartCfg.axis);
      }
      if (chartCfg.tooltip !== undefined) {
        chart.tooltip(chartCfg.tooltip);
      } else if (["line", "area"].includes(chartCfg.geom) && !isThumb) {
        chart.tooltip({crosshairs: true});
      }
      if (chartCfg.transpose) {
        const coord = chart.coord("rect").transpose();
        if (chartCfg.reflect) {
          coord.reflect(chartCfg.reflect);
        }
        if (chartCfg.scale) {
          coord.scale(1, 1);
        }
      }
      let adjust = chartParams.adjust;
      if (adjust === "percent") {
        adjust = "stack";
      }
      if ("line" === chartCfg.geom) {
        adjust = undefined;
      } else if ("interval" !== chartCfg.geom && chartParams.adjust === "dodge") {
        adjust = undefined;
      }
      // position
      let pos = chartCfg.pos === "MM" ?
        (metricCols[0] + "*" + metricCols[1]) :
        (dimCols[0] + "*" + metricCols[0]);
      if (chartCfg.colorTheme && !chartParams.colorTheme) {
        chartParams.colorTheme = chartCfg.colorTheme;
      }

      let geom;
      if (chartCfg.geom === "area" && chartParams.adjust === "dodge") {
        geom = chart.line().size(2);
      } else {
        geom = chart[chartCfg.geom](adjust);
      }
      if (chartCfg.pos === "MMD") { // 双轴,周期对比会有另一条线
        chart.line().size(2).position(dimCols[0] + "*" + metricCols[1]).color("#d6dce3").tooltip(metricCols[1]);
        // drawLegend
      }

      // position and colored
      if (dimCols.length < 2) {
        if (chartCfg.pos !== "MM") {
          pos = G2.Stat.summary.sum(pos);
        }
        geom.position(pos);
        if (chartParams.colorTheme) {
          geom.color(`rgb(${chartParams.colorTheme})`);
        } else if (chartCfg.pos === "MMD") {
          geom.color(G2.Theme.defaultColor); // Wrong
        }
      } else {
        geom.position(chartParams.adjust === "percent" ? G2.Stat.summary.percent(pos) : pos);
        if (chartCfg.pos !== "MMD") {
          geom.color(dimCols[1]);
          // 自动绘制底部的legend
        } else if (chartParams.colorTheme) {
          geom.color(`rgb(${chartParams.colorTheme})`).size(2);
        }
      }

      if (chartCfg.counter || chartCfg.skipMetric) { // 留存点缀
        const pointGeom = chart.point().shape("circle").size(3).position(pos).tooltip(false);
        if (dimCols.length > 1) {
          pointGeom.color(dimCols[1]);
        }
      }

      if (chartCfg.hideAxis) {
        chart.axis(metricCols[1], false);
      }

      // 横向图需要设label
      if (chartCfg.label && chartParams.aggregates) {
        const sum = chartParams.aggregates[0];
        if (sum) {
          geom.label(metricCols[0], {
            custom: true, // 使用自定义文本
            offset: 5,
            renderer:  (text: string, item: any) => formatPercent(item.point[metricCols[0]] / sum)
          });
        }
      }

      // size
      if (chartCfg.size) {
        geom.size(chartCfg.size);
      } else if (chartCfg.pos === "MM" && metricCols.length > 2) {
        geom.size(metricCols[2], 30, 5);
      }

      if (chartCfg.shape) {
        geom.shape(chartCfg.shape);
      }
      if (chartCfg.geom === "area" && adjust !== "stack") { // 为了area 好看点,画线
        const styleGeom = chart.area();
        if (chartParams.colorTheme) {
          styleGeom.color(`l(90) 0:rgba(${chartParams.colorTheme}, 0.3) 1:rgba(${chartParams.colorTheme}, 0.1)`);
        } else {
          styleGeom.opacity(.3);
        }

        if (chartCfg.shape) {
          styleGeom.shape(chartCfg.shape);
        }
        styleGeom.position(pos); // .size(2);
        if (dimCols.length > 1 && chartCfg.pos !== "MMD") {
          // styleGeom.color(dimCols[1]);
        }
        // if (chartCfg.tooltipchange) {
        styleGeom.tooltip("");
        // }
      }
      // legend
      if (chartCfg.pos === "MMD" && !isThumb) {
        chart.legend({
          position: "bottom"
        });
      } else {
        chart.legend(false);
      }
      // 针对周期对比图的tooltip
      if (!isThumb) {
        if (chartCfg.appendTip) { // hard code
          geom.tooltip(metricCols + "*" + chartCfg.appendTip);
          chart.on("tooltipchange", (ev: any) => {
            const l = ev.items.length;
            for (let i = 0; i * 2 < l; i += 1) {
              const origin = ev.items[i * 2].point._origin;
              const origin2 = ev.items[i * 2 + 1].point._origin;
              ev.items[i] = ev.items[i * 2];
              ev.items[i].value = `${ev.items[2 * i].name}: ${formatPercent(origin.conversion_rate)}, ${ev.items[2 * i + 1].name}: ${origin2.conversion}`;
              ev.items[i].name = origin.comparison_value || origin.metric_name;
            }
            ev.items.splice(l / 2, l / 2);
          });
        } else if (chartCfg.tooltipchange) {
          // 前面把rate字段加上了
          geom.tooltip("rate*" + metricCols[0]);
          const isHour = chartParams.granularities[0].interval < 864e5;
          chart.tooltip(true, {map: {title: "rate"}});
          chart.on("tooltipchange", (ev: any) => {
            ev.items[0] = ev.items[1];
            ev.items[0].name = getTooltipName(ev.items[0], "tm", isHour);
            if (ev.items.length > 2) {
              ev.items[1] = ev.items[2];
              ev.items[1].name = getTooltipName(ev.items[1], "tm_", isHour);
              ev.items.splice(ev.items.length - 1);
            }
          });
        } else if (chartParams.chartType === "bubble") {
          geom.tooltip(metricCols.join("*") + "*" + dimCols[0]);
          chart.tooltip(true, {map: {title: dimCols[0]}});
          chart.on("tooltipchange", (ev: any) => {
            ev.items.splice(ev.items.length - 1);
          });
        }
      }
      // 针对funnel的分群

      // others
      if (this.props.hasOwnProperty("select") && this.props.select) {
        geom.selected(true, {
          selectedMode: "single", // "multiple" || "single"
          style: {fill: "#fe9929"}
        });
        if (dimCols[0] !== "tm") {
          // plotclick=图表坐标系内的事件  itemselected=图形元素上的事件
          const selectCols = (chartCfg.pos ? metricCols.slice(0, 2) : [dimCols[0]]) as string[];
          chart.on("plotclick", (evt: any) => this.selectHandler(evt, selectCols));
          chart.on("itemunselected", (evt: any) => this.unselectHandler(evt, selectCols));
        }
      }

      chart.render();
      this.chart = chart;
      try {
        const vds = window._vds;
        vds.track("report_render_success", {
          project_id: window.accountId,
          project_name: window.project.name,
          chart_name: this.props.trackWords.name,
          board_name: this.props.trackWords.board_name,
          chart_type: chartParams.chartType,
          report_load_time: Date.now() - this.props.startTime,
          channel_name: this.props.trackWords.channel_name
        });
      } catch (e) { return ; }

    } catch (e) {
      // render error
      try {
        const vds = window._vds;
        vds.track("report_render_fail", {
          project_id: window.accountId,
          project_name: window.project.name,
          chart_name: this.props.trackWords.name,
          board_name: this.props.trackWords.board_name,
          chart_type: chartParams.chartType,
          report_load_time: Date.now() - this.props.startTime,
          channel_name: this.props.trackWords.channel_name
        });
      } catch (e) { return ; }
    }
  }
  // 不能用state去绘制，因为时间顺序的问题
  private drawLegend(dim: string, coloredDim: string[], scaleDef: G2Scale, aggregates: number[]): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "giochart-legends";
    const colorArray = G2.Global.colors.default;
    const ul: HTMLElement = document.createElement("ul");
    ul.innerHTML = coloredDim.map((n: string, i: number): string => (
      `<li data-val="${n}" title="${scaleDef.formatter ? scaleDef.formatter(n) : n}">` +
        `<svg fill="${colorArray[i % colorArray.length]}"><rect width="11" height="11" zIndex="3"></rect></svg>` +
        (scaleDef.formatter ? scaleDef.formatter(n) : n) +
         (aggregates ? `：<span>${formatPercent(aggregates[i])}</span>` : "") +
      `</li>`
      )).join("");
    dom.appendChild(ul);
    this.legends = coloredDim.map((n: string, i: number) => ({
      color: G2.Global.colors.default[i],
      dotDom: dom.querySelector(`li:nth-child(${1 + i})`),
      isChecked: true,
      name: n
    }));
    // 绑定事件
    ul.addEventListener("click", (e) => {
      let target = e.target as HTMLElement;
      const currentTarget = e.currentTarget as HTMLElement;
      while (currentTarget.contains(target)) {
        const value = target.getAttribute("data-val");
        if (value) {
          e.stopPropagation();
          const checkedLegend: any[] = filter(this.legends, { isChecked: true });
          if (checkedLegend.length > 1 || checkedLegend[0].name !== value) {
            this.filter(dim, value);
          }
          return;
        }
        target = target.parentNode as HTMLElement;
      }
    });
    if (aggregates) { // funnel，没有scroll
      return dom;
    }
    // 超出部分通过箭头scroll
    const scroller = document.createElement("div");
    scroller.className = "giochart-legend-scroller";
    scroller.innerHTML = '<span><i class="anticon anticon-caret-up" data-action="up"></i></span><span><i class="anticon anticon-caret-down" data-action="down"></i></span>';
    dom.appendChild(scroller);
    let scrollTop = 0;
    scroller.addEventListener("click", (e) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      const cHeight = ul.getBoundingClientRect().height;
      const action = target.getAttribute("data-action");
      if (action === "up" && scrollTop > 19) {
        scrollTop -= 20;
        ul.style.transform = `translate(0, ${-scrollTop}px)`;
      } else if (action === "down" && cHeight > scrollTop + 70) {
        scrollTop += 20;
        ul.style.transform = `translate(0, ${-scrollTop}px)`;
      }
    });

    // TODO: 这段好像没用
    document.body.addEventListener("resize", (e) => {
      const domHeight = dom.getBoundingClientRect().height;
      const cHeight = ul.getBoundingClientRect().height;
      dom.style.textAlign = domHeight < 21 ? "center" : "left";
      scroller.style.display = cHeight > 70 ? "block" : "none";
    });
    const domHeight = dom.getBoundingClientRect().height;
    const cHeight = ul.getBoundingClientRect().height;
    ul.style.textAlign = domHeight < 25 ? "center" : "left";
    scroller.style.display = cHeight > 70 ? "block" : "none";

    // document.body.dispatchEvent("resize");
    // dom.onResize();

    return dom;
  }

  private filter(dim: any, name: string) {
    const obj = find(this.legends, { name }) as any;
    const filterNames: string[] = [];
    obj.isChecked = obj.isChecked ? false : true;
    this.legends.forEach((v: any) => {
      if (v.isChecked) {
        v.dotDom.className = "";
        filterNames.push(v.name);
      } else {
        // v.dotDom.querySelector('svg').style.fill = "#999";
        v.dotDom.className = "disabled";
      }
    });
    this.chart.filter(dim, filterNames)
    this.chart.repaint();
  }

  private unselectHandler(ev: any, selectCols: string[]) {
    return;
  }

  private selectHandler(ev: any, selectCols: string[]) {
    const shape = ev.shape;
    if (shape) {
      const mode = ev.geom._attrs.selectedCfg.selectedMode;
      if (shape.get("selected")) {
        const item = shape.get("origin");
        // 过滤
        const metaSelected = pick(item._origin, selectCols);
        if (mode === "single") {
          this.props.select(metaSelected, this.lastSelectedShape);
          this.lastSelectedShape = metaSelected;
        } else {
          this.props.select(metaSelected, null);
        }
      } else {
        const item = shape.get("origin");
        this.props.select(null, pick(item._origin, selectCols));
      }
    }
  }

  private buildSourceConfig(chartParams: DrawParamsProps): SourceConfig {
    const sourceDef: SourceConfig = {};
    const chartConfig = getChartConfig(chartParams.chartType);

    chartParams.columns.forEach((m: Metric) => {
      sourceDef[m.id] = {
        alias: m.name,
        type: (m.isDim) ? "cat" : "linear",
      };
      if (m.isRate) {
        sourceDef[m.id].min = 0;
        sourceDef[m.id].formatter = formatPercent;
      } else if (!m.isDim) {
        sourceDef[m.id].min = 0;
        sourceDef[m.id].formatter = formatNumber;
      }
    });
    if (sourceDef.tm) {
      sourceDef.tm = {
        tickCount: 4,
        type: ( chartConfig.geom !== "interval" ? "time" : "timeCat" ), // TODO 可能有其他case
        formatter: (v: number) => moment.unix(v / 1000).format(v % 864e5 === 576e5 ? "MM-DD ddd" : "HH:mm")
      };
    }

    // 针对留存的补丁， Fuck！
    if (chartConfig.counter === "day") {
      const tm = find(chartParams.columns, { id: "tm" });
      const dict: any = { day: "天", week: "周", month: "月" };
      sourceDef.tm = {
        formatter: (n: number): string => (n > 0 ? `${n}${dict[tm.counter]}后` : `当${dict[tm.counter]}`),
        tickCount: 4,
        type: "linear", // TODO 可能有其他case
      };
    }

    return sourceDef;
  }
}

const getTooltipName = (item: any, key: string, isHour: boolean) => {
  const point: any = item.point._origin[key];
  return moment.unix(point / 1000).format("YYYY-MM-DD ddd" + (isHour ? " HH:mm" : ""));
}
export default Chart;
