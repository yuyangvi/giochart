import { filter, fromPairs, isEmpty, isEqual, isMatch, map, merge, pick, some, zip, zipObject } from "lodash";
import * as React from "react";
import * as ReactDOM from "react-dom";
import G2 = require("g2");
import {ChartProps, DrawParamsProps, Granulariy, Metric, Source} from "./ChartProps";

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
    combinMetrics: false,
    geom: "line",

  };
  // 将图表类型变成不同步骤的组合
  const chartTypeMap: any[string] = {
    bar:    { geom: "interval", transpose: true },
    bubble: { geom: "point" },
    funnel: { axis: false, geom: "intervalSymmetric", transpose: true, scale: true, shape: "funnel" },
    line:   { geom: "line", size: 2 },
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
      colors: {
        default: colors,
        intervalStack: colors
      },
      defaultColor: "#fc5f3a",
      shape: {
        area: { fill: "#fc5f3a" },
        interval: { fill: "#d5375f" },
        line: { stroke: "#fc5f3a" }
      }
    });

    G2.Global.setTheme(theme);
  }
  public render() {
    return <div style={{ height: "100%" }} />;
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
      this.chart.changeData(source);
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
    const chart = new G2.Chart({
      container: dom,
      forceFit: true,
      height: canvasRect.height || 350,
      plotCfg: {}
    });

    const sourceDef = this.buildSourceConfig(chartParams);
    // 建立Frame
    const metricCols = map(filter(chartParams.columns, { isDim: false }), "id");
    const dimCols    = map(filter(chartParams.columns, { isDim: true }), "id");
    let frame      = new G2.Frame(source);
    // 需要多值域合并
    const chartCfg = getChartConfig(chartParams.chartType);
    if (chartCfg.combinMetrics && metricCols.length) {
      frame = G2.Frame.combinColumns(frame, metricCols, "val", "metric", dimCols);
      dimCols.push("metric");
      const metricDict = fromPairs(zip(metricCols, name));
      const mColVals = frame.colArray("metric");
      const mColNames = mColVals.map((n: string) => metricDict[n]);
      frame.colReplace("metric", mColNames);
    }
    chart.source(frame, sourceDef);

    // geom
    if (chartCfg.axis) {
      chart.axis(chartCfg.axis);
    }
    if (chartCfg.transpose) {
      chart.coord("rect").transpose();
    }
    const geom = chart[chartCfg.geom](chartParams.adjust);
    // position
    // 我靠，维度不同的时间也不一样?
    let pos = chartCfg.pos ?
      (metricCols[0] + "*" + metricCols[1]) :
      (dimCols[0] + "*" + metricCols[0]);
    if (dimCols.length <= 1) {
      geom.position(G2.Stat.summary.sum(pos));
    } else {
      geom.position(pos).color(dimCols[1]);
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
        // chart.on("itemunselected", (evt: any) => { this.unselectHandler(evt, selectCols) });
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
    chartParams.columns.forEach((m: Metric) => {
      sourceDef[m.id] = {
        alias: m.name,
        type: (m.id !== "tm" && m.isDim) ? "cat" : "linear"
      };
      if (m.isRate) {
        sourceDef[m.id].formatter = (n: number): string => `${(100 * n).toPrecision(3)}%`;
      }
    });
    // 设置
    if (chartParams.granularities) {
      chartParams.granularities.forEach((glt: Granulariy) => {
        if (glt.interval) {
          sourceDef[glt.id] = {
            mask: (glt.interval >= 86400) ? "mm-dd" : "HH:mm",
            nice: true,
            type: ( chartConfig.geom === "line" ? "time" : "timeCat" ) // TODO 可能有其他case
          };
        } else if (glt.counter === "day") {
          sourceDef[glt.id] = {
            formatter: (n: number): string => (n > 0 ? `第${n}天` : `当天`),
            type: "linear", // TODO 可能有其他case
          };
        }
      });
    }
    return sourceDef;
  }
}
export default Chart;
