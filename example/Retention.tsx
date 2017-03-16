import * as React from 'react';
import {DataRequestProps, DrawParamsProps} from '../src/ChartProps';
import SyntheticEvent = React.SyntheticEvent;
// import Chart from '../src/Chart';
import DataSource from "../src/DataSource";
import GioChart from '../src/index';
import ContextListener from "../src/ContextListener";
import Chart from "../src/Chart";
interface EventSeletorTarget extends EventTarget {
    value: string
}

const retentionRequestParams: DataRequestProps = {
  attrs: {userType: "nuv"},
  dimensions: ["rt"],
  granularities: [{id: "rt", values: ["外部链接"]}],
  metrics: [{id: "woV73y92", action: "page"}, {id: "9yGbpp8x"}],
  timeRange: "day:8,1",
  type: "retention"
}

const retentionDrawParams: DrawParamsProps = {
  chartType: "dualaxis",
  columns: [
      {id: "tm", name: "时间", isDim: true},
      {id: "0gw432", name: "访问用户量", isDim: false},
      {id: "rate", name: "访量", isDim: false}
  ],
  granularities: [{id: "tm", interval: 86400000 }]
};

const params = {"adjust":"dodge","chartType":"comparison","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"9yGbpp8x","name":"当前周期","isDim":false,"metricId":{"id":"9yGbpp8x","level":"complex"},"isRate":false},{"id":"tm_","isDim":true,"isRate":false},{"id":"9yGbpp8x_","name":"上一周期","isDim":false,"metricId":{"id":"9yGbpp8x","level":"complex"},"isRate":false}],"granularities":[{"id":"tm","interval":3600000,"period":"auto"}]};
const source = [
  {"tm":1489593600000,"9yGbpp8x":75,"tm_":1488988800000,"9yGbpp8x_":73},
  {"tm":1489597200000,"9yGbpp8x":37,"tm_":1488992400000,"9yGbpp8x_":31},
  {"tm":1489600800000,"9yGbpp8x":32,"tm_":1488996000000,"9yGbpp8x_":25},
  {"tm":1489604400000,"9yGbpp8x":19,"tm_":1488999600000,"9yGbpp8x_":14},
  {"tm":1489608000000,"9yGbpp8x":15,"tm_":1489003200000,"9yGbpp8x_":20},
  {"tm":1489611600000,"9yGbpp8x":7,"tm_":1489006800000,"9yGbpp8x_":9},
  {"tm":1489615200000,"9yGbpp8x":9,"tm_":1489010400000,"9yGbpp8x_":14},
  {"tm":1489618800000,"9yGbpp8x":23,"tm_":1489014000000,"9yGbpp8x_":38},
  {"tm":1489622400000,"9yGbpp8x":142,"tm_":1489017600000,"9yGbpp8x_":130},
  {"tm":1489626000000,"9yGbpp8x":670,"tm_":1489021200000,"9yGbpp8x_":653},
  {"tm":1489629600000,"9yGbpp8x":894,"tm_":1489024800000,"9yGbpp8x_":830},
  {"tm":null,"9yGbpp8x":null,"tm_":1489028400000,"9yGbpp8x_":814},
  {"tm":null,"9yGbpp8x":null,"tm_":1489032000000,"9yGbpp8x_":301},
  {"tm":null,"9yGbpp8x":null,"tm_":1489035600000,"9yGbpp8x_":525},
  {"tm":null,"9yGbpp8x":null,"tm_":1489039200000,"9yGbpp8x_":866},
  {"tm":null,"9yGbpp8x":null,"tm_":1489042800000,"9yGbpp8x_":848},
  {"tm":null,"9yGbpp8x":null,"tm_":1489046400000,"9yGbpp8x_":864},
  {"tm":null,"9yGbpp8x":null,"tm_":1489050000000,"9yGbpp8x_":835},
  {"tm":null,"9yGbpp8x":null,"tm_":1489053600000,"9yGbpp8x_":585},
  {"tm":null,"9yGbpp8x":null,"tm_":1489057200000,"9yGbpp8x_":341},
  {"tm":null,"9yGbpp8x":null,"tm_":1489060800000,"9yGbpp8x_":290},
  {"tm":null,"9yGbpp8x":null,"tm_":1489064400000,"9yGbpp8x_":221},
  {"tm":null,"9yGbpp8x":null,"tm_":1489068000000,"9yGbpp8x_":156},
  {"tm":null,"9yGbpp8x":null,"tm_":1489071600000,"9yGbpp8x_":107}
  ]
const Retention = (props) => (
  <div>
    <Chart params={} source={}/>
    <DataSource params={retentionRequestParams} sourceUrl="/assets/demo.json">
      <ContextListener chartParams={retentionDrawParams} />
    </DataSource>
  </div>
);
/*const Retention = (props: any) => (
  <GioChart chartType="table" params={retentionRequestParams} />
);*/
export default Retention;
