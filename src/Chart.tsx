import G2 = require("g2");
import { assign, filter, find, fromPairs, isEmpty, isEqual, isMatch, map, merge, pick, some, zip, zipObject } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import {ChartProps, DrawParamsProps, Granulariy, Metric, Source} from "./ChartProps";
import * as moment from "moment";
interface G2Scale {
  type: string;
  formatter?: (n: number) => string;
  range?: [number, number];
  alias?: string;
  tickCount?: number;
  ticks?: string[];
  mask?: string;
  nice?: boolean;
}
interface SourceConfig {
  [colName: string]: G2Scale;
}

const getChartConfig: any = (chartType: string) => {
  const defaultMetric = {
    combinMetrics: true,
    geom: "line",
    margin: [10, 30, 60, 50]
  };
  // 将图表类型变成不同步骤的组合
  const chartTypeMap: any[string] = {
    area: {geom: "area"},
    bar:    { geom: "interval", reflect: "y", transpose: true, margin: [20, 20, 10, 100] },
    bubble: { geom: "point", pos: "MM", combinMetrics: false },
    comparison: {geom: "area", pos: "MMD", combinMetrics: false, hideAxis: true, tooltipchange: "custom" },
    dualaxis: { geom: "interval", pos: "MMD", combinMetrics: false },
    funnel: { axis: false, geom: "intervalSymmetric", transpose: true, scale: true, shape: "funnel" },
    line:   { geom: "line", size: 2 },
    retention: {geom: "line", size: 2, counter: "day"},
    singleNumber: {geom: "area", shape: "smooth", combineMetrics: false, axis: false, tooltip: false, margin: [0, 0, 0, 0]},
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
    const colors = [
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
    ];
    const theme = G2.Util.mix(true, {}, G2.Theme, {
      animate: false,
      axis: {
        bottom: {
          labels: { autoRotate: false },
          title: null,
        },
        left: {
          labels: {
            autoRotate: false
          },
          title: null
        }
      },
      colors: {
        default: colors,
        intervalStack: colors
      },
      defaultColor: "#fc5f3a",
      shape: {
        area: { fill: "#fc5f3a", fillOpacity: 0.3 },
        interval: { fill: "#d5375f" },
        line: { stroke: "#fc5f3a" }
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
    if (nextProps.source) {
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

      if (chartCfg.combinMetrics && metricCols.length > 1) {
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

    const chart = new G2.Chart({
      container: dom,
      forceFit: true,
      height: canvasRect.height || 350,
      plotCfg: {
        margin: chartCfg.margin
      }
    });

    let sourceDef = this.buildSourceConfig(chartParams);

    // 建立Frame
    let metricCols = map(filter(chartParams.columns, { isDim: false }), "id");
    const dimCols    = map(filter(chartParams.columns, { isDim: true }), "id");
    let frame      = new G2.Frame(source);

    // 周期对比图 的 hook
    if (chartParams.chartType === "comparison") {
      // 获取metricid, 计算最大值
      const mids = map(filter(chartParams.columns, { isDim: true }), "id");
      const maxScale: number = Math.max.apply(null, map(mids, (col: string) => G2.Frame.max(frame, col)));
      mids.forEach((id: string) => {
        sourceDef[id].min = 0;
        sourceDef[id].max = maxScale;
      });
    }

    // 需要多值域合并
    if (chartCfg.combinMetrics && metricCols.length > 1) {
      frame = G2.Frame.combinColumns(frame, metricCols, "val", "metric", dimCols);
      dimCols.push("metric");
      const metricNames = map(filter(chartParams.columns, { isDim: false }), "name");
      const metricDict = fromPairs(zip(metricCols, metricNames));
      sourceDef.metric = { formatter: (n: string) => metricDict[n] };
      metricCols = ["val"];
    }

    // 计算legend的留空，tick的留空
    // 存在legend的
    chart.source(frame, sourceDef);

    // geom
    if (chartCfg.axis !== undefined) {
      chart.axis(chartCfg.axis);
    }
    if (chartCfg.tooltip !== undefined) {
      chart.tooltip(chartCfg.tooltip);
    } else {
      chart.tooltip({ crosshairs: true });
    }
    if (chartCfg.transpose) {
      const coord = chart.coord("rect").transpose();
      if (chartCfg.reflect) {
        coord.reflect(chartCfg.reflect);
      }
    }
    let adjust = chartParams.adjust;
    if ("line" === chartCfg.geom) {
      adjust = undefined;
    } else if ("interval" !== chartCfg.geom && chartParams.adjust === "dodge") {
      adjust = undefined;
    }

    // console.log(chartCfg.geom, adjust);
    const geom = chart[chartCfg.geom](adjust);

    // position
    const pos = chartCfg.pos === "MM" ?
      (metricCols[0] + "*" + metricCols[1]) :
      (dimCols[0] + "*" + metricCols[0]);

    if (dimCols.length < 2) {
      geom.position(G2.Stat.summary.sum(pos));
    } else {
      geom.position(pos);
      if (chartCfg.pos !== "MMD") {
        geom.color(dimCols[1]);
      } else if (this.props.colorTheme) {
        geom.color(`rgb(${this.props.colorTheme})`);
      }
    }
    if (chartCfg.pos === "MMD") { // 双y
      chart.line().size(2).position(dimCols[0] + "*" + metricCols[1]).color("#e1dac8");
      if (chartCfg.hideAxis) {
        chart.axis(metricCols[1], false);
      }
    }

    // size
    if (chartCfg.size) {
      geom.size(chartCfg.size);
    }
    if (chartCfg.scale) {
      geom.scale(1, 1);
    }
    if (chartCfg.shape) {
      geom.shape(chartCfg.shape);
    }

    if (chartCfg.geom === "area" && adjust !== "stack") { // 为了area 好看点,画线
      const styleGeom = chart.line();
      if (this.props.colorTheme) {
        styleGeom.color(`rgb(${this.props.colorTheme})`);
      }

      if (chartCfg.shape) {
        styleGeom.shape(chartCfg.shape);
      }
      styleGeom.position(pos).size(2);
      if (dimCols.length > 1 && chartCfg.pos !== "MMD") {
        //styleGeom.color(dimCols[1]);
      }
    }
    // legend
    chart.legend({
      itemWrap: false,
      position: "bottom"
    });

    if (chartCfg.tooltipchange) {
      // chart.tooltip(true, {title: null});
      chart.on("tooltipchange", (ev: any) => {
        const item: any = ev.items[0]; // 获取tooltip要显示的内容
        const originPoint = item.point._origin;
        const tm = item.name === "上一周期" ? originPoint.tm_ : originPoint.tm;
        moment.locale("zh-cn");
        item.name = moment(tm).format("YYYY-MM-DD dddd hh:mm");
        if (ev.items.length > 1) {
          item.title = (item.value / ev.items[1].value * 100 - 100).toPrecision(3) + "%";
          ev.items[1].title = item.title;
          ev.items[1].name = moment(originPoint.tm_).format("YYYY-MM-DD dddd hh:mm");
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
        chart.on("itemunselected", (evt: any) => { this.unselectHandler(evt, selectCols) });
      }
    }
    chart.render();
    this.chart = chart;
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
        sourceDef[m.id].formatter = (n: number): string => `${(100 * n).toPrecision(3)}%`;
      }
    });

    if (chartParams.granularities) {
      chartParams.granularities.forEach((glt: Granulariy) => {
        if (glt.interval) {
          sourceDef[glt.id] = {
            mask: (glt.interval >= 864e5) ? "mm-dd" : "HH:MM",
            nice: true,
            type: ( chartConfig.geom !== "interval" ? "time" : "timeCat" ) // TODO 可能有其他case
          };
        }
      });
    }

    // 针对留存的补丁， Fuck！
    if (chartConfig.counter === "day") {
      sourceDef.tm = {
        formatter: (n: number): string => (n > 0 ? `第${n}天` : `当天`),
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
