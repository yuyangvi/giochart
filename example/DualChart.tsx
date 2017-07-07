import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";
const dualData: Source = [
  { tm: 1498924800000, y9Gbpp8x: 1799, ovvxBBGw: 0.072 },
  { tm: 1499011200000, y9Gbpp8x: 1482, ovvxBBGw: 0.087 },
  { tm: 1499097600000, y9Gbpp8x: 1582, ovvxBBGw: 0.107 },
  { tm: 1499184000000, y9Gbpp8x: 1600, ovvxBBGw: 0.121 },
  { tm: 1499270400000, y9Gbpp8x: 2045, ovvxBBGw: 0.284 }
];

const chartParams: DrawParamsProps = {
  adjust: "dodge",
  chartType: "dualaxis",
  columns: [
    { id: "tm", name: "时间", isDim: true },
    { id: "y9Gbpp8x", name: "访问用户量", isDim: false, isRate: false },
    { id: "ovvxBBGw", name: "访问用户留存率", isDim: false, isRate: true }
  ],
};
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={dualData} />
);
export default EasyChart;
