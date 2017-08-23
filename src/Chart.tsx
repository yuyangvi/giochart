/**
 * 图表的绘制，
 * TODO： 按照声明式去配置
 */

import G2 = require("g2");
import {
  assign, defaultsDeep, find, filter, fromPairs, groupBy,
  isArray, invokeMap, isEmpty, isEqual, isMatch,
  map, merge, pick, reverse, some, uniq, zip, zipObject
} from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  ChartProps, DrawParamsProps, Metric, Source, G2Scale, SourceConfig, ChartDimValues,
  Granulariy
} from "./ChartProps";
import { CHARTTHEME, CHARTTYPEMAP, ResizeChartType, RetentionCOT } from "./chartConfig";
import { formatNumber, formatPercent, countTickCount, getTmFormat, getAxisFormat, mergeFrame, filterValuesByTickCount } from "./utils";
import * as moment from "moment";
moment.locale("zh-cn");

const countTick = (maxTick: number, total: number) => {
  const interval = Math.ceil(total / maxTick);
  return Math.ceil(total / interval);
};
const adjustFrame: any = {
  // 周期对比图，需要给tooltip增加百分比,同时对齐数据
  comparison: (frame: any, metricCols: string[]) => {
    frame.addCol("rate", (record: any) => (
      record[metricCols[1]] ? (record[metricCols[0]] / record[metricCols[1]] - 1) : 0
    ));
    const sourceDef: any = {
      rate: {
        formatter: formatPercent,
        type: "linear"
      }
    };

    // 获取metricid, 计算最大值,统一两条线的区间范围
    const maxScale: number = Math.max.apply(null, map(metricCols, (col: string) => G2.Frame.max(frame, col)));
    metricCols.forEach((id: string) => {
      sourceDef[id] = { max: maxScale };
    });
    metricCols.push("rate");
    return { frame, sourceDef, metricCols };
  },
  retentionColumn: (frame: any, metricCols: string[]) => {
    // 增加流失人数字段，并且计为负数
    const lossWord = "loss";
/*
*  retention 多列 步骤
*  step1：判断根据chartParams 是否含有comparison_value 为 true
*  step2：Frame.filter(frame, "comparison_value")进行分组
*  step3：计算每个里面的最大retention 然后添加addcol(lossword) 跟现在一样
*  step4：Frame.merge()合并
*  step5：返回
* */
    const maxRetention = G2.Frame.max(frame, "retention");
    frame.addCol(lossWord, (obj: any) => maxRetention - obj.retention);
    // chartParams.columns.push({ id: lossWord, name: "流失人数", isDim: false });
    metricCols = [lossWord, "retention"];
    /* const sourceDef = {
      loss: {
        alias: "流失人数",
        type: "cat",
        formatter: (n: number) => formatNumber(Math.abs(n))
      }
    };*/
    return { frame, sourceDef: {}, metricCols };
  }
};

