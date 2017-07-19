import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";
const retentionData: Source = [
  { retention: 2045, type: "ww"}, // 23
  { retention: 1045, type: "dssasdga/zkjdhakj a说的/卡萨丁和卡号卡时间的话/asjdsd"},
  { retention: 1421, type: "ss"}
];

const chartParams: DrawParamsProps = {
  adjust: "stack",
  chartType: "bar",
  columns: [
    { id: "type", name: "type", isDim: true, isRate: false },
    { id: "retention", name: "留存", isDim: false, isRate: false }
  ],
};
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={retentionData} />
);
export default EasyChart;
