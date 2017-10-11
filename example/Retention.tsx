import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";

const c = JSON.parse('{"adjust":"stack","timeRange":"day:91,1","granularities":[{"id":"tm","interval":"604800000"}],"attrs":{"selection":[]},"chartType":"retention","columns":[{"id":"tm","name":"起始时间","isDim":true,"isRate":false},{"id":"turn","name":"留存周期","isDim":true,"isRate":false,"values":["次周留存率","2周后留存率","3周后留存率","4周后留存率"]},{"id":"retention_rate","name":"留存率","isDim":false,"isRate":true},{"id":"retention","name":"留存人数","isDim":false,"isRate":false}]}');
const s = JSON.parse('[{"tm":1499616000000,"turn":"1","retention":3514,"retention_rate":0.21839651957737724},{"tm":1500220800000,"turn":"1","retention":4306,"retention_rate":0.1857876342926177},{"tm":1500825600000,"turn":"1","retention":4284,"retention_rate":0.18445640473627556},{"tm":1501430400000,"turn":"1","retention":4274,"retention_rate":0.1862958765582774},{"tm":1502035200000,"turn":"1","retention":4244,"retention_rate":0.18648387380261885},{"tm":1502640000000,"turn":"1","retention":4246,"retention_rate":0.18008312833997794},{"tm":1503244800000,"turn":"1","retention":4340,"retention_rate":0.17346123101518784},{"tm":1503849600000,"turn":"1","retention":4187,"retention_rate":0.16352913607248867},{"tm":1504454400000,"turn":"1","retention":4288,"retention_rate":0.16967394745172523},{"tm":1505059200000,"turn":"1","retention":4294,"retention_rate":0.17499388703235796},{"tm":1505664000000,"turn":"1","retention":4470,"retention_rate":0.17355853232382062},{"tm":1506268800000,"turn":"1","retention":776,"retention_rate":0.03129789465193192},{"tm":1506873600000,"turn":"1","retention":383,"retention_rate":0.046850152905198776},{"tm":1499616000000,"turn":"2","retention":2815,"retention_rate":0.17495338719701678},{"tm":1500220800000,"turn":"2","retention":3459,"retention_rate":0.1492427837942788},{"tm":1500825600000,"turn":"2","retention":3380,"retention_rate":0.14553283100107642},{"tm":1501430400000,"turn":"2","retention":3476,"retention_rate":0.15151250980734024},{"tm":1502035200000,"turn":"2","retention":3282,"retention_rate":0.1442130239915634},{"tm":1502640000000,"turn":"2","retention":3365,"retention_rate":0.14271778776825855},{"tm":1503244800000,"turn":"2","retention":3434,"retention_rate":0.1372501998401279},{"tm":1503849600000,"turn":"2","retention":3393,"retention_rate":0.1325183565067958},{"tm":1504454400000,"turn":"2","retention":3441,"retention_rate":0.13615859449192783},{"tm":1505059200000,"turn":"2","retention":3404,"retention_rate":0.13872361235634526},{"tm":1505664000000,"turn":"2","retention":608,"retention_rate":0.023607066589011842},{"tm":1506268800000,"turn":"2","retention":1841,"retention_rate":0.07425183512140034},{"tm":1499616000000,"turn":"3","retention":2440,"retention_rate":0.15164698570540708},{"tm":1500220800000,"turn":"3","retention":2922,"retention_rate":0.12607326228588686},{"tm":1500825600000,"turn":"3","retention":3013,"retention_rate":0.1297308934337998},{"tm":1501430400000,"turn":"3","retention":3045,"retention_rate":0.13272600470752333},{"tm":1502035200000,"turn":"3","retention":2918,"retention_rate":0.12821864838738026},{"tm":1502640000000,"turn":"3","retention":2916,"retention_rate":0.12367461192637204},{"tm":1503244800000,"turn":"3","retention":3043,"retention_rate":0.12162270183852918},{"tm":1503849600000,"turn":"3","retention":3103,"retention_rate":0.12119200124980471},{"tm":1504454400000,"turn":"3","retention":3022,"retention_rate":0.1195789806900918},{"tm":1505059200000,"turn":"3","retention":510,"retention_rate":0.02078408998288369},{"tm":1505664000000,"turn":"3","retention":1484,"retention_rate":0.057619879635022325},{"tm":1499616000000,"turn":"4","retention":2197,"retention_rate":0.13654443753884402},{"tm":1500220800000,"turn":"4","retention":2713,"retention_rate":0.11705570177330975},{"tm":1500825600000,"turn":"4","retention":2717,"retention_rate":0.11698600645855758},{"tm":1501430400000,"turn":"4","retention":2705,"retention_rate":0.11790602388632203},{"tm":1502035200000,"turn":"4","retention":2587,"retention_rate":0.1136743123297302},{"tm":1502640000000,"turn":"4","retention":2657,"retention_rate":0.11268979557214352},{"tm":1503244800000,"turn":"4","retention":2777,"retention_rate":0.1109912070343725},{"tm":1503849600000,"turn":"4","retention":2712,"retention_rate":0.10592094985158569},{"tm":1504454400000,"turn":"4","retention":457,"retention_rate":0.018083254194365305},{"tm":1505059200000,"turn":"4","retention":1321,"retention_rate":0.05383486836743011}]');