class Chart extends React.Component <ChartProps, any> {
  private chart: any;
  private legends: any;
  private inspectDom: HTMLElement;
  // private selectMode: string = "multiple";
  private lastSelectedShape: any = null;
  private constructor(props: ChartProps) {
    super();
    // G2 的主题有bug，legend读的是G2.Theme的颜色，因此直接覆盖Theme更合适
    const theme = G2.Util.mix(true, G2.Theme, CHARTTHEME);
    G2.Global.setTheme(theme);
    G2.Global.animate = navigator.hardwareConcurrency && navigator.hardwareConcurrency > 7;
    this.inspectDom = null;
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
      const dim = find(chartParams.columns, { isDim: true });
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
          // this.chart.get("container").innerHTML = "";
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
      const chartCfg = CHARTTYPEMAP[chartParams.chartType];
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
      // ReactDOM.findDOMNode(this).innerHTML = "";
    }
  }

  private washRecord(frame: any, metricCols: string[]) {
    return G2.Frame.filter(frame, (obj: any) => metricCols.every(
      (col: string) => (typeof obj[col] === "number" || obj[col] === undefined)
    ));
  }

  private getDimValues(frame: any, columns: Metric[], columnId: string): ChartDimValues {
    let values: string[] = null;
    values = map(frame.data, (data: any) => {
        // const col: any = columns.filter((c) => c.id === "retention_" + data.turn );
        return data.turn;
    });
    return { id: columnId, dimValues: values };
  }

  private combineMetrics(frame: any, cfg: any, columns: Metric[], preRenderData: (n: any, m: string[]) => any) {
    let [dimCols, metricCols] = invokeMap(groupBy(columns, "isDim"), "map", (n: any) => n.id) as string[][];
    const METRICDIM: string = "metric";
    const METRICVAL: string = "val";

    // make scales;
    if (cfg.emptyDim) {
      dimCols = [null].concat(dimCols);
    }
    let sourceDef: any = null;
    if (preRenderData) {
      const preRenderSource = preRenderData(frame, metricCols);
      frame = preRenderSource.frame;
      sourceDef = preRenderSource.sourceDef;
      metricCols = preRenderSource.metricCols;
    }

    if (!cfg.combineMetrics && (cfg.geom === "point" || isArray(cfg.geom) || cfg.withRate || (metricCols && metricCols.length < 2))) {
      return {
        frame,
        dimCols,
        metricCols,
        scales: this.buildScales(columns, cfg.geom, sourceDef)
      };
    }
    // retention 下 metricDict 对应不上 TODO: fix
    const metricNames: string[] = map(filter(columns, { isDim: false }), "name") as string[];
    let metricDict = fromPairs(zip(metricCols, metricNames));

    // retenton 特殊处理
    if (metricCols[0] === "loss" && metricCols[1] === "retention") {
      metricDict = {};
      metricDict.loss = "未留存人数";
      metricDict.retention = "留存人数";
    }

    // retention 多列要保留 comparison_value 字段 最后绘图参考G2线上demo
    frame = G2.Frame.combinColumns(frame, metricCols, METRICVAL, METRICDIM, dimCols);
    dimCols.push(METRICDIM);
    const examCol = find(columns, { id: metricCols[0] });
    const isRate = examCol ? examCol.isRate : false;

    columns = filter(columns, { isDim: true }).concat([
      { id: "metric", isDim: true, formatterMap: metricDict },
      { id: "val", isRate, isDim: false }
    ]);

    // TODO: this.sortLegend();
    return {
      frame,
      dimCols,
      metricCols: [METRICVAL],
      scales: this.buildScales(columns, cfg.geom, sourceDef)
    };
  }

  private calculateAdjust(adjust: string, geom: string) {
    if (adjust === "percent") {
      return "stack";
    }
    if ("line" === geom || "interval" !== geom && adjust === "dodge") {
      return undefined;
    }
    return adjust;
  }
  private calculatePosition(metricCols: string[], dimCols: string[], chartCfg: any, adjust: string) {
    let postion;
    if (chartCfg.geom === "point") {
      postion = { pos: metricCols[0] + "*" + metricCols[1], x: metricCols[0], y: metricCols[1] };
    } else if (dimCols[0]) {
      postion = { pos: dimCols[0] + "*" + metricCols[0], x: dimCols[0], y: metricCols[0] };
    } else {
      postion = { pos: metricCols[0], x: undefined, y: undefined };
    }

    if (adjust === "percent") {
      return { pos: G2.Stat.summary.percent(postion.pos), x: postion.x, y: postion.y };
    }
    return postion;
  }
  private calculateColor(dimCols: string[], colorTheme: string, gradual: boolean) {
    if (colorTheme) {
      return gradual ? `l(90) 0:rgba(${colorTheme}, 0.8) 1:rgba(${colorTheme}, 0.1)` : `rgb(${colorTheme})`;
      // return `rgb(${colorTheme})`;
    } else if (dimCols.length > 1) {
      return dimCols[1];
    }
    return;
  }
  private calculatePlot(frame: any, chartCfg: any, dimCols: string[], chartType: string) {
    let colPixels: any = null;
    let pixels: number[] = null;
    const margin = [20, 30, 30, 50];
    if (chartCfg.isThumb) {
      return { margin: [0, 0, 0, 0], colPixels: null };
    }
    if (chartCfg.transpose) {
      const maxWordLength = Math.max.apply(null, map(frame.colArray(dimCols[0]), "length"));
      const c: HTMLCanvasElement = document.createElement("canvas");
      // Get the context of the dummy canvas
      const ctx: CanvasRenderingContext2D = c.getContext("2d");
      // Set the context.font to the font
      ctx.font = CHARTTHEME.fontSize + " " + CHARTTHEME.fontFamily;
      // Measure the string
      pixels = frame.colArray(dimCols[0]).map((col: string) => ctx.measureText(col).width);
      margin[3] = 5 + CHARTTHEME.labelOffset + Math.min(CHARTTHEME.maxPlotLength, Math.max(...pixels));
      colPixels = assign({}, ...frame.colArray(dimCols[0]).map((k: string, i: number) => ({[k]: pixels[i]})));
    }

    if (!chartCfg.periodOverPeriod && isArray(chartCfg.geom)) { // 双轴图
      margin[1] = 50;
    }

    if (isArray(chartCfg.geom)) {
      margin[2] = 70;
    }
    if (chartType === "area" || chartType === "bubble" || chartType === "line" || chartType === "vbar") {
      margin[3] = 10 + CHARTTHEME.titleOffset;
    }
    // 如果没有legend, 通常左边会有标题显示
    return { margin, colPixels };
  }
  private tooltipMap(type: string, interval: number) {
    if (type === "funnel") {
      return (ev: any) => {
        const l = ev.items.length;
        for (let i = 0; i * 2 < l; i += 1) {
          const origin = ev.items[i * 2].point._origin;
          const origin2 = ev.items[i * 2 + 1].point._origin;
          ev.items[i] = ev.items[i * 2];
          ev.items[i].value = `${ev.items[2 * i].name}: ${formatPercent(origin.conversion_rate)}, ` +
          `${ev.items[2 * i + 1].name}: ${origin2.conversion}`;
          ev.items[i].name = origin.comparison_value || origin.metric_name;
        }
        ev.items.splice(l / 2, l / 2);
      }
    }
    if (type === "comparison") {
      return (ev: any) => {
            // console.log(ev);
            /*ev.items[0] = ev.items[1];
            ev.items[0].name = getTooltipName(ev.items[0], "tm", false);
            if (ev.items.length > 2) {
              ev.items[1] = ev.items[2];
              ev.items[1].name = getTooltipName(ev.items[1], "tm_", false);
            }*/
         ev.items.splice(ev.items.length - 1);
      }
    }
    if (type === "retention") {
      return (ev: any) => {
        const itemsGroup = groupBy(ev.items, "color");
        const keys = Object.keys(itemsGroup);
        ev.items.splice(0);
        keys.forEach((key: string)  => {
          const items: any = itemsGroup[key];
          if (interval !== null && Object.keys(RetentionCOT[interval]).includes(items[0].value)) {
            ev.items.push(assign({}, items[0], { value: items[1].value }, {name: RetentionCOT[interval][items[0].value]}))
          }else {
            const value = items.map((item: any) => (item.name + ": " + item.value)).splice(1).join(", ");
            let combineValue =  items[0].value ;
            if (value.length) {
              combineValue = combineValue + ", " + value;
            }
            ev.items.push(assign({}, items[0], { value: combineValue }));
          }
        });
      }
    }

    return undefined;
  }

  private drawChart(chartParams: DrawParamsProps, source: any[], isThumb: boolean = false) {
    // 防止destroy删除父节点
    const dom: HTMLElement = document.createElement("div");
    dom.style.height = "100%";
    ReactDOM.findDOMNode(this).appendChild(dom);
    const canvasRect: ClientRect = dom.getBoundingClientRect();
    // 建立Frame, 并后期修正
    const chartConfig = CHARTTYPEMAP[chartParams.chartType];
    let frame = new G2.Frame(source);
    // 多值域合并,并返回新的columns
    const chartType: string = chartParams.chartType;
    const lastCombined = this.combineMetrics(frame, chartConfig, chartParams.columns, adjustFrame[chartType]);
    const metricCols = lastCombined.metricCols;
    const dimCols = lastCombined.dimCols;
    frame = lastCombined.frame;
    const scales: any = lastCombined.scales;

    // 清洗脏数据
    frame = this.washRecord(frame, metricCols);
    let tInterval: number = null;
    // x轴tickCount
    if (scales.tm) {
      // 寻找时间粒度
      const tmGran: Granulariy = find(chartParams.granularities, { id: "tm" });
      const tmInterval = parseInt(tmGran.interval, 10);
      tInterval = tmInterval;
      merge(scales.tm, {
        tickInterval: countTickCount(frame, canvasRect.width, tmInterval),
        formatter: getTmFormat(tmInterval),
        axisFormatter: getAxisFormat(tmInterval)
      });

      window.onresize = () => {
        const currentRect: ClientRect = dom.getBoundingClientRect();
        const tm = merge({}, scales.tm, {
            tickInterval: countTickCount(frame, currentRect.width, tmInterval),
            formatter: getTmFormat(tmInterval),
            axisFormatter: getAxisFormat(tmInterval)
        });
        chart.col(dimCols[0], tm);
        chart.repaint();
      };
    } else if (chartConfig.geom !== "point" && scales[dimCols[0]]) {
      const maxTicks = G2.Frame.group(frame, dimCols[0]).length;
      if (scales[dimCols[0]].type === "linear") {
        scales[dimCols[0]].tickInterval = Math.ceil(60 * maxTicks / (canvasRect.width - 100));
      }
      if (ResizeChartType.includes(chartType) && scales[dimCols[0]].values) {
          const origValues = scales[dimCols[0]].values;
          window.onresize = () => {
             const currentRect: ClientRect = dom.getBoundingClientRect();
             const tickC = Math.ceil(60 * maxTicks / (currentRect.width - 100));
             if (tickC > 1) {
               const newValues = filterValuesByTickCount(tickC, origValues);
               const newFrame = mergeFrame(frame, dimCols[0], newValues.indexs);
               chart.col(dimCols[0], assign({}, scales[dimCols[0]], { tickCount: newValues.values.length, values: newValues.values}));
               chart.changeData(newFrame);
             }else {
                 chart.col(dimCols[0], assign({}, scales[dimCols[0]], { tickCount: origValues.length, values: origValues}));
                 chart.changeData(frame);
             }
          };
      }
    }

    // 百分比
    if (chartParams.adjust === "percent") {
      scales["..percent"] = { formatter: formatPercent, type: "linear" };
    }

    // legend
    let legendHeight = 0;
    if (dimCols.length > 1 && !isArray(chartConfig.geom)) {
      const colNames: string[] = frame.colArray(dimCols[1]);
      const legendDom = this.drawLegend(
        dimCols[1],
        uniq(colNames),
        scales[dimCols[1]],
        chartConfig.legendSingleMode,
        chartConfig.legendPosition === "top" ? chartParams.aggregator.values : null,
        chartParams.attrs ? chartParams.attrs.selection : null, chartType);
      if (chartConfig.legendPosition === "top") {
        legendDom.className = "giochart-legends top-legends";
        ReactDOM.findDOMNode(this).insertBefore(legendDom, dom);
      } else {
        ReactDOM.findDOMNode(this).appendChild(legendDom);
      }
      legendHeight = legendDom.getBoundingClientRect().height;
    }
    dom.style.height = `calc( 100% - ${legendHeight}px)`;
    // canvasHeight = canvasRect.height - legendHeight;

    // geom
    const adjust = this.calculateAdjust(chartParams.adjust, chartConfig.geom);

    // position
    // console.log(frame.s());
    const position = this.calculatePosition(metricCols, dimCols, chartConfig, chartParams.adjust);
    // position = G2.Stat.summary.sum(position);
    // color/shape
    const color = this.calculateColor(
      dimCols,
      chartConfig.colorTheme ? (chartParams.colorTheme || chartConfig.colorTheme) : null,
      (chartType === "singleNum")
    );

    // render配置
    let canvasHeight = canvasRect.height - legendHeight;
    if (chartConfig.transpose) {
      canvasHeight = Math.max(15 * frame.rowCount(), canvasHeight);
    }

    const plot = this.calculatePlot(frame, chartConfig, dimCols, chartParams.chartType);
    const chart = new G2.Chart({
      container: dom,
      forceFit: true,
      height: canvasHeight || 300,
      plotCfg: {
        margin: plot.margin
      }
    });

    const origValues = scales[dimCols[0]] ? scales[dimCols[0]].values : null;
    const maxTicks = G2.Frame.group(frame, dimCols[0]).length;
    const tickC = Math.ceil(60 * maxTicks / (canvasRect.width - 100));
    if (tickC > 1 && ResizeChartType.includes(chartType) && origValues) {
        const newValues = filterValuesByTickCount(tickC, origValues);
        const newFrame = mergeFrame(frame, dimCols[0], newValues.indexs);
        const sal = assign({}, scales[dimCols[0]], { tickCount: newValues.values.length, values: newValues.values});
        const newScales = assign({}, scales, {turn: sal});
        chart.source(newFrame, newScales)
    }else {
        chart.source(frame, scales);
    }

    if (!chartConfig.withRate && !metricCols.includes("val")) {
      metricCols.forEach((s: string) => {
        chart.axis(s, { title: {fill: "#999", textAlign: "center"}});
      });
    }
    if (scales.tm) {
      chart.axis("tm", {
        formatter: scales.tm.axisFormatter
      });
    }
    // chart.axis(chartConfig.isThumb ? false : chartConfig.axis);

    let coord: any = null;
    if (chartConfig.coord) {
      coord = chart.coord(chartConfig.coord, {
        radius: 1,
        inner: 0.7
      });
    } else {
      coord = chart.coord("rect");
    }
    if (chartConfig.transpose) {
      chart.axis(position.x, {
        formatter: (val: string) => {
          if (plot.colPixels) {
            if (plot.colPixels[val] <= CHARTTHEME.maxPlotLength) {
              return val;
            } else {
              const c = document.createElement("canvas");
              const ctx = c.getContext("2d");
              ctx.font = CHARTTHEME.fontSize + " " + CHARTTHEME.fontFamily;
              const ellipsis = ctx.measureText("...").width;
              const chars = val.split("").map((char: string) => ctx.measureText(char).width);
              let plotLength: number = 0; let i: number = 0;
              while (plotLength + ellipsis <= CHARTTHEME.maxPlotLength) {
                plotLength += chars[i];
                i++;
              }
              return val.substring(0, i - 1) + "...";
            }
          }
          return val;
        },
        labelOffset: CHARTTHEME.labelOffset,
      });
    }

    if (chartType === "area" || chartType === "bubble" || chartType === "line" || chartType === "vbar ") {
      chart.axis(position.y, {
        titleOffset: CHARTTHEME.titleOffset,
        title: {
          fontSize: "12",
          textAlign: "center",
          fill: "#999"
        }
      });
    }

    if (chartConfig.transpose) {
      coord.transpose(chartConfig.transpose);
      if (chartConfig.reflect) {
        coord.reflect(chartConfig.reflect);
      }
    }
    const geomType = isArray(chartConfig.geom) ? chartConfig.geom[0] : chartConfig.geom;

    // 参考线,周期对比图线在后
    if (isArray(chartConfig.geom) && chartConfig.periodOverPeriod) {
      chart[chartConfig.geom[1]]().position(dimCols[0] + "*" + metricCols[1]).color("#ccc").tooltip("");
      chart.axis(metricCols[0], false);
    }
    // 本来应该画在legend里面的，但是需要chart.filter
    if (chartConfig.legendSingleMode && dimCols.length > 1) {
      const colNames: string[] = frame.colArray(dimCols[1]);
      chart.filter(dimCols[1], [colNames[0]]);
    }

    const geom = chart[geomType](adjust);
    if (geomType === "area" && dimCols.length < 2) {
      geom.size(2);

    }    // 参考线，双轴图线在后
    if (isArray(chartConfig.geom) && !chartConfig.periodOverPeriod) {
      chart[chartConfig.geom[1]]().position(dimCols[0] + "*" + metricCols[1]).color("#ccc");
    }
    geom.position(position.pos);
    if (!chartConfig.shape && color) {
      if (chartParams.attrs &&  chartParams.attrs.selection && chartParams.attrs.selection.length > 0 ) {
        const colorArray = G2.Global.colors.trend.filter(
          (c: string, i: number) => chartParams.attrs.selection.includes(i)
        );
        geom.color(color, colorArray);
      } else {
        geom.color(color);
      }
    }

    if (chartConfig.shape) {
      if (typeof chartConfig.shape === "string") {
        geom.shape(chartConfig.shape);
      } else {
        geom.color("#B8E986").shape(dimCols[1], chartConfig.shape);
      }
    }
    if (chartConfig.geom === "point" && metricCols.length > 2) {
      geom.size(metricCols[2], 40, 2);
    }
    if (chartConfig.label) {
      // geom.label(chartConfig.label);
      geom.label(metricCols[0], {
        offset: 5
      });
    }
    if (chartConfig.isThumb || chartConfig.tooltip) {
      geom.tooltip(chartConfig.isThumb ? false : chartConfig.tooltip);
    }
    // legend bottom 默认距离canvas底部为30px x轴labe默认距离x轴约20px
    chart.legend(isArray(chartConfig.geom) ? { position: "bottom" } : false);

    if (this.tooltipMap(chartType, tInterval)) {
      if (chartType === "retention" && color) {
        geom.tooltip(color + "*" + metricCols.join("*"));
      }else {
        geom.tooltip(metricCols.join("*"));
      }
      if (metricCols.includes("rate")) { // rate作为title必须放前面,不然有bug
      //  console.log("rate");
        chart.tooltip(true, {map: {title: "rate"}});
      }
      chart.on("tooltipchange", this.tooltipMap(chartType, tInterval));
    }

    chart.tooltip(true, {
      custom: true,
      html:  '<div class="ac-tooltip" style="position:absolute;visibility: hidden;"><span class="ac-title"></span><ul class="ac-list"></ul></div>',
      itemTpl: '<li><svg fill={color} class="ac-svg"><circle cx="3" cy="7" r="3"/></svg>{name}: {value}</li>',
      offset: 10
    });

    // 参考线
    // geom.selected(true, {
    //   selectedMode: "single", // "multiple" || "single"
    //   style: {fill: "#fe9929"}
    // });
    // chart.on("itemselected", (ev: any) => {
    //   const data = ev.data;
    //   if (data) {
    //     console.log(data._origin);
    //     console.log(data.x);
    //     console.log(data.y);
    //   }
    //   if (this.inspectDom === null) {
    //     this.inspectDom = this.createInspectDom(data, scales);
    //     ReactDOM.findDOMNode(this).appendChild(this.inspectDom);
    //   }else {
    //     this.repaintInspectDom(this.inspectDom, data, scales);
    //   }
    // });
    /*
    const selectCols = (chartConfig.geom === "point" ? metricCols.slice(0, 2) : dimCols) as string[];
    chart.on("plotclick", (evt: any) => this.selectHandler(evt, selectCols));
    chart.on("itemunselected", (evt: any) => this.unselectHandler(evt, selectCols));
    */

    if (chartConfig.aggregator) {
      const aggScale = scales[metricCols[0]];
      chart.guide().html(
        [-5.5, 0],
        "<div style=\"text-align:center;white-space: nowrap;\"><p style=\"color:#999;font-size:12px;\">总" +
        aggScale.alias + "</p>" +
        "<p style=\"color:#333;font-size:22px;\">" + aggScale.formatter(chartParams.aggregator.values[0]) + "</p></div>"
      );
    }

    chart.render();
    this.chart = chart;
  }

  // 不能用state去绘制，因为时间顺序的问题
  private drawLegend(
    dim: string,
    coloredDim: string[],
    scaleDef: G2Scale,
    isSingle: boolean,
    aggregates: number[],
    colorSelection: number[],
    chartType: string
  ): HTMLElement {
    const dom = document.createElement("div");
    dom.className = "giochart-legends";
    let colorArray: string[] = null;
    if (colorSelection && colorSelection.length === coloredDim.length) {
      colorArray = G2.Global.colors.trend;
    } else {
      colorArray = G2.Global.colors.default;
      colorSelection = Array.apply(null, Array(20)).map((v: undefined, i: number) => i);
    }
    const ul: HTMLElement = document.createElement("ul");
    ul.innerHTML = coloredDim.map((n: string, i: number): string => {
        const li =  `<li data-val="${n}" ` +
            `title="${scaleDef.formatter ? scaleDef.formatter(n) : n}" class="${isSingle && i > 0 ? "disabled" : ""}">`;
        let svg = null;
        if (chartType === "retentionColumn") {
          if (n === "loss" ) {
            svg = `<svg><rect width="11" height="11" zIndex="3" stroke="#B8E986" fill="white" stroke-width="2" stroke-dasharray="3,2"></rect></svg>`;
          } else {
            svg = `<svg fill="#B8E986"><rect width="11" height="11" zIndex="3" stroke-dasharray="3,2"></rect></svg>`;
          }
        }else {
          svg = `<svg fill="${colorArray[colorSelection[i] % colorArray.length]}"><rect width="11" height="11" zIndex="3"></rect></svg>`;
        }
        let name = n;
        if (scaleDef.mapValues) {
          name = scaleDef.mapValues[i];
        } else if (scaleDef.formatter) {
          name = scaleDef.formatter(n);
        }
        return li + svg + name +
            (aggregates ? `：<span>${formatPercent(aggregates[i])}</span>` : "") +
            `</li>`;
      // `<li data-val="${n}" ` +
      //   `title="${scaleDef.formatter ? scaleDef.formatter(n) : n}" class="${isSingle && i > 0 ? "disabled" : ""}">` +
      //   `<svg fill="${colorArray[colorSelection[i] % colorArray.length]}"><rect width="11" height="11" zIndex="3"></rect></svg>` +
      //   (scaleDef.formatter ? scaleDef.formatter(n) : n) +
      //    (aggregates ? `：<span>${formatPercent(aggregates[i])}</span>` : "") +
      // `</li>`
    }).join("");
    dom.appendChild(ul);
    this.legends = coloredDim.map((n: string, i: number) => ({
      color: G2.Global.colors.default[i],
      dotDom: dom.querySelector(`li:nth-child(${1 + i})`),
      isChecked: !(isSingle && i > 0),
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
          this.filter(dim, value, isSingle);
          return;
        }
        target = target.parentNode as HTMLElement;
      }
    });

    if (aggregates) { // funnelChart，没有scroll
      return dom;
    }
    // 超出部分通过箭头scroll
    const scroller = document.createElement("div");
    scroller.className = "giochart-legend-scroller";

    scroller.innerHTML = '<span><i class="anticon anticon-caret-up" data-action="up"></i></span>' +
      '<span><i class="anticon anticon-caret-down" data-action="down"></i></span>';
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
      dom.style.textAlign = (!isSingle && domHeight < 21) ? "center" : "left";
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

  private filter(dim: any, name: string, isSingle: boolean) {
    const obj = find(this.legends, { name }) as any;
    const filterNames: string[] = [];
    if (obj.isChecked && isSingle) {
      return;
    }
    obj.isChecked = !obj.isChecked;
    this.legends.forEach((v: any) => {
      if (isSingle ? v.name === obj.name : v.isChecked) {
        v.isChecked = true;
        v.dotDom.className = "";
        filterNames.push(v.name);
      } else {
        v.dotDom.className = "disabled";
        v.isChecked = false;
      }
    });
    this.chart.filter(dim, filterNames);
    // this.props.onFiltered && this.props.onFiltered(dim, filterNames);
    this.chart.repaint();
  }

  private unselectHandler(ev: any, selectCols: string[]) {
    // console.log('unselectHandler', ev, selectCols);
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
          // this.props.select(metaSelected, this.lastSelectedShape);
          // this.lastSelectedShape = metaSelected;
      } else {
        const item = shape.get("origin");
        // this.props.select(null, pick(item._origin, selectCols));
      }
    }
  }

  private buildScales(
      columns: any[],
      geom: string | string[],
      defaultScaleDef: SourceConfig): SourceConfig {
    const scaleDef: SourceConfig = {};
    if (typeof geom !== "string") {
      geom = geom[0];
    }
    // 日期在外面设置
    columns.forEach((m: Metric, i: number) => {
      if (m.id === "tm") {
        scaleDef.tm = {
          type: geom === "interval" ? "timeCat" : "time", // TODO 可能有其他case
          // TODO 这里用来显示ToolTip, axis的显示，在chart.axis里面定义
          formatter: (v: number) => moment.unix(v / 1000).format(v % 864e5 === 576e5 ? "MM-DD ddd" : "HH:mm")
        };
      } else if (m.isDim) {
        scaleDef[m.id] = {
          alias: m.name,
          type: "cat"
        };
        if (m.formatterMap) {
          scaleDef[m.id].formatter = (n: string): string => m.formatterMap[n];
        }
        if (m.values) {
          if (i === 0) {
            scaleDef[m.id].values = m.values;
          } else {
            scaleDef[m.id].mapValues = m.values;
          }
        }
      } else {
        scaleDef[m.id] = {
          alias: m.name,
          type: "linear",
          min: 0,
          max: m.isRate ? 1 : undefined,
          formatter: m.isRate ? formatPercent : formatNumber,
          // tickCount: 4
        };
      }
    });
    if (defaultScaleDef) {
      return defaultsDeep(defaultScaleDef, scaleDef) as SourceConfig;
    }
    return scaleDef;
  }

  // private createInspectDom(data: any, scales: any): HTMLElement {
  //   const inspectDom: HTMLElement = document.createElement("div");
  //   inspectDom.className = "giochart-inspect";
  //   inspectDom.style.top = data.y[1] + "px";
  //   inspectDom.style.left = data.x + "px";
  //   inspectDom.innerHTML = "";
  //
  //   return inspectDom;
  // }
  //
  // private repaintInspectDom(inspecDom: HTMLElement, data: any, scales: any){
  //   inspecDom.style.top = data.y[1] + "px";
  //   inspecDom.style.left = data.x + "px";
  // }
  //
  // private calcuteInspectPostion(data: any): number[] {
  //
  //   return [0, 1];
  // }
}

const getTooltipName = (item: any, key: string, isHour: boolean) => {
  const point: any = item.point._origin[key];
  return moment.unix(point / 1000).format("YYYY-MM-DD ddd" + (isHour ? " HH:mm" : ""));
};
export default Chart;
