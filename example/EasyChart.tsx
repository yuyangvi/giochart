import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const retentionData: Source = [
  // { retention: 2045, type: "ww"},
  // { retention: 1045, type: "成都正合地产顾问股份有限公司"},
  // { retention: 1421, type: "ss"}
  // {tm: 1499875200000, ogWZ55d4: 72480},
  // {tm: 1499961600000, ogWZ55d4: 62980},
  // {tm: 1500048000000, ogWZ55d4: 15991},
  // {tm: 1500134400000, ogWZ55d4: 9677},
  // {tm: 1500220800000, ogWZ55d4: 76813},
  // {tm: 1500307200000, ogWZ55d4: 66597},
  // {tm: 1500393600000, ogWZ55d4: 72752}

  {country: 'Asia', year: '1750', value: 502},
  {country: 'Asia', year: '1800', value: 635},
  {country: 'Asia', year: '1850', value: 809},
  {country: 'Asia', year: '1900', value: 947},
  {country: 'Asia', year: '1950', value: 1402},
  {country: 'Asia', year: '1999', value: 3634},
  {country: 'Asia', year: '2050', value: 5268},
  // {country: 'Africa', year: '1750', value: 106},
  // {country: 'Africa', year: '1800', value: 107},
  // {country: 'Africa', year: '1850', value: 111},
  // {country: 'Africa', year: '1900', value: 133},
  // {country: 'Africa', year: '1950', value: 221},
  // {country: 'Africa', year: '1999', value: 767},
  // {country: 'Africa', year: '2050', value: 1766},
  // {country: 'Europe', year: '1750', value: 163},
  // {country: 'Europe', year: '1800', value: 203},
  // {country: 'Europe', year: '1850', value: 276},
  // {country: 'Europe', year: '1900', value: 408},
  // {country: 'Europe', year: '1950', value: 547},
  // {country: 'Europe', year: '1999', value: 729},
  // {country: 'Europe', year: '2050', value: 628},
  // {country: 'Oceania', year: '1750', value: 200},
  // {country: 'Oceania', year: '1800', value: 200},
  // {country: 'Oceania', year: '1850', value: 200},
  // {country: 'Oceania', year: '1900', value: 300},
  // {country: 'Oceania', year: '1950', value: 230},
  // {country: 'Oceania', year: '1999', value: 300},
  // {country: 'Oceania', year: '2050', value: 460},

];

const chartParams: DrawParamsProps = {
  adjust: "stack",
  chartType: "area",
  aggregator: { values: [4510] },
  columns: [
    // { id: "type", name: "type", isDim: true, isRate: false },
    //  { id: "retention", name: "留存", isDim: false, isRate: false }
    { id: "year", name: "时间", isDim: true, isRate: false},
    //{ id: "country", name: "页面浏览量", isDim: true, isRate: false},
    { id: "value", name: "值", isDim: false, isRate: false}
  ],
};
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={retentionData} />
);
export default EasyChart;
