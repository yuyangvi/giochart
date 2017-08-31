import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const retentionData: Source = [
    {p: "/", ogWZ55d4: 16636},
    {p: "/projects/GRwXNWPZ/circle/QPDKmxRN", ogWZ55d4: 11078},
    {p: "/login", ogWZ55d4: 10390},
    {p: "_GrowingLocalCircleSelectView", ogWZ55d4: 4248},
    {p: "/signup", ogWZ55d4: 3887},
    {p: "/conversion", ogWZ55d4: 3302},
    {p: "/projects/DPWAJm9n/dashboards/3oLagmz9/charts/a9BXAYnP", ogWZ55d4: 2297},
    {p: "/apps/8723870740277419/circle/embedded", ogWZ55d4: 1883},
    {p: "/projects/nxog09md/overview", ogWZ55d4: 1853},
    {p: "/growth-academy", ogWZ55d4: 1524}
];

const ss = [
    {tm: 1503504000000, ogWZ55d4: 74234},
    {tm: 1503590400000, ogWZ55d4: 66789},
    {tm: 1503676800000, ogWZ55d4: 16862},
    {tm: 1503763200000, ogWZ55d4: 11814},
    {tm: 1503849600000, ogWZ55d4: 72365},
    {tm: 1503936000000, ogWZ55d4: 85493},
    {tm: 1504022400000, ogWZ55d4: 81644}
];

const chartParams: DrawParamsProps = {
    adjust: "dodge",
    aggregator: null,
    chartType: "vbar",
    groupCol: undefined,
    timeRange: "day:8,1",
    attrs: {metricType: "none"},
    columns: [
        {id: "tm", name: "时间", isDim: true, isRate: false},
        {id: "ogWZ55d4", name: "页面浏览量", isDim: false, metricId: {id: "ogWZ55d4", level: "complex"}, isRate: false}
   ],
    granularities: [{id: "tm", interval: "86400000"}]
};

// const chartParams: DrawParamsProps = {
//     adjust: "dodge",
//     aggregator: {values: [392800]},
//     chartType: "bar",
//     colorTheme: undefined,
//     groupCol: undefined,
//     timeRange: "day:8,1",
//     attrs: {metricType: "none"},
//     columns: [
//         {id: "p", name: "页面", isDim: true, isRate: false},
//         {id: "ogWZ55d4", name: "页面浏览量", isDim: false, metricId: {id: "ogWZ55d4", level: "complex"}, isRate: false}
//     ],
//     granularities: []
// };
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={ss} />
);
export default EasyChart;
