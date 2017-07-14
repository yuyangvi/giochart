import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";
const cdata: Source = [
  { tm: 1498147200000, JoOL0rE9: 7.11, tm_: 1496937600000, JoOL0rE9_: 8.19 },
  { tm: 1498233600000, JoOL0rE9: 5.45, tm_: 1497024000000, JoOL0rE9_: 7.65 },
  { tm: 1498320000000, JoOL0rE9: 5.71, tm_: 1497110400000, JoOL0rE9_: 11.57 },
  { tm: 1498406400000, JoOL0rE9: 7.65, tm_: 1497196800000, JoOL0rE9_: 6.79 },
  { tm: 1498492800000, JoOL0rE9: 8.34, tm_: 1497283200000, JoOL0rE9_: 7.16 },
  { tm: 1498579200000, JoOL0rE9: 8.38, tm_: 1497369600000, JoOL0rE9_: 7.82 },
  { tm: 1498665600000, JoOL0rE9: 5.46, tm_: 1497456000000, JoOL0rE9_: 7.40 },
  { tm: 1498752000000, JoOL0rE9: 4.86, tm_: 1497542400000, JoOL0rE9_: 8.93 },
  { tm: 1498838400000, JoOL0rE9: 4.93, tm_: 1497628800000, JoOL0rE9_: 7.52 },
  { tm: 1498924800000, JoOL0rE9: 4.12, tm_: 1497715200000, JoOL0rE9_: 5.71 },
  { tm: 1499011200000, JoOL0rE9: 5.92, tm_: 1497801600000, JoOL0rE9_: 10.04 },
  { tm: 1499097600000, JoOL0rE9: 5.07, tm_: 1497888000000, JoOL0rE9_: 8.23 },
  { tm: 1499184000000, JoOL0rE9: 5.41, tm_: 1497974400000, JoOL0rE9_: 5.35 },
  { tm: 1499270400000, JoOL0rE9: 5.49, tm_: 1498060800000, JoOL0rE9_: 6.56 }
];

const chartParams: DrawParamsProps = {
    adjust: "dodge",
    aggregator: { values: [13.078740157480315, 17.546332046332047] },
    chartType: "comparison",
    colorTheme: "252, 95, 58",
    columns: [
      { id: "tm", name: "时间", isDim: true, isRate: false },
      { id: "JoOL0rE9", name: "当前周期", isDim: false, isRate: false },
      { id: "tm_", isDim: true, isRate: false},
      { id: "JoOL0rE9_", name: "上一周期", isDim: false, isRate: false }
    ],
    granularities: [{ id: "tm", interval: 86400000, period: "auto" }]
  }

;
const ComparisonChart = (props: any) => (
  <Chart chartParams={chartParams} source={cdata} />
);
export default ComparisonChart;
