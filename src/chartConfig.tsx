// TODO: 将图表类型变成不同步骤的组合
export const CHARTTYPEMAP: any[string] = {
  area: { geom: "area"}, // yes
  bar: { geom: "interval", reflect: "y", transpose: true, label: true },
  bubble: { geom: "point", shape: "circle" }, // 默认为point的直接MM，不合并metric
  comparison: { geom: ["area", "line"], periodOverPeriod: true, colorTheme: "252, 95, 58" }, // geom为数组，不combine
  dualaxis: { geom: ["interval", "line"] },
  funnel: { geom: "line", withRate: true },
  funnelChart: {geom: "line", withRate: true, legendPosition: "top"},
  line: { geom: "line" },
  retention: { geom: "interval", shape: ["hollowRect", "stroke"], withRate: true, combineMetrics: true },
  retentionTrend: { geom: "line", withRate: true },
  singleNumber: { geom: "area", shape: "smooth", isThumb: true, colorTheme: "252, 95, 58" },
  vbar: { geom: "interval" }, // 329615792
  donut: { geom: "interval", emptyDim: true, coord: "theta", aggregator: true }
}

const COLORS = [
  "#5FB6C7", "#FFD159",
  "#C9C77C", "#FA7413",
  "#D6DCE3", "#6F5D45",
  "#FDF0A1", "#bf1f41",
  "#A1EBDE", "#CBBD8C",
  "#B96285", "#8a73c9",
  "#005a03", "#320096",
  "#673000", "#2d396b"
];

const TRENDCOLORS = [
  "#C9DE00", "#FF4500",
  "#00BFD8", "#FFEC00",
  "#734A3F", "#375167",
  "#587E8D", "#9E9E9E",
  "#FFBF00", "#3C4FBC",
  "#6AB626", "#AB02B6",
  "#00ABFB", "#6F31BE",
  "#FE0061", "#00B341",
  "#009988", "#FF2825",
  "#FFA300", "#0096FB"
];

// G2 的主题有bug，legend读的是G2.Theme的颜色，因此直接覆盖Theme更合适
export const CHARTTHEME: any = {
  animate: false,
  labelOffset: 15,
  titleOffset: 60,
  axis: {
    bottom: {
      labels: { autoRotate: false },
      title: null
    },
    left: {
      labels: { autoRotate: false },
      line: null,
      tickLine: { lineWidth: 0, stroke: "#fcc" },
      title: null
    },
    right: {
      labels: { autoRotate: false },
      title: null
    }
  },
  colors: {
    default: COLORS,
    intervalStack: COLORS,
    trend: TRENDCOLORS
  },
  defaultColor: "#5FB6C7",
  legend: false,
  shape: {
    area: { fill: "#5FB6C7" },
    hollowPoint: {fill: "#5FB6C7" },
    hollowInterval: { lineDash: [3, 2], lineWidth: 1},
    interval: { fill: "#abce5b", fillOpacity: 1, stroke: "#5FB6C7"},
    line: { stroke: "#5FB6C7", lineWidth: 2 },
    point: {fill: "#5FB6C7", fillOpacity: .5 }
  },
  tooltip: {
    tooltipMarker: {
      stroke: "#5FB6C7"
    }
  },
  maxPlotLength: 200,
  fontSize: "12px",
  fontFamily: "Arial"
};