const c1 = JSON.parse('{"adjust":"stack","timeRange":"day:15,1","granularities":[{"id":"tm","interval":"86400000"}],"attrs":{"selection":[]},"chartType":"retention","columns":[{"id":"turn","name":"留存","isDim":true,"isRate":false,"values":["当天","次日","2天后","3天后","4天后","5天后","6天后","7天后","8天后","9天后","10天后","11天后","12天后","13天后"]},{"id":"retention_rate","name":"留存率","isDim":false,"isRate":true},{"id":"retention","name":"留存人数","isDim":false,"isRate":false}]}');
const s1 = JSON.parse('[{"retention":42475,"retention_rate":1,"turn":0},{"retention":6518,"retention_rate":0.17561632763033813,"turn":1},{"retention":4191,"retention_rate":0.11857741059302852,"turn":2},{"retention":2702,"retention_rate":0.07968855988438965,"turn":3},{"retention":1577,"retention_rate":0.04833864639529181,"turn":4},{"retention":757,"retention_rate":0.02400050727624362,"turn":5},{"retention":694,"retention_rate":0.022756336688854642,"turn":6},{"retention":617,"retention_rate":0.021011408138940917,"turn":7},{"retention":595,"retention_rate":0.021132263105554765,"turn":8},{"retention":1268,"retention_rate":0.04716560035708972,"turn":9},{"retention":1325,"retention_rate":0.058075827306596536,"turn":10},{"retention":1205,"retention_rate":0.06953260242354299,"turn":11},{"retention":1113,"retention_rate":0.09710347234339557,"turn":12},{"retention":915,"retention_rate":0.1621477937267411,"turn":13}]');

const c2 = JSON.parse('{"adjust":"stack","timeRange":"day:31,1","granularities":[{"id":"tm","interval":"604800000"},{"id":"bw","values":["_all_","Firefox"]}],"attrs":{"selection":[0,1]},"chartType":"retention","columns":[{"id":"tm","name":"起始时间","isDim":true,"isRate":false},{"id":"bw","name":"浏览器","isDim":true,"isRate":false},{"id":"comparison_value","name":"对比值","isDim":true,"isRate":false},{"id":"retention_rate","name":"2周后留存率","isDim":false,"isRate":true},{"id":"retention","name":"留存人数","isDim":false,"isRate":false}]}');
const s2 = JSON.parse('[{"comparison_value":"_all_","bw":"全部","tm":1504454400000,"turn":"2","retention":301,"retention_rate":0.17779090372120496},{"comparison_value":"_all_","bw":"全部","tm":1505059200000,"turn":"2","retention":3404,"retention_rate":0.13872361235634526},{"comparison_value":"_all_","bw":"全部","tm":1505664000000,"turn":"2","retention":608,"retention_rate":0.023607066589011842},{"comparison_value":"_all_","bw":"全部","tm":1506268800000,"turn":"2","retention":1841,"retention_rate":0.07425183512140034},{"comparison_value":"Firefox","bw":"Firefox","tm":1504454400000,"turn":"2","retention":12,"retention_rate":0.05240174672489083},{"comparison_value":"Firefox","bw":"Firefox","tm":1505059200000,"turn":"2","retention":140,"retention_rate":0.08064516129032258},{"comparison_value":"Firefox","bw":"Firefox","tm":1505664000000,"turn":"2","retention":26,"retention_rate":0.01859799713876967},{"comparison_value":"Firefox","bw":"Firefox","tm":1506268800000,"turn":"2","retention":91,"retention_rate":0.05844572896596018}]');

const Retention = (props: any) => (
  <Chart chartParams={c2} source={s2} gridPanel={true} />
);
export default Retention;
