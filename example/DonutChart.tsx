import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const chartParams: DrawParamsProps =  {
  adjust: "percent",
  aggregator: [400570],
  chartType: "donut",
  columns: [
    { id: "rt", name: "一级访问来源", isDim: true, isRate: false },
    { id: "ogWZ55d4", name: "页面浏览量", isDim: false, isRate: false }
  ],
  granularities: []
};
const source: Source = [
  { "rt": "直接访问", "ogWZ55d4": 288259 },
  { "rt": "搜索引擎",  "ogWZ55d4": 66940 },
  { "rt": "外部链接", "ogWZ55d4": 38646 },
  { "rt": "社交媒体", "ogWZ55d4": 6558 }
];
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={source} />
);
export default EasyChart;
