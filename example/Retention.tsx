import * as React from 'react';
import {DataRequestProps, DrawParamsProps, Source} from '../src/ChartProps';
import SyntheticEvent = React.SyntheticEvent;
import Chart from '../src/Chart';
// import DataSource from "../src/DataSource";
// import GioChart from '../src/index';
// import ContextListener from "../src/ContextListener";
interface EventSeletorTarget extends EventTarget {
    value: string;
}
const retentionRequestParams: DataRequestProps = {
  dimensions: ["tm"],
  granularities: [{id: "rt", values: ["外部链接"]}],
  metrics: [{id: "0gw432", action: "page"}, {id: "rate"}],
  timeRange: "day:8,1",
}
const chartParams = {
  adjust: "stack",
  chartType: "vbar",
  columns: [
    { id: "tm", name: "时间", isDim: true, isRate: false },
    { id: "kw", name: "搜索词", isDim: true, isRate: false },
    { id: "98WL33gd", name: "每次会话浏览页数", isDim: false, isRate: false }
  ],
  granularities: [{ id: "tm", interval: 86400000 }]
};
const source: Source = [{ tm: 1400000000, kw: "哇哈哈", WL33gd98: 20}];
const retentionDrawParams: DrawParamsProps = {
  chartType: "line",
  columns: [
    {id: "tm", name: "时间", isDim: true, isRate: false},
    {id: "kw", name: "搜索词", isDim: true, isRate: false},
    {id: "WL33gd98", name: "每次会话浏览页数", isDim: false, isRate: false}
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
