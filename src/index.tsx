"use strict";
/*
 * 用来简易使用单图的模块，将获取数据和绘制图表用在一起
 */
import * as React from "react";
import Chart from "./Chart";
import { DataRequestProps } from "./ChartProps";
import ContextListener from "./ContextListener";
import DataSource from "./DataSource";
import GrTable from "./GrTable";
interface GioProps {
  chartType: string;
  params: DataRequestProps;
  style?: any;
}

const GioChart = (props: GioProps) => (
  <DataSource params={props.params} style={props.style} sourceUrl="/assets/demo.json">
    <ContextListener chartType={props.chartType} />
  </DataSource>
);
export { Chart, DataSource, GrTable };
export default GioChart;
