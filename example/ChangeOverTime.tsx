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
    granularities: [{ id: "tm", interval: "2592000000" }],  // 2592000000  604800000
    timeRange: "day:181,1", //   181 31
    columns: [
        // source
        {id: "tm", name: "起始时间", isDim: true, isRate: false},
        // "1月后留存率", "2月后留存率", "3月后留存率" | "1周后留存率", "2周后留存率", "3周后留存率", "4周后留存率"
        {id: "turn", name: "留存周期", isDim: true, isRate: false, values: ["1月后留存率", "2月后留存率", "3月后留存率"]},
        {id: "retention_rate", name: "留存率", isDim: false, isRate: true},
        {id: "retention", name: "用户数", isDim: false, isRate: false}

        // comparison
        // {id: "tm", name: "起始时间", isDim: true, isRate: false},
        // {id: "city", name: "城市", isDim: true, isRate: false},
        // {id: "comparison_value", name: "对比值", isDim: true, isRate: false},
        // {id: "retention_rate", name: "留存率", isDim: false, isRate: true},
        // {id: "retention", name: "用户数", isDim: false, isRate: false}
    ]
};

const source = [
    {tm: 1502035200000, turn: "1", retention: 1453, retention_rate: 0.2542877143857193},
    {tm: 1502121600000, turn: "1", retention: 1431, retention_rate: 0.2614653754796273},
    {tm: 1502208000000, turn: "1", retention: 1485, retention_rate: 0.25875588081547307},
    {tm: 1502294400000, turn: "1", retention: 1410, retention_rate: 0.26193572357421513},
    {tm: 1502380800000, turn: "1", retention: 414, retention_rate: 0.07897748950782144},
    {tm: 1502467200000, turn: "1", retention: 178, retention_rate: 0.092660072878709},
    {tm: 1502553600000, turn: "1", retention: 273, retention_rate: 0.17009345794392525},
    {tm: 1502640000000, turn: "1", retention: 1638, retention_rate: 0.2543478260869565},
    {tm: 1502726400000, turn: "1", retention: 1577, retention_rate: 0.2614823412369425},
    {tm: 1502812800000, turn: "1", retention: 1545, retention_rate: 0.27554842161583737},
    {tm: 1502899200000, turn: "1", retention: 1455, retention_rate: 0.26187904967602593},
    {tm: 1502985600000, turn: "1", retention: 338, retention_rate: 0.06366547372386513},
    {tm: 1503072000000, turn: "1", retention: 188, retention_rate: 0.11032863849765258},
    {tm: 1502035200000, turn: "7", retention: 1204, retention_rate: 0.21071053552677635},
    {tm: 1502121600000, turn: "7", retention: 1070, retention_rate: 0.19550520738169194},
    {tm: 1502208000000, turn: "7", retention: 1054, retention_rate: 0.18365568914445024},
    {tm: 1502294400000, turn: "7", retention: 1021, retention_rate: 0.18967118707040684},
    {tm: 1502380800000, turn: "7", retention: 1001, retention_rate: 0.19095764975200305},
    {tm: 1502467200000, turn: "7", retention: 150, retention_rate: 0.07808433107756377},
    {tm: 1502553600000, turn: "7", retention: 127, retention_rate: 0.07912772585669782}
];

const source31 = JSON.parse('[{"tm":1500220800000,"turn":"1","retention":4306,"retention_rate":0.1857876342926177},{"tm":1500825600000,"turn":"1","retention":4284,"retention_rate":0.18445640473627556},{"tm":1501430400000,"turn":"1","retention":4274,"retention_rate":0.1862958765582774},{"tm":1502035200000,"turn":"1","retention":4244,"retention_rate":0.18648387380261885},{"tm":1500220800000,"turn":"2","retention":3459,"retention_rate":0.1492427837942788},{"tm":1500825600000,"turn":"2","retention":3380,"retention_rate":0.14553283100107642},{"tm":1501430400000,"turn":"2","retention":3476,"retention_rate":0.15151250980734024},{"tm":1500220800000,"turn":"3","retention":2922,"retention_rate":0.12607326228588686},{"tm":1500825600000,"turn":"3","retention":3013,"retention_rate":0.1297308934337998},{"tm":1500220800000,"turn":"4","retention":2713,"retention_rate":0.11705570177330975}]');

const source181 = JSON.parse('[{"tm":1485878400000,"turn":"1","retention":8355,"retention_rate":0.18630008696233863},{"tm":1488297600000,"turn":"1","retention":9767,"retention_rate":0.1467001111478266},{"tm":1490976000000,"turn":"1","retention":10060,"retention_rate":0.13908090471713763},{"tm":1493568000000,"turn":"1","retention":10573,"retention_rate":0.12020099816964336},{"tm":1496246400000,"turn":"1","retention":10691,"retention_rate":0.12411335167577985},{"tm":1485878400000,"turn":"2","retention":4936,"retention_rate":0.11006310344058688},{"tm":1488297600000,"turn":"2","retention":6783,"retention_rate":0.10188050106641834},{"tm":1490976000000,"turn":"2","retention":6657,"retention_rate":0.09203395454294089},{"tm":1493568000000,"turn":"2","retention":6543,"retention_rate":0.07438523891269995},{"tm":1485878400000,"turn":"3","retention":4062,"retention_rate":0.09057462037594488},{"tm":1488297600000,"turn":"3","retention":5222,"retention_rate":0.07843431764246447},{"tm":1490976000000,"turn":"3","retention":4791,"retention_rate":0.06623624398606426}]');

