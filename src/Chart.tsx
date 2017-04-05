import G2 = require("g2");
import { assign, filter, find, fromPairs, isEmpty, isEqual, isMatch, map, merge, pick, some, zip, zipObject } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {ChartProps, DrawParamsProps, Granulariy, Metric, Source} from "./ChartProps";
import * as moment from "moment";
import { formatNumber } from "./utils";
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

const getChartConfig: any = (chartType: string) => {
  const defaultMetric = {
    combineMetrics: true,
    geom: "line",
    margin: [10, 30, 50, 50]
  };
  // 将图表类型变成不同步骤的组合
  const chartTypeMap: any[string] = {
    area: {geom: "area"},
    bar:    { geom: "interval", reflect: "y", transpose: true, label: true, margin: [20, 20, 10, 10] },
    bubble: { geom: "point", pos: "MM", combineMetrics: false, shape: "circle" },
    comparison: {geom: "area", pos: "MMD", combineMetrics: false, hideAxis: true, tooltipchange: "custom", colorTheme: "252, 95, 58" },
    dualaxis: { geom: "interval", pos: "MMD", combineMetrics: false, margin: [10, 50, 50, 50] },
    funnel: { geom: "line", size: 2 },
    line:   { geom: "line", size: 2 },
    retention: { geom: "line", size: 2, counter: "day" },
    singleNumber: { geom: "area", shape: "smooth", combineMetrics: false, axis: false, tooltip: false, margin: [0, 0, 0, 0], colorTheme: "252, 95, 58" },
    vbar:   { geom: "interval" }
};
  return merge({}, defaultMetric, chartTypeMap[chartType]);
};

