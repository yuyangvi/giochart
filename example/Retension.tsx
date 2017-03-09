import * as React from 'react';
import {DataRequestProps, DrawParamsProps} from '../src/ChartProps';
import SyntheticEvent = React.SyntheticEvent;
// import Chart from '../src/Chart';
// import DataSource from "../src/DataSource";
import GioChart from '../src/index';
// import ContextListener from "../src/ContextListener";
interface EventSeletorTarget extends EventTarget {
    value: string
}

const retensionRequestParams: DataRequestProps = {
  attrs: {userType: "nuv"},
  dimensions: ["rt"],
  granularities: [{id: "rt", values: ["外部链接"]}],
  metrics: [{id: "woV73y92", action: "page"}, {id: "9yGbpp8x"}],
  timeRange: "day:8,1",
  type: "retention"
}

const retensionDrawParams: DrawParamsProps = {
  chartType: "table",
  columns: [
      {id: "tm", name: "时间", isDim: true},
      {id: "0gw432", name: "访问用户量", isDim: false}
  ],
  granularities: [{id: "tm", interval: 86400 }]
};
/*
<DataSource params={retensionRequestParams} sourceUrl="/assets/demo.json">
  <ContextListener chartParams={retensionDrawParams} />
</DataSource>
*/
const Retension = (props: any) => (
  <GioChart chartType="table" params={retensionRequestParams} />
);
export default Retension;
