import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";
const cdata: Source = [
  { tm: 1498147200000, JoOL0rE9: 7.11, tm_: 1496937600000, JoOL0rE9_: 8.19 },
  { tm: 1498233600000, JoOL0rE9: 5.45, tm_: 1497024000000, JoOL0rE9_: 7.65 },
  { tm: 1498320000000, JoOL0rE9: 5.71, tm_: 1497110400000, JoOL0rE9_: 11.57 },
  { tm: 1498406400000, JoOL0rE9: 7.65, tm_: 1497196800000, JoOL0rE9_: 6.79 },
  { tm: 1498492800000, JoOL0rE9: 8.34, tm_: 1497283200000, JoOL0rE9_: 7.16 },
  { tm: 1498579200000, JoOL0rE9: 8.38, tm_: 1497369600000, JoOL0rE9_: 7.82 },
  { tm: 1498665600000, JoOL0rE9: 5.46, tm_: 1497456000000, JoOL0rE9_: 7.40 },
  { tm: 1498752000000, JoOL0rE9: 4.86, tm_: 1497542400000, JoOL0rE9_: 8.93 },
  { tm: 1498838400000, JoOL0rE9: 4.93, tm_: 1497628800000, JoOL0rE9_: 7.52 },
  { tm: 1498924800000, JoOL0rE9: 4.12, tm_: 1497715200000, JoOL0rE9_: 5.71 },
  { tm: 1499011200000, JoOL0rE9: 5.92, tm_: 1497801600000, JoOL0rE9_: 10.04 },
  { tm: 1499097600000, JoOL0rE9: 5.07, tm_: 1497888000000, JoOL0rE9_: 8.23 },
  { tm: 1499184000000, JoOL0rE9: 5.41, tm_: 1497974400000, JoOL0rE9_: 5.35 },
  { tm: 1499270400000, JoOL0rE9: 5.49, tm_: 1498060800000, JoOL0rE9_: 6.56 }
];

const ss = JSON.parse('[{"tm":1503417600000,"pv":379,"tm_":1502812800000,"pv_":518},{"tm":1503421200000,"pv":169,"tm_":1502816400000,"pv_":273},{"tm":1503424800000,"pv":78,"tm_":1502820000000,"pv_":146},{"tm":1503428400000,"pv":32,"tm_":1502823600000,"pv_":46},{"tm":1503432000000,"pv":26,"tm_":1502827200000,"pv_":46},{"tm":1503435600000,"pv":83,"tm_":1502830800000,"pv_":107},{"tm":1503439200000,"pv":101,"tm_":1502834400000,"pv_":56},{"tm":1503442800000,"pv":213,"tm_":1502838000000,"pv_":147},{"tm":1503446400000,"pv":887,"tm_":1502841600000,"pv_":862},{"tm":1503450000000,"pv":4824,"tm_":1502845200000,"pv_":5423},{"tm":1503453600000,"pv":7601,"tm_":1502848800000,"pv_":8314},{"tm":1503457200000,"pv":6779,"tm_":1502852400000,"pv_":8833},{"tm":1503460800000,"pv":1818,"tm_":1502856000000,"pv_":4505},{"tm":1503464400000,"pv":3932,"tm_":1502859600000,"pv_":3773},{"tm":1503468000000,"pv":6873,"tm_":1502863200000,"pv_":7166},{"tm":1503471600000,"pv":6564,"tm_":1502866800000,"pv_":7083},{"tm":1503475200000,"pv":6745,"tm_":1502870400000,"pv_":6215},{"tm":1503478800000,"pv":6589,"tm_":1502874000000,"pv_":6407},{"tm":1503482400000,"pv":4478,"tm_":1502877600000,"pv_":3996},{"tm":1503486000000,"pv":2222,"tm_":1502881200000,"pv_":2377},{"tm":1503489600000,"pv":1717,"tm_":1502884800000,"pv_":2245},{"tm":1503493200000,"pv":1265,"tm_":1502888400000,"pv_":1331},{"tm":1503496800000,"pv":1008,"tm_":1502892000000,"pv_":950},{"tm":1503500400000,"pv":860,"tm_":1502895600000,"pv_":716}]');

const chartParams: DrawParamsProps = {
    adjust: "dodge",
    aggregator: { values: [2992, 2677] },
    chartType: "comparison",
    colorTheme: "252, 95, 58",
    attrs: {metricType: "none"},
    columns: [
      { id: "tm", name: "时间", isDim: true, isRate: false },
      { id: "9yGbpp8x", name: "当前周期", isDim: false, isRate: false, metricId: {id: "9yGbpp8x", level: "complex"} },
      { id: "tm_", isDim: true, isRate: false, name: undefined},
      { id: "JoOL0rE9_  ", name: "上一周期", isDim: false, isRate: false, metricId: {id: "9yGbpp8x", level: "complex"} }
    ],
    granularities: [{ id: "tm", interval: "3600000", period: "auto" }],
    timeRange: "day:1,0"
  };