class Chart extends React.Component <ChartProps, any> {
  private chart: any;
  // private selectMode: string = "multiple";
  private lastSelectedShape: any = null;
  private constructor(props: ChartProps) {
    super();
    // 强制切换theme
    /*const colors = [
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
    ];*/
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
    const defaultColor = "#abce5b";
    // G2 的主题有bug，legend读的是G2.Theme的颜色，因此直接覆盖Theme更合适
    const theme = G2.Util.mix(true, G2.Theme, {
      animate: false,
      axis: {
        bottom: {
          labels: { autoRotate: false },
          title: null
        },
        left: {
          labels: { autoRotate: false },
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
      shape: {
        area: { fill: "#5FB6C7" },
        interval: { fill: defaultColor, fillOpacity: 1 },
        line: { stroke: "#5FB6C7" }
      },
      tooltipMarker: {
        stroke: defaultColor
      },
      legend: {
        bottom: {
          dy: 20
        }
      }
    });
    // G2.track(false);
    G2.Global.setTheme(theme);
  }
  public render() {
    return <div className="giochart" style={this.props.style} />;
  }
  // 这个函数是用来区分changeData还是draw, 通常尽量不要用componentWillReceiveProps
  private componentWillReceiveProps(nextProps: ChartProps) {
    if (isEmpty(nextProps.source)) {
      return;
    }
    const source: Source = nextProps.source;
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
      if (!isEqual(this.props.chartParams, nextProps.chartParams)) { // 配置修改了，重新绘制
        if (this.chart) {
          this.chart.destroy();
        }
        this.drawChart(nextProps.chartParams, source);
      } else {
        this.changeData(source);
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
        // const metricDict = fromPairs(zip(metricCols, metricNames));
      }
      this.chart.changeData(frame);
    } else {
      this.drawChart(this.props.chartParams, source);
    }
  }
  private componentDidMount() {
    const { chartParams, source } = this.props;
    if (this.props.source) {
      if (this.chart) {
        this.chart.destroy();
      }
      this.drawChart(chartParams, source);
    }
  }

  private componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private drawChart(chartParams: DrawParamsProps, source: any[]) {
    const dom = document.createElement("div");
    dom.style.height = "100%";
    ReactDOM.findDOMNode(this).appendChild(dom);

    const canvasRect = dom.getBoundingClientRect();
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
    let sourceDef = this.buildSourceConfig(chartParams);

    // 建立Frame
    let metricCols = map(filter(chartParams.columns, { isDim: false }), "id");
    let dimCols    = map(filter(chartParams.columns, { isDim: true }), "id");
    let frame      = new G2.Frame(source);

    // 周期对比图 的 hook
    if (chartParams.chartType === "comparison") {
      // 给frame增加字段， 用以显示tooltip的title
      frame.addCol("rate", (record: any) => (
        record[metricCols[1]] ? (record[metricCols[0]] / record[metricCols[1]] - 1) : 0
      ));
      sourceDef.rate = {
        formatter: (n: number): string => `${parseFloat((100 * n).toPrecision(3))}%`
      };

      // 获取metricid, 计算最大值,统一两条线的区间范围
      const mids = map(filter(chartParams.columns, { isDim: true }), "id");
      const maxScale: number = Math.max.apply(null, map(mids, (col: string) => G2.Frame.max(frame, col)));
      mids.forEach((id: string) => {
        sourceDef[id].min = 0;
        sourceDef[id].max = maxScale;
      });
    } else if (chartParams.chartType === "singleNumber") {
      dimCols = ["tm"];
    }
    // 需要多值域合并
    if (chartCfg.combineMetrics && metricCols.length > 1) {
      console.log(metricCols);
      frame = G2.Frame.combinColumns(frame, metricCols, "val", "metric", dimCols);
      if (chartCfg.shape === "funnel") {
        dimCols = ["metric"];
      } else {
        dimCols.push("metric");
      }
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
    }

    // 计算legend的留空，tick的留空
    // 存在legend的可能有
    // 横向bar图， 需要计算左侧的距离
    let canvasHeight: number = canvasRect.height;
    if (chartParams.chartType === "bar") {
      const maxWordLength = Math.max.apply(null, map(frame.colArray(dimCols[0]), "length"));
      chartCfg.margin[3] = Math.min(120, 25 + 12 * maxWordLength);
      canvasHeight = Math.max(15 * frame.rowCount(), canvasHeight);
    }

    const chart = new G2.Chart({
      container: dom,
      forceFit: true,
      height: canvasHeight || 300,
      plotCfg: {
        margin: chartCfg.margin
      }
    });
    chart.source(frame, sourceDef);

    // geom
    if (chartCfg.axis !== undefined) {
      chart.axis(chartCfg.axis);
    }
    if (chartCfg.tooltip !== undefined) {
      chart.tooltip(chartCfg.tooltip);
    } else {
      if (["line", "area"].includes(chartCfg.geom)) {
        chart.tooltip({ crosshairs: true });
      }
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

    // console.log(chartCfg.geom, adjust);
    const geom = chart[chartCfg.geom](adjust);

    // position
    let pos = chartCfg.pos === "MM" ?
      (metricCols[0] + "*" + metricCols[1]) :
      (dimCols[0] + "*" + metricCols[0]);
    if (chartCfg.colorTheme && !chartParams.colorTheme) {
      chartParams.colorTheme = chartCfg.colorTheme;
    }

    // position and colored
    if (dimCols.length < 2) {
      pos = G2.Stat.summary.sum(pos);
      geom.position(pos);
      if (chartParams.colorTheme) {
        if (chartCfg.geom === "area") {
          geom.color(`l(90) 0:rgba(${chartParams.colorTheme}, 0.3) 1:rgba(${chartParams.colorTheme}, 0.1)`);
        } else {
          geom.color(`rgb(${chartParams.colorTheme})`);
        }
      } else if (chartCfg.pos === "MMD") {
        geom.color(G2.Theme.defaultColor); // Wrong
      }
    } else {
      geom.position(chartParams.adjust === "percent" ? G2.Stat.summary.percent(pos) : pos);
      if (chartCfg.pos !== "MMD") {
        geom.color(dimCols[1]);
      } else if (chartParams.colorTheme) {
        geom.color(`l(90) 0:rgba(${chartParams.colorTheme}, 0.3) 1:rgba(${chartParams.colorTheme}, 0.1)`);
      }
    }

    if (chartCfg.pos === "MMD") { // 双y
      chart.line().size(2).position(dimCols[0] + "*" + metricCols[1]).color("#d6dce3").tooltip(metricCols.join("*"));
      if (chartCfg.hideAxis) {
        chart.axis(metricCols[1], false);
      }
    }
    if (chartCfg.label) {
      geom.label(metricCols[0]);
    }

    // size
    if (chartCfg.size) {
      geom.size(chartCfg.size);
    }
    if (chartCfg.shape) {
      geom.shape(chartCfg.shape);
    }

    if (chartCfg.geom === "area" && adjust !== "stack") { // 为了area 好看点,画线
      const styleGeom = chart.line();
      if (chartParams.colorTheme) {
        styleGeom.color(`rgb(${chartParams.colorTheme})`);
      }

      if (chartCfg.shape) {
        styleGeom.shape(chartCfg.shape);
      }
      styleGeom.position(pos).size(2);
      if (dimCols.length > 1 && chartCfg.pos !== "MMD") {
        // styleGeom.color(dimCols[1]);
      }
      if (chartCfg.tooltipchange) {
        styleGeom.tooltip(false);
      }
    }
    // legend
    chart.legend({
      position: "bottom"
    });

    // 针对周期对比图的tooltip
    if (chartCfg.tooltipchange) {
      // 前面把rate字段加上了
      geom.tooltip("rate");
      chart.tooltip(true, { map : { title: "rate" } });
      chart.on("tooltipchange", (ev: any) => {
        if (ev.items.length === 4) {
          ev.items[0] = ev.items[3];
          ev.items[1] = ev.items[2];
          ev.items.splice(2);
        } else {
          ev.items[0] = ev.items[1];
          ev.items.splice(1);
        }
      });
    }

    // others
    if (this.props.hasOwnProperty("select") && this.props.select) {
      geom.selected(true, {
        selectedMode: "single", // "multiple" || "single"
        style: { fill: "#fe9929" }
      });
      if (dimCols[0] !== "tm") {
        // plotclick=图表坐标系内的事件  itemselected=图形元素上的事件
        const selectCols = (chartCfg.pos ? metricCols.slice(0, 2) : [dimCols[0]]) as string[] ;
        chart.on("plotclick", (evt: any) => this.selectHandler(evt, selectCols));
        chart.on("itemunselected", (evt: any) => this.unselectHandler(evt, selectCols));
      }
    }
    chart.render();
    this.chart = chart;
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
    // 检查是不是周期对比图
    chartParams.columns.forEach((m: Metric) => {
      sourceDef[m.id] = {
        alias: m.name,
        type: (m.isDim) ? "cat" : "linear"
      };
      if (m.isRate) {
        sourceDef[m.id].min = 0;
        sourceDef[m.id].formatter = (n: number): string => `${parseFloat((100 * n).toPrecision(3))}%`;
      } else {
        sourceDef[m.id].formatter = formatNumber;
      }
    });

    if (chartParams.granularities) {
      chartParams.granularities.forEach((glt: Granulariy) => {
        if (glt.interval) {
          sourceDef[glt.id] = {
            mask: (glt.interval >= 864e5) ? "mm-dd" : "HH:MM",
            tickCount: 4,
            type: ( chartConfig.geom !== "interval" ? "time" : "timeCat" ) // TODO 可能有其他case
          };
        }
      });
    }

    // 针对留存的补丁， Fuck！
    if (chartConfig.counter === "day") {
      sourceDef.tm = {
        formatter: (n: number): string => (n > 0 ? `${n}天后` : `当天`),
        tickCount: 4,
        type: "linear", // TODO 可能有其他case
      };
    }
    /*sourceDef.metric = {
      type: "cat"
    };*/
    return sourceDef;
  }
}
export default Chart;
