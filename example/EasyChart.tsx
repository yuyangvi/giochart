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
    chartType: "area",
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

const  sss = JSON.parse('[{"tm":1504368000000,"pp":3.5060240963855422},{"tm":1504371600000,"pp":2.7954545454545454},{"tm":1504375200000,"pp":2.411764705882353},{"tm":1504378800000,"pp":2.9},{"tm":1504382400000,"pp":1.8936170212765957},{"tm":1504386000000,"pp":3.8076923076923075},{"tm":1504389600000,"pp":2.1666666666666665},{"tm":1504393200000,"pp":2.72},{"tm":1504396800000,"pp":3.425531914893617},{"tm":1504400400000,"pp":4.234567901234568},{"tm":1504404000000,"pp":4.099099099099099},{"tm":1504407600000,"pp":5.540322580645161},{"tm":1504411200000,"pp":4.988636363636363},{"tm":1504414800000,"pp":4.881188118811881},{"tm":1504418400000,"pp":4.79646017699115},{"tm":1504422000000,"pp":5.768656716417911},{"tm":1504425600000,"pp":6.669354838709677},{"tm":1504429200000,"pp":5.971698113207547},{"tm":1504432800000,"pp":4.805555555555555},{"tm":1504436400000,"pp":5.631067961165049},{"tm":1504440000000,"pp":4.793893129770993},{"tm":1504443600000,"pp":7.5},{"tm":1504447200000,"pp":6.365591397849462},{"tm":1504450800000,"pp":8.495327102803738}]');
const chartParams1: DrawParamsProps = {
    adjust: "dodge",
    aggregator: null,
    chartType: "vbar",
    groupCol: undefined,
    timeRange: "day:2,1",
    attrs: {metricType: "none"},
    columns: [
        {id: "tm", name: "时间", isDim: true, isRate: false},
        {id: "pp", name: "页面浏览量", isDim: false, metricId: {id: "pp", level: "expression"}, isRate: false}
    ],
    granularities: [{id: "tm", interval: "3600000"}]
};

const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={ss} />
);
export default EasyChart;
