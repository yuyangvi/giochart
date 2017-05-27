import * as React from "react";
import {DataRequestProps, DrawParamsProps} from "../src/ChartProps";
import DataSource from "../src/DataSource";
import ContextListener from "../src/ContextListener";
const chartParams: DataRequestProps = {
  dimensions: ["tm", "comparision_value", "metric_name"],
  granularities: [{ id: "tm", interval: 86400000 }],
  metrics: [{ id: "conversion", isRate: false }, { id: "conversion_rate", isRate: true }],
  timeRange: "day:8,1"
};

const Funnel = (props: any) => (
  <DataSource params={chartParams} sourceUrl="assets/funnel.json">
      <ContextListener chartType="funnel" />
  </DataSource>
);
export default Funnel;

