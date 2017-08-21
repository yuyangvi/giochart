import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const retentionData: Source = [
  {"cs18":"GrowingIO","woVjjJDo":2206},
  {"cs18":"友道","woVjjJDo":1582},
  {"cs18":"北京魅动力教育咨询有限公司","woVjjJDo":1032},
  {"cs18":"杭州群核信息技术有限公司","woVjjJDo":980},
  {"cs18":"九言科技","woVjjJDo":933},
  {"cs18":"58到家","woVjjJDo":929},
  {"cs18":"北森","woVjjJDo":916},
  {"cs18":"链家自如","woVjjJDo":844},
  {"cs18":"玩途自由行","woVjjJDo":705},
  {"cs18":"中原集团","woVjjJDo":681},
  {"cs18":"点融网","woVjjJDo":547},
  {"cs18":"销售易","woVjjJDo":492},
  {"cs18":"hbh","woVjjJDo":458},
  {"cs18":"myzj","woVjjJDo":433},
  {"cs18":"上海嘉龙日日煮信息科技有限公司","woVjjJDo":431}, {"cs18":"上海易所试网络技术有限公司","woVjjJDo":407},{"cs18":"DI","woVjjJDo":402},{"cs18":"北京易通贷金融信息服务有限公司","woVjjJDo":396},{"cs18":"上海永利宝金融信息服务有限公司","woVjjJDo":353},{"cs18":"年糕妈妈","woVjjJDo":321},{"cs18":"辰酉信息技术有限公司","woVjjJDo":321},{"cs18":"北京创仕科锐信息技术有限公司","woVjjJDo":304},{"cs18":"玖富","woVjjJDo":300},{"cs18":"haier","woVjjJDo":296},{"cs18":"北京优络时代科技有限公司","woVjjJDo":294},{"cs18":"北京艺旗网络科技有限公司","woVjjJDo":294},{"cs18":"31会议","woVjjJDo":280},{"cs18":"ETCP","woVjjJDo":274},{"cs18":"重庆纵情向前","woVjjJDo":272},{"cs18":"多啦衣梦","woVjjJDo":267},{"cs18":"上海链家","woVjjJDo":262},{"cs18":"深圳点猫科技","woVjjJDo":259},{"cs18":"上海中原物业顾问有限公司","woVjjJDo":249},{"cs18":"蘑菇租房","woVjjJDo":247},{"cs18":"和创（北京）科技股份有限公司","woVjjJDo":240},{"cs18":"品果科技","woVjjJDo":238},{"cs18":"北京沐屿科技发展有限公司","woVjjJDo":233},{"cs18":"Fireball","woVjjJDo":228},{"cs18":"YX","woVjjJDo":218},{"cs18":"皇家加勒比游轮","woVjjJDo":206},{"cs18":"PKFARE","woVjjJDo":204},{"cs18":"新东方","woVjjJDo":203},{"cs18":"钱包管家","woVjjJDo":201},{"cs18":"Suiyinet","woVjjJDo":196},{"cs18":"杭州煎饼网络","woVjjJDo":194},{"cs18":"上海万企明道软件有限公司","woVjjJDo":192},{"cs18":"诚之优品","woVjjJDo":191},{"cs18":"摩尔精英","woVjjJDo":191},{"cs18":"成都萌想科技有限责任公司","woVjjJDo":191},{"cs18":"深圳市欧瑞博电子有限公司","woVjjJDo":189},{"cs18":"途家","woVjjJDo":178},{"cs18":"上海初生网络科技有限公司","woVjjJDo":178},{"cs18":"孩宝小镇","woVjjJDo":172},{"cs18":"杭州起码科技","woVjjJDo":169},{"cs18":"上海亲邻信息科技有限公司","woVjjJDo":161},{"cs18":"otms","woVjjJDo":157},{"cs18":"拍拍贷","woVjjJDo":154},{"cs18":"独立日","woVjjJDo":152},{"cs18":"eqxiu","woVjjJDo":149},{"cs18":"ShunShun","woVjjJDo":146},{"cs18":"合码云","woVjjJDo":142},{"cs18":"深圳米筐科技有限公司","woVjjJDo":139},{"cs18":"咪咕音乐有限公司","woVjjJDo":139},{"cs18":"上海xx公司","woVjjJDo":138},{"cs18":"无","woVjjJDo":135},{"cs18":"金蝶蝶金云计算有限公司","woVjjJDo":133},{"cs18":"珍爱网","woVjjJDo":125},{"cs18":"传神","woVjjJDo":117},{"cs18":"深圳市时代华盛网络科技有限公司","woVjjJDo":107},{"cs18":"上海云才网络科技有限公司","woVjjJDo":103},{"cs18":"美食杰","woVjjJDo":101},{"cs18":"华住","woVjjJDo":100},{"cs18":"杭州乐刻网络技术有限公司","woVjjJDo":98},{"cs18":"狗民网","woVjjJDo":98},{"cs18":"网贷之家","woVjjJDo":95},{"cs18":"上海秦苍信息科技有限公司","woVjjJDo":87},{"cs18":"厦门海豹信息技术股份有限公司","woVjjJDo":82},{"cs18":"北京易客信息技术有限公司","woVjjJDo":79},{"cs18":"zcool","woVjjJDo":76},{"cs18":"嗨学网","woVjjJDo":76},{"cs18":"浙江大道众包电子商务股份有限公司","woVjjJDo":72},{"cs18":"北京木屋时代科技有限公司","woVjjJDo":70},{"cs18":"春秋航空","woVjjJDo":69},{"cs18":"杭州求是同创网络科技有限公司","woVjjJDo":67},{"cs18":"广州悦跑信息科技有限公司","woVjjJDo":64},{"cs18":"权威科技","woVjjJDo":63},{"cs18":"信诚人寿保险有限公司","woVjjJDo":52},{"cs18":"北京优亿致远无线技术有限公司","woVjjJDo":50},{"cs18":"深圳","woVjjJDo":41},{"cs18":"北京优品惠文化发展有限公司","woVjjJDo":41},{"cs18":"chanjet","woVjjJDo":32},{"cs18":"很赞","woVjjJDo":29},
  {"cs18":"回家吃饭","woVjjJDo":28},{"cs18":"中和应泰上海分公司","woVjjJDo":26},{"cs18":"掌合","woVjjJDo":23},{"cs18":"天地同舟","woVjjJDo":21},{"cs18":"中医在线","woVjjJDo":21},{"cs18":"杭州斑搏文化创意发展有限公司","woVjjJDo":19},{"cs18":"广东荟星阁网络科技有限公司","woVjjJDo":16},
  {"cs18":"北京中关村融汇金融信息服务有限公司","woVjjJDo":8}
];

const chartParams: DrawParamsProps = {
    adjust: "dodge",
    aggregator: null,
    chartType: "bar",
    columns: [
        {id: "cs18", name: "organization_name", isDim: true, isRate: false},
        {id: "woVjjJDo", name: "页面_主要功能_看板", isDim: false, isRate: false}
       // {id: "woVjjJDo", name: "页面_主要功能_看板", isDim: false, metricId: {id: "woVjjJDo", level: "complex"}, isRate: false}
    ],
    granularities: []
};
const EasyChart = (props: any) => (
  <Chart chartParams={chartParams} source={retentionData} />
);
export default EasyChart;
