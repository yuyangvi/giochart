import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";

/*
* retention 多列
* adjust 为 ["dodge", "stack"]
* chartParams 要添加 { id: "comparison_value", name: "对比值", isDim: true, isRate: false }
* */
const chartParams: DrawParamsProps = {
    // ["dodge", "stack"]  "stack"
    adjust:   "stack",
    chartType: "retention",
    attrs: {selection: []},
    granularities: [{ id: "tm", interval: 86400000 }],
    timeRange: "day:31,1",
    columns: [
        // source
        {id: "turn", name: "留存", isDim: true, isRate: false, values: ["当天", "1天后", "2天后", "3天后", "4天后", "5天后", "6天后", "7天后", "8天后", "9天后", "10天后", "11天后", "12天后", "13天后", "14天后", "15天后", "16天后", "17天后", "18天后", "19天后", "20天后", "21天后", "22天后", "23天后", "24天后", "25天后", "26天后", "27天后", "28天后", "29天后"]},
        {id: "retention_rate", name: "留存率", isDim: false, isRate: true},
        {id: "retention", name: "用户数", isDim: false, isRate: false}
    ]
};

// const a = retentionSourceSelector(retentionData, ["tm"], true);

const source = [
    {retention: 138069, retention_rate: 1, turn: 0},
    {retention: 28953, retention_rate: 0.21849177061873173, turn: 1},
    {retention: 20195, retention_rate: 0.15913353190550486, turn: 2},
    {retention: 17908, retention_rate: 0.148153050672182, turn: 3},
    {retention: 16801, retention_rate: 0.14681697033250315, turn: 4},
    {retention: 17036, retention_rate: 0.15098821235487017, turn: 5},
    {retention: 17946, retention_rate: 0.16180832935108963, turn: 6},
    {retention: 18962, retention_rate: 0.1794505380109211, turn: 7},
    {retention: 14767, retention_rate: 0.1472518048741574, turn: 8},
    {retention: 11404, retention_rate: 0.12061981067216669, turn: 9},
    {retention: 10350, retention_rate: 0.11619813184839231, turn: 10},
    {retention: 9876, retention_rate: 0.11847693082847477, turn: 11},
    {retention: 10390, retention_rate: 0.12698141109467997, turn: 12},
    {retention: 11166, retention_rate: 0.13916446482875516, turn: 13},
    {retention: 11547, retention_rate: 0.15360976972502693, turn: 14},
    {retention: 8754, retention_rate: 0.12578670575049572, turn: 15},
    {retention: 6651, retention_rate: 0.10461988580057571, turn: 16},
    {retention: 5709, retention_rate: 0.09874770816757186, turn: 17},
    {retention: 5491, retention_rate: 0.1058465215798909, turn: 18},
    {retention: 6005, retention_rate: 0.11955959065026082, turn: 19},
    {retention: 6077, retention_rate: 0.12639876866758185, turn: 20},
    {retention: 5867, retention_rate: 0.13813156283844233, turn: 21},
    {retention: 4341, retention_rate: 0.11733383787874692, turn: 22},
    {retention: 3061, retention_rate: 0.09723016326789911, turn: 23},
    {retention: 2309, retention_rate: 0.08870193231147477, turn: 24},
    {retention: 2085, retention_rate: 0.10308513794126371, turn: 25},
    {retention: 2524, retention_rate: 0.13548768049814805, turn: 26},
    {retention: 2235, retention_rate: 0.13335322195704058, turn: 27},
    {retention: 1477, retention_rate: 0.1294818970807399, turn: 28},
    {retention: 720, retention_rate: 0.12954300107952502, turn: 29}
];

const RetentionLongTime = (props: any) => (
    <Chart chartParams={chartParams} source={source} />
);
export default RetentionLongTime;
