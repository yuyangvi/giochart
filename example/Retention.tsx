import * as React from 'react';
import {DataRequestProps, DrawParamsProps} from '../src/ChartProps';
import SyntheticEvent = React.SyntheticEvent;
import Chart from '../src/Chart';
// import DataSource from "../src/DataSource";
// import GioChart from '../src/index';
// import ContextListener from "../src/ContextListener";
interface EventSeletorTarget extends EventTarget {
    value: string
}
const retentionRequestParams: DataRequestProps = {
  dimensions: ["tm"],
  granularities: [{id: "rt", values: ["外部链接"]}],
  metrics: [{id: "0gw432", action: "page"}, {id: "rate"}],
  timeRange: "day:8,1",
}
const chartParams = {"adjust":"stack","chartType":"vbar","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"ogWZ55d4","name":"页面浏览量","isDim":false,"metricId":{"id":"ogWZ55d4","level":"complex"},"isRate":false},{"id":"9yGbpp8x","name":"访问用户量","isDim":false,"metricId":{"id":"9yGbpp8x","level":"complex"},"isRate":false},{"id":"PDjgVV6l","name":"登录用户量","isDim":false,"metricId":{"id":"PDjgVV6l","level":"complex"},"isRate":false}],"granularities":[{"id":"tm","interval":86400000}]};
const source = [
  {tm: 1489334400000, ogWZ55d4: 68574, "9yGbpp8x": 5260, PDjgVV6l: 1974 },
  {"tm":1489420800000,"ogWZ55d4":68157,"9yGbpp8x":5046,"PDjgVV6l":1939},
  {"tm":1489507200000,"ogWZ55d4":61947,"9yGbpp8x":5258,"PDjgVV6l":1920},
  {"tm":1489593600000,"ogWZ55d4":59061,"9yGbpp8x":4701,"PDjgVV6l":1759},
  {"tm":1489680000000,"ogWZ55d4":63516,"9yGbpp8x":4800,"PDjgVV6l":1848},
  {"tm":1489766400000,"ogWZ55d4":15041,"9yGbpp8x":1425,"PDjgVV6l":532},
  {"tm":1489852800000,"ogWZ55d4":8891,"9yGbpp8x":1203,"PDjgVV6l":436}
];
const retentionDrawParams: DrawParamsProps = {
  chartType: "line",
  columns: [
    {id: "tm", name: "时间", isDim: true},
    {id: "0gw432", name: "访问用户量", isDim: false},
    {id: "rate", name: "访量", isDim: false}
  ],
  granularities: [{id: "tm", interval: 86400000 }]
};

/* const Retention = (props) => (
  <div>
    <DataSource params={retentionRequestParams} sourceUrl="/assets/demo.json">
      <ContextListener chartParams={retentionDrawParams} />
    </DataSource>
  </div>
); */

const Retention = (props: any) => (
  <Chart chartParams={chartParams} source={source} />
);
export default Retention;
