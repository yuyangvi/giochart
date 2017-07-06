import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";
const retentionData: Source = [
  { tm: 1499299200000 - 28800000, retention: 2045, type: "A" },
  { tm: 1499212800000 - 28800000, retention: 1600, type: "A" },
  { tm: 1499126400000 - 28800000, retention: 1582, type: "A" },
  { tm: 1499040000000 - 28800000, retention: 1482, type: "A" },
  { tm: 1498953600000 - 28800000, retention: 1251, type: "A" },

  { tm: 1499299200000 - 28800000, retention: 1045, type: "B" },
  { tm: 1499212800000 - 28800000, retention: 600, type: "B" },
  { tm: 1499126400000 - 28800000, retention: 582, type: "B" },
  { tm: 1499040000000 - 28800000, retention: 482, type: "B" },
  { tm: 1498953600000 - 28800000, retention: 251, type: "B" }
];

const chartParams: DrawParamsProps = {
  adjust: "stack",
  chartType: "vbar",
  columns: [
    { id: "tm", name: "时间", isDim: true, isRate: false },
    { id: "type", name: "type", isDim: true, isRate: false },
    { id: "retention", name: "留存", isDim: false, isRate: false }
  ],
};
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={retentionData} />
);
export default EasyChart;
