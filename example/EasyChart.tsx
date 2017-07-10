import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";
const retentionData: Source = [
  { retention: 2045, type: "swdwkjhasd"}, //23
  { retention: 1045, type: "/projects/iagwd/kzhdkjhd/客户端/ajshdjkahsdkjh/qsasds"},
  { retention: 1421, type: "按a阿斯达"}
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
