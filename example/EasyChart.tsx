import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const retentionData: Source = [
  { retention: 2045, type: "ww"},
  { retention: 1045, type: "成都正合地产顾问股份有限公司"},
  { retention: 1421, type: "ss"}
  // {tm: 1499875200000, ogWZ55d4: 72480},
  // {tm: 1499961600000, ogWZ55d4: 62980},
  // {tm: 1500048000000, ogWZ55d4: 15991},
  // {tm: 1500134400000, ogWZ55d4: 9677},
  // {tm: 1500220800000, ogWZ55d4: 76813},
  // {tm: 1500307200000, ogWZ55d4: 66597},
  // {tm: 1500393600000, ogWZ55d4: 72752}
];

const chartParams: DrawParamsProps = {
  adjust: "stack",
  chartType: "vbar",
  aggregator: { values: [4510] },
  chartType: "bar",
  columns: [
    { id: "type", name: "type", isDim: true, isRate: false },
     { id: "retention", name: "留存", isDim: false, isRate: false }
    // { id: "tm", name: "时间", isDim: true, isRate: false},
    // { id: "ogWZ55d4", name: "页面浏览量", isDim: false, isRate: false}
  ],
};
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={retentionData} />
);
export default EasyChart;
