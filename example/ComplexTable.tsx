import * as React from "react";
import {DataRequestProps, DrawParamsProps} from "../src/ChartProps";
import ContextListener from "../src/ContextListener";
import SyntheticEvent = React.SyntheticEvent;
import DataSource from "../src/DataSource";

const requestParams: DataRequestProps = {
  dimensions: ["p", "rt"],
  granularities: [],
  metrics: [{id: "oVxvKK6d"}, {id: "P2N0EE6Z"}],
  timeRange: "day:8,1",
  limit: 56
}

const retentionDrawParams: DrawParamsProps = {
  chartType: "table",
  columns: [
      {id: "p", name: "页面", isDim: true},
      {id: "rt", name: "访问来源", isDim: true},
      {id: "oVxvKK6d", name: "访问量", isDim: false},
      {id: "P2N0EE6Z", name: "跳出率", isRate: true, isDim: false}
  ],
  groupCol: "rt",
};

const ComplexTable = (props: any) => (
  <div>
    <DataSource params={requestParams} sourceUrl="auto">
      <ContextListener chartParams={retentionDrawParams} />
    </DataSource>
  </div>
);
/*const Retention = (props: any) => (
  <GioChart chartType="table" params={retentionRequestParams} />
);*/
export default ComplexTable;
