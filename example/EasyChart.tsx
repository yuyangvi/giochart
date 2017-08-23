// import * as React from "react";
// import { DrawParamsProps, Source} from "../src/ChartProps";
// import Chart from "../src/Chart";
//
// const retentionData: Source = [
//     {tm: 1502812800000, ogWZ55d4: 71535, PDjgVV6l: 2014},
// {tm: 1502899200000, ogWZ55d4: 70307, PDjgVV6l: 1951},
// {tm: 1502985600000, ogWZ55d4: 66128, PDjgVV6l: 1870},
// {tm: 1503072000000, ogWZ55d4: 14077, PDjgVV6l: 470},
// {tm: 1503158400000, ogWZ55d4: 10687, PDjgVV6l: 429},
// {tm: 1503244800000, ogWZ55d4: 78700, PDjgVV6l: 2079},
// {tm: 1503331200000, ogWZ55d4: 74361, PDjgVV6l: 1996}
// ];
//
// const chartParams: DrawParamsProps = {
//     adjust: "dodge",
//     aggregator: null,
//     chartType: "line",
//     colorTheme: undefined,
//     groupCol: undefined,
//     timeRange: "day:8,1",
//     attrs: {metricType: "none", comment: "", period: 7, timeRange: "day:8,1", metrics: {
//         ogWZ55d4: {metricName: "登录用户量"},
//         PDjgVV6l: {metricName: "页面浏览量"}}
// },
//     columns: [
//         {id: "tm", name: "时间", isDim: true, isRate: false},
//         // {id: "ogWZ55d4", name: "页面浏览量", isDim: false, metricId: {id: "ogWZ55d4", level: "complex"}, isRate: false},
//         // {id: "PDjgVV6l", name: "登录用户量", isDim: false, metricId: {id: "PDjgVV6l", level: "complex"}, isRate: false}
//    ],
//     granularities: [{id: "tm", interval: 86400000, period: undefined}]
// };
// const EasyChart = (props: any) => (
//   <Chart chartParams={chartParams} source={retentionData} />
// );
// export default EasyChart;