// const soureComparison = JSON.parse('[{"comparison_value":"_all_","city":"全部","tm":1502035200000,"turn":"1","retention":1453,"retention_rate":0.2542877143857193},{"comparison_value":"_all_","city":"全部","tm":1502121600000,"turn":"1","retention":1431,"retention_rate":0.2614653754796273},{"comparison_value":"_all_","city":"全部","tm":1502208000000,"turn":"1","retention":1485,"retention_rate":0.25875588081547307},{"comparison_value":"_all_","city":"全部","tm":1502294400000,"turn":"1","retention":1410,"retention_rate":0.26193572357421513},{"comparison_value":"_all_","city":"全部","tm":1502380800000,"turn":"1","retention":414,"retention_rate":0.07897748950782144},{"comparison_value":"_all_","city":"全部","tm":1502467200000,"turn":"1","retention":178,"retention_rate":0.092660072878709},{"comparison_value":"_all_","city":"全部","tm":1502553600000,"turn":"1","retention":273,"retention_rate":0.17009345794392525},{"comparison_value":"_all_","city":"全部","tm":1502640000000,"turn":"1","retention":1638,"retention_rate":0.2543478260869565},{"comparison_value":"_all_","city":"全部","tm":1502726400000,"turn":"1","retention":1577,"retention_rate":0.2614823412369425},{"comparison_value":"_all_","city":"全部","tm":1502812800000,"turn":"1","retention":1545,"retention_rate":0.27554842161583737},{"comparison_value":"_all_","city":"全部","tm":1502899200000,"turn":"1","retention":1455,"retention_rate":0.26187904967602593},{"comparison_value":"_all_","city":"全部","tm":1502985600000,"turn":"1","retention":338,"retention_rate":0.06366547372386513},{"comparison_value":"_all_","city":"全部","tm":1503072000000,"turn":"1","retention":188,"retention_rate":0.11032863849765258},{"comparison_value":"北京","city":"北京","tm":1502035200000,"turn":"1","retention":548,"retention_rate":0.27565392354124746},{"comparison_value":"北京","city":"北京","tm":1502121600000,"turn":"1","retention":539,"retention_rate":0.28488372093023256},{"comparison_value":"北京","city":"北京","tm":1502208000000,"turn":"1","retention":528,"retention_rate":0.2575609756097561},{"comparison_value":"北京","city":"北京","tm":1502294400000,"turn":"1","retention":513,"retention_rate":0.26580310880829017},{"comparison_value":"北京","city":"北京","tm":1502380800000,"turn":"1","retention":181,"retention_rate":0.09561542525092445},{"comparison_value":"北京","city":"北京","tm":1502467200000,"turn":"1","retention":61,"retention_rate":0.08764367816091954},{"comparison_value":"北京","city":"北京","tm":1502553600000,"turn":"1","retention":83,"retention_rate":0.16700201207243462},{"comparison_value":"北京","city":"北京","tm":1502640000000,"turn":"1","retention":585,"retention_rate":0.2776459420977693},{"comparison_value":"北京","city":"北京","tm":1502726400000,"turn":"1","retention":575,"retention_rate":0.2792617775619233},{"comparison_value":"北京","city":"北京","tm":1502812800000,"turn":"1","retention":575,"retention_rate":0.2971576227390181},{"comparison_value":"北京","city":"北京","tm":1502899200000,"turn":"1","retention":515,"retention_rate":0.25520317145688803},{"comparison_value":"北京","city":"北京","tm":1502985600000,"turn":"1","retention":122,"retention_rate":0.06424433912585571},{"comparison_value":"北京","city":"北京","tm":1503072000000,"turn":"1","retention":56,"retention_rate":0.10586011342155009},{"comparison_value":"上海","city":"上海","tm":1502035200000,"turn":"1","retention":285,"retention_rate":0.2944214876033058},{"comparison_value":"上海","city":"上海","tm":1502121600000,"turn":"1","retention":297,"retention_rate":0.3149522799575822},{"comparison_value":"上海","city":"上海","tm":1502208000000,"turn":"1","retention":311,"retention_rate":0.309452736318408},{"comparison_value":"上海","city":"上海","tm":1502294400000,"turn":"1","retention":301,"retention_rate":0.3318632855567806},{"comparison_value":"上海","city":"上海","tm":1502380800000,"turn":"1","retention":58,"retention_rate":0.06324972737186478},{"comparison_value":"上海","city":"上海","tm":1502467200000,"turn":"1","retention":31,"retention_rate":0.17318435754189945},{"comparison_value":"上海","city":"上海","tm":1502553600000,"turn":"1","retention":49,"retention_rate":0.30625},{"comparison_value":"上海","city":"上海","tm":1502640000000,"turn":"1","retention":323,"retention_rate":0.2705192629815745},{"comparison_value":"上海","city":"上海","tm":1502726400000,"turn":"1","retention":308,"retention_rate":0.30434782608695654},{"comparison_value":"上海","city":"上海","tm":1502812800000,"turn":"1","retention":314,"retention_rate":0.32538860103626943},{"comparison_value":"上海","city":"上海","tm":1502899200000,"turn":"1","retention":305,"retention_rate":0.3446327683615819},{"comparison_value":"上海","city":"上海","tm":1502985600000,"turn":"1","retention":62,"retention_rate":0.07209302325581396},{"comparison_value":"上海","city":"上海","tm":1503072000000,"turn":"1","retention":33,"retention_rate":0.1793478260869565}]');
const ChangeOverTime = (props: any) => (
    <Chart chartParams={chartParams} source={source181} />
);
export default ChangeOverTime;