const sss = JSON.parse('[{"tm":1504713600000,"9yGbpp8x":110,"tm_":1504108800000,"9yGbpp8x_":95},{"tm":1504717200000,"9yGbpp8x":67,"tm_":1504112400000,"9yGbpp8x_":77},{"tm":1504720800000,"9yGbpp8x":36,"tm_":1504116000000,"9yGbpp8x_":37},{"tm":1504724400000,"9yGbpp8x":32,"tm_":1504119600000,"9yGbpp8x_":28},{"tm":1504728000000,"9yGbpp8x":36,"tm_":1504123200000,"9yGbpp8x_":13},{"tm":1504731600000,"9yGbpp8x":28,"tm_":1504126800000,"9yGbpp8x_":31},{"tm":1504735200000,"9yGbpp8x":28,"tm_":1504130400000,"9yGbpp8x_":17},{"tm":1504738800000,"9yGbpp8x":51,"tm_":1504134000000,"9yGbpp8x_":35},{"tm":1504742400000,"9yGbpp8x":185,"tm_":1504137600000,"9yGbpp8x_":163},{"tm":1504746000000,"9yGbpp8x":829,"tm_":1504141200000,"9yGbpp8x_":794},{"tm":1504749600000,"9yGbpp8x":1180,"tm_":1504144800000,"9yGbpp8x_":992},{"tm":1504753200000,"9yGbpp8x":1002,"tm_":1504148400000,"9yGbpp8x_":936},{"tm":1504756800000,"9yGbpp8x":346,"tm_":1504152000000,"9yGbpp8x_":332},{"tm":1504760400000,"9yGbpp8x":null,"tm_":1504155600000,"9yGbpp8x_":637},{"tm":1504764000000,"9yGbpp8x":null,"tm_":1504159200000,"9yGbpp8x_":1042},{"tm":1504767600000,"9yGbpp8x":null,"tm_":1504162800000,"9yGbpp8x_":1032},{"tm":1504771200000,"9yGbpp8x":null,"tm_":1504166400000,"9yGbpp8x_":956},{"tm":1504774800000,"9yGbpp8x":null,"tm_":1504170000000,"9yGbpp8x_":956},{"tm":1504778400000,"9yGbpp8x":null,"tm_":1504173600000,"9yGbpp8x_":550},{"tm":1504782000000,"9yGbpp8x":null,"tm_":1504177200000,"9yGbpp8x_":393},{"tm":1504785600000,"9yGbpp8x":null,"tm_":1504180800000,"9yGbpp8x_":282},{"tm":1504789200000,"9yGbpp8x":null,"tm_":1504184400000,"9yGbpp8x_":219},{"tm":1504792800000,"9yGbpp8x":null,"tm_":1504188000000,"9yGbpp8x_":188},{"tm":1504796400000,"9yGbpp8x":null,"tm_":1504191600000,"9yGbpp8x_":138}]');
const cp = JSON.parse('{"adjust":"dodge","aggregator":{"values":[65243,71535]},"chartType":"comparison","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"pv","name":"当前周期","isDim":false,"metricId":{"id":"pv","level":"expression"},"isRate":false},{"id":"tm_","isDim":true,"isRate":false},{"id":"pv_","name":"上一周期","isDim":false,"metricId":{"id":"pv","level":"expression"},"isRate":false}],"granularities":[{"id":"tm","interval":3600000,"period":"auto"}],"timeRange":"day:2,1","attrs":{"comment":"一段时间内网站网页被浏览的总的次数"}}');

const cp1 = JSON.parse('{"adjust":"dodge","aggregator":{"values":[2992,2677]},"chartType":"comparison","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"9yGbpp8x","name":"当前周期","isDim":false,"metricId":{"id":"9yGbpp8x","level":"complex"},"isRate":false},{"id":"tm_","isDim":true,"isRate":false},{"id":"9yGbpp8x_","name":"上一周期","isDim":false,"metricId":{"id":"9yGbpp8x","level":"complex"},"isRate":false}],"granularities":[{"id":"tm","interval":3600000,"period":"auto"}],"timeRange":"day:1,0","attrs":{"metricType":"none"}}');

const ComparisonChart = (props: any) => (
  <Chart chartParams={cp1} source={sss} />
);
export default ComparisonChart;
