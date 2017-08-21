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
    chartType: "retentionColumn",
    attrs: {selection: [1, 2]},
    // granularities: [{ id: "tm", interval: 864e5 }],
    columns: [
        // source
        // {id: "turn", name: "留存", isDim: true, isRate: false, values: ["当天", "1天后", "2天后", "3天后", "4天后", "5天后", "6天后", "7天后", "8天后", "9天后", "10天后", "11天后", "12天后", "13天后"]},
        // {id: "retention_rate", name: "留存率", isDim: false, isRate: true},
        // {id: "retention", name: "用户数", isDim: false, isRate: false}

        // sourceComparison
        {id: "turn", name: "留存", isDim: true, isRate: false, values: ["当天", "1天后", "2天后", "3天后", "4天后", "5天后", "6天后", "7天后", "8天后", "9天后", "10天后", "11天后", "12天后", "13天后"]},
        {id: "city", name: "城市", isDim: true, isRate: false},
        {id: "comparison_value", name: "对比值", isDim: true, isRate: false},
        {id: "retention_rate", name: "留存率", isDim: false, isRate: true},
        {id: "retention", name: "用户数", isDim: false, isRate: false}

    ]
};

// const a = retentionSourceSelector(retentionData, ["tm"], true);

const source = [
    {retention: 10511, retention_rate: 1, comparison_value: "上海", city: "上海", turn: 0},
    {retention: 2421, retention_rate: 0.2536140791954745, comparison_value: "上海", city: "上海", turn: 1},
    {retention: 1464, retention_rate: 0.1715490977267401, comparison_value: "上海", city: "上海", turn: 2},
    {retention: 1359, retention_rate: 0.185149863760218, comparison_value: "上海", city: "上海", turn: 3},
    {retention: 1406, retention_rate: 0.1958217270194986, comparison_value: "上海", city: "上海", turn: 4},
    {retention: 1354, retention_rate: 0.19340094272246822, comparison_value: "上海", city: "上海", turn: 5},
    {retention: 1244, retention_rate: 0.2044707429322814, comparison_value: "上海", city: "上海", turn: 6},
    {retention: 1165, retention_rate: 0.22503380336101989, comparison_value: "上海", city: "上海", turn: 7},
    {retention: 729, retention_rate: 0.17473633748801534, comparison_value: "上海", city: "上海", turn: 8},
    {retention: 344, retention_rate: 0.10653453081449366, comparison_value: "上海", city: "上海", turn: 9},
    {retention: 318, retention_rate: 0.14064573197700134, comparison_value: "上海", city: "上海", turn: 10},
    {retention: 447, retention_rate: 0.21367112810707456, comparison_value: "上海", city: "上海", turn: 11},
    {retention: 389, retention_rate: 0.20292123109024518, comparison_value: "上海", city: "上海", turn: 12},
    {retention: 175, retention_rate: 0.17517517517517517, comparison_value: "上海", city: "上海", turn: 13}
];

const sourceComparison = [
    {retention: 21767, retention_rate: 1, comparison_value: "北京", city: "北京", turn: 0},
    {retention: 4390, retention_rate: 0.22135941912061316, comparison_value: "北京", city: "北京", turn: 1},
    {retention: 2707, retention_rate: 0.15230968322736735, comparison_value: "北京", city: "北京", turn: 2},
    {retention: 2491, retention_rate: 0.15900676624537213, comparison_value: "北京", city: "北京", turn: 3},
    {retention: 2734, retention_rate: 0.18023600764717515, comparison_value: "北京", city: "北京", turn: 4},
    {retention: 2457, retention_rate: 0.16976438886201894, comparison_value: "北京", city: "北京", turn: 5},
    {retention: 2140, retention_rate: 0.17011128775834658, comparison_value: "北京", city: "北京", turn: 6},
    {retention: 2103, retention_rate: 0.19746478873239437, comparison_value: "北京", city: "北京", turn: 7},
    {retention: 1388, retention_rate: 0.1613953488372093, comparison_value: "北京", city: "北京", turn: 8},
    {retention: 718, retention_rate: 0.10703637447823494, comparison_value: "北京", city: "北京", turn: 9},
    {retention: 541, retention_rate: 0.11461864406779661, comparison_value: "北京", city: "北京", turn: 10},
    {retention: 780, retention_rate: 0.1851412295276525, comparison_value: "北京", city: "北京", turn: 11},
    {retention: 701, retention_rate: 0.1880364806866953, comparison_value: "北京", city: "北京", turn: 12},
    {retention: 351, retention_rate: 0.1817711030554117, comparison_value: "北京", city: "北京", turn: 13},
    {retention: 10511, retention_rate: 1, comparison_value: "上海", city: "上海", turn: 0},
    {retention: 2421, retention_rate: 0.2536140791954745, comparison_value: "上海", city: "上海", turn: 1},
    {retention: 1464, retention_rate: 0.1715490977267401, comparison_value: "上海", city: "上海", turn: 2},
    {retention: 1359, retention_rate: 0.185149863760218, comparison_value: "上海", city: "上海", turn: 3},
    {retention: 1406, retention_rate: 0.1958217270194986, comparison_value: "上海", city: "上海", turn: 4},
    {retention: 1354, retention_rate: 0.19340094272246822, comparison_value: "上海", city: "上海", turn: 5},
    {retention: 1244, retention_rate: 0.2044707429322814, comparison_value: "上海", city: "上海", turn: 6},
    {retention: 1165, retention_rate: 0.22503380336101989, comparison_value: "上海", city: "上海", turn: 7},
    {retention: 729, retention_rate: 0.17473633748801534, comparison_value: "上海", city: "上海", turn: 8},
    {retention: 344, retention_rate: 0.10653453081449366, comparison_value: "上海", city: "上海", turn: 9},
    {retention: 318, retention_rate: 0.14064573197700134, comparison_value: "上海", city: "上海", turn: 10},
    {retention: 447, retention_rate: 0.21367112810707456, comparison_value: "上海", city: "上海", turn: 11},
    {retention: 389, retention_rate: 0.20292123109024518, comparison_value: "上海", city: "上海", turn: 12},
    {retention: 175, retention_rate: 0.17517517517517517, comparison_value: "上海", city: "上海", turn: 13}
];

const RetentionColumn = (props: any) => (
    <Chart chartParams={chartParams} source={sourceComparison} />
);
export default RetentionColumn;
