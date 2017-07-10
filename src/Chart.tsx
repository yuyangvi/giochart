/**
 * 图表的绘制，
 * TODO： 按照声明式去配置
 */

import G2 = require("g2");
import {
  defaultsDeep, find, filter, fromPairs, groupBy,
  isArray, invokeMap, isEmpty, isEqual, isMatch,
  map, merge, pick, some, uniq, zip, zipObject
} from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {ChartProps, DrawParamsProps, Granulariy, Metric, Source} from "./ChartProps";
import { CHARTTHEME, CHARTTYPEMAP } from "./chartConfig";
import { formatNumber, formatPercent, countTickCount } from "./utils";
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
    return { frame, sourceDef };
  },
  retention: (frame: any, metricCols: string[]) => {
    // 增加流失人数字段，并且计为负数
    const lossWord = "loss";
    const maxRetention = G2.Frame.max(frame, "retention");
    frame.addCol(lossWord, (obj: any) => maxRetention - obj.retention);
    // chartParams.columns.push({ id: lossWord, name: "流失人数", isDim: false });
    metricCols.push(lossWord);
    const sourceDef = {
      loss: {
        alias: "流失人数",
        type: "cat",
        formatter: (n: number) => formatNumber(Math.abs(n))
      },
      tm: {type: "cat"}
    };
    return { frame, sourceDef };
  }
};
class Chart extends React.Component <ChartProps, any> {
  private chart: any;
  private legends: any;
  // private selectMode: string = "multiple";
  private lastSelectedShape: any = null;
  private constructor(props: ChartProps) {
    super();
    // G2 的主题有bug，legend读的是G2.Theme的颜色，因此直接覆盖Theme更合适
    const theme = G2.Util.mix(true, G2.Theme, CHARTTHEME);
    G2.Global.setTheme(theme);
    G2.Global.animate = navigator.hardwareConcurrency && navigator.hardwareConcurrency > 7;
  }
  public render() {
    return (
        <div className="giochart" style={this.props.style} />
    );
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
          // ReactDOM.findDOMNode(this).innerHTML = "";
        }
        this.drawChart(nextProps.chartParams, source, nextProps.isThumb);
      } else if (JSON.stringify(source) !== JSON.stringify(this.props.source)) {
        // this.changeData(source);
        if (this.chart) {
          this.chart.destroy();
          // ReactDOM.findDOMNode(this).innerHTML = "";
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
      (col: string) => (typeof obj[col] === "number")
    ));
  }
  private combineMetrics(frame: any, cfg: any, columns: any[]) {
    const [dimCols, metricCols] = invokeMap(groupBy(columns, "isDim"), "map", (n: any) => n.id) as string[][];
    const METRICDIM = "metric";
    const METRICVAL = "val";
    // make scales;
    if (cfg.geom !== "point" || cfg.geom.length > 1 || cfg.withRate) {
      return { frame, metricCols, dimCols, scales: this.buildScales(columns, cfg.geom)};
    }

    const metricNames: string[] = map(filter(columns, { isDim: false }), "name") as string[];
    const metricDict = fromPairs(zip(metricCols, metricNames));
    frame = G2.Frame.combinColumns(frame, metricCols, METRICVAL, METRICDIM, dimCols);
    dimCols.push(METRICDIM);
    const isRate = find(columns, { id: metricCols })[0].isRate;
    columns = filter(columns, { isDim: true }).concat([
      { id: "metric", isRate, isDim: false, formatterMap: metricDict },
      { id: "value", isRate: true, isDim: false }
    ]);
    this.buildScales(columns, cfg.geom);
    // TODO: this.sortLegend();

    return { frame, metricCols: [METRICDIM], dimCols, scales: this.buildScales(columns, cfg.geom) };
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
  private calculatePosition(metricCols: string[], dimCols: string[], chartCfg: any) {
    if (chartCfg.geom === "point") {
      return metricCols[0] + "*" + metricCols[1];
    }
    return dimCols[0] + "*" + metricCols[0];
  }
  private calculateColor(dimCols: string[], colorTheme: string) {
    if (colorTheme) {
      return `l(90) 0:rgba(${colorTheme}, 0.8) 1:rgba(${colorTheme}, 0.1)`;
      // return `rgb(${colorTheme})`;
    } else if (dimCols.length > 1) {
      return dimCols[1];
    }
    return;
  }
  private calculatePlot(frame: any, chartCfg: any, dimCols: string[]) {
    const margin = [20, 30, 30, 50];
    let colPixels:any = null;
    let pixels:number[] = null;
    if (chartCfg.transpose) {
      const maxWordLength = Math.max.apply(null, map(frame.colArray(dimCols[0]), "length"));
      let c = document.createElement('canvas');
      // Get the context of the dummy canvas
      let ctx = c.getContext('2d');
      // Set the context.font to the font
      ctx.font = CHARTTHEME.fontSize + " "+ CHARTTHEME.fontFamily;
      // Measure the string
      pixels = frame.colArray(dimCols[0]).map((col:string)=>{return ctx.measureText(col).width});
      margin[3] = 5 + CHARTTHEME["axis"].labelOffset + Math.min(CHARTTHEME.maxPlotLength, Math.ceil(Math.max.apply(null, pixels)));
      //no max plot
      //margin[3] = 5 + CHARTTHEME["axis"].labelOffset + Math.ceil(Math.max.apply(null, pixels));
      colPixels= Object.assign({}, ...frame.colArray(dimCols[0]).map((k:string, i:number) => {return {[k]: pixels[i]}}))
    }
    if (!chartCfg.periodOverPeriod && isArray(chartCfg.geom)) { // 双轴图
      margin[1] = 50;
    }
    // 如果没有legend, 通常左边会有标题显示
    return {margin:margin, colPixels:colPixels};
  }
  private drawChart(chartParams: DrawParamsProps, source: any[], isThumb: boolean = false) {
    // 防止destroy删除父节点
    const dom = document.createElement("div");
    dom.style.height = "100%";
    ReactDOM.findDOMNode(this).appendChild(dom);
    const canvasRect = dom.getBoundingClientRect();
    // 建立Frame, 并后期修正
    const chartConfig = CHARTTYPEMAP[chartParams.chartType];
    let frame = new G2.Frame(source);
    // 多值域合并,并返回新的columns
    const lastCombined = this.combineMetrics(frame, chartConfig, chartParams.columns);
    const metricCols = lastCombined.metricCols;
    const dimCols = lastCombined.dimCols;
    let scales: any = lastCombined.scales;
    const chartType: string = chartParams.chartType;
    // adjustFrame
    if (adjustFrame[chartType]) {
      const { frame: adFrame, sourceDef } = adjustFrame[chartType](frame, metricCols);
      frame = adFrame;
      scales = defaultsDeep(sourceDef, scales);
    }

    // 清洗脏数据
    frame = this.washRecord(frame, metricCols);

    // x轴tickCount
    if (scales.tm) {
      scales.tm.tickInterval = countTickCount(frame, canvasRect.width);
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
        chartConfig.legendPosition === "top" ? chartParams.aggregates : null
      );
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
    const position = this.calculatePosition(metricCols, dimCols, chartConfig);
    // color/shape
    const color = this.calculateColor(dimCols, chartParams.colorTheme || chartConfig.colorTheme);
    // 参考线

    // render配置
    let canvasHeight = canvasRect.height - legendHeight;
    if (chartConfig.transpose) {
      canvasHeight = Math.max(15 * frame.rowCount(), canvasHeight);

    }

    const plot = this.calculatePlot(frame, chartConfig, dimCols);
    const chart = new G2.Chart({
      container: dom,
      forceFit: true,
      height: canvasHeight || 300,
      plotCfg: {
        margin: plot.margin
      }
    });

    chart.source(frame, scales);
    chart.axis(chartConfig.axis);
    chart.axis(dimCols[0],{
      formatter: function(val:string) {
        if(plot.colPixels){
         if(plot.colPixels[val] <= CHARTTHEME.maxPlotLength){
           return val;
         }else{
           let wordLength= Math.floor(CHARTTHEME.maxPlotLength * val.length / plot.colPixels[val]) -3;
           console.log(val.substring(0,wordLength));
           return val.substring(0, wordLength) + '...';
         }
        }else{
          return val;
        }
      },
      labelOffset: CHARTTHEME["axis"].labelOffset
    });
    if (chartConfig.transpose) {
      const coord = chart.coord("rect").transpose(chartConfig.transpose);
      if (chartConfig.reflect) {
        coord.reflect(chartConfig.reflect);
      }
    }
    const geomType = isArray(chartConfig.geom) ? chartConfig.geom[0] : chartConfig.geom;

    // 参考线,周期对比图线在后
    if (isArray(chartConfig.geom) && chartConfig.periodOverPeriod) {
      chart[chartConfig.geom[1]]().position(dimCols[0] + "*" + metricCols[1]).color("#ccc");
      chart.axis(metricCols[0], false);
    }
    const geom = chart[geomType](adjust);
    // 参考线，双轴图线在后
    if (isArray(chartConfig.geom) && !chartConfig.periodOverPeriod) {
      chart[chartConfig.geom[1]]().position(dimCols[0] + "*" + metricCols[1]).color("#ccc");
    }

    if (chartConfig.shape) {
      geom.shape(dimCols[1], chartConfig.shape);
    }
    geom.position(position);
    if (color) {
      geom.color(color);
    }
    if (chartConfig.label) {
      // geom.label(chartConfig.label);
      geom.label(metricCols[0], {
        offset: -5
      });

    }
    if (chartConfig.tooltip) {
      geom.tooltip(chartConfig.tooltip);
    }
    chart.legend(!isArray(chartConfig.geom));

    // 参考线

    // geom.selected(true, {
    //   selectedMode: "single", // "multiple" || "single"
    //   style: {fill: "#fe9929"}
    // });
    const selectCols = (chartConfig.geom === "point" ? metricCols.slice(0, 2) : dimCols) as string[];
    chart.on("plotclick", (evt: any) => this.selectHandler(evt, selectCols));
    chart.on("itemunselected", (evt: any) => this.unselectHandler(evt, selectCols));

    chart.render();
    this.chart = chart;
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
          this.filter(dim, value);
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
    console.log('unselectHandler', ev, selectCols);
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

  private buildScales(columns: any[], geom: string): SourceConfig {
    const scaleDef: SourceConfig = {};
    // 日期在外面设置
    columns.forEach((m: Metric) => {
      if (m.id === "tm") {
        scaleDef.tm = {
          tickCount: 4,
          type: geom === "line" ? "time" : "timeCat", // TODO 可能有其他case
          formatter: (v: number) => moment.unix(v / 1000).format(v % 864e5 === 576e5 ? "MM-DD ddd" : "HH:mm")
        };
      } else if (m.isDim) {
        scaleDef[m.id] = {
          alias: m.name,
          type: "cat",
        };
      } else {
        scaleDef[m.id] = {
          alias: m.name,
          type: "linear",
          min: 0,
          formatter: m.isRate ? formatPercent : formatNumber,
          tickCount: 4
        };
      }
    });
    return scaleDef;
  }
}

const getTooltipName = (item: any, key: string, isHour: boolean) => {
  const point: any = item.point._origin[key];
  return moment.unix(point / 1000).format("YYYY-MM-DD ddd" + (isHour ? " HH:mm" : ""));
}
export default Chart;
