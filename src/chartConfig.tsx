// TODO: 将图表类型变成不同步骤的组合
export const CHARTTYPEMAP: any[string] = {
  area: { geom: "area" },
  bar: { geom: "interval", reflect: "y", transpose: true, label: true },
  bubble: { geom: "point", shape: "circle" }, // 默认为point的直接MM，不合并metric
  comparison: { geom: ["area", "line"], periodOverPeriod: true }, // geom为数组，不combine
  dualaxis: { geom: ["interval", "line"] },
  funnel: { geom: "line", withRate: true },
  // funnelChart: {geom: "line", withRate: true, legendPosition: "top"},
  line: { geom: "line" },
  retention: { geom: "interval", shape: ["stroke", "hollowRect"], withRate: true },
  retentionTrend: { geom: "line", withRate: true },
  singleNumber: { geom: "area", shape: "smooth", isThumb: true },
  vbar: { geom: "interval" }
}

// 根据字段取得不同的步骤
/*
const COLORS = [
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
*/
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

// G2 的主题有bug，legend读的是G2.Theme的颜色，因此直接覆盖Theme更合适
export const CHARTTHEME = {
  animate: false,
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
    intervalStack: COLORS
  },
  defaultColor: "#5FB6C7",
  legend: {
    bottom: {
      dy: 15
    }
  },
  shape: {
    area: { fill: "#5FB6C7" },
    hollowPoint: {fill: "#5FB6C7" },
    interval: { fill: "#abce5b", fillOpacity: 1, stroke: "#5FB6C7" },
    line: { stroke: "#5FB6C7" },
    point: {fill: "#5FB6C7", fillOpacity: .5 }
  },
  tooltip: {
    tooltipMarker: {
      stroke: "#5FB6C7"
    }
  }
};
