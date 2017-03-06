"use strict";
/*
 * 用来简易使用单图的模块，将获取数据和绘制图表用在一起
 * TODO
 */
import * as React from "react";
import DataSource from "./DataSource";
import Chart from "./Chart";
import {DataLoaderProps, DataRequestProps, DrawParamsProps, Metric } from './ChartProps';
interface GioProps {
  chartType: string;
  params: DataRequestProps;
  style?: any;
}

const generateChartParams = (props: GioProps, columns: Metric[]): DrawParamsProps => {
  return {
    chartType: props.chartType,
    columns: columns,
    granularities: props.params.granularities
  };
};
class GioChart extends React.Component <GioProps, any> {
  render() {
    return (
      <DataSource params={this.props.params} style={this.props.style}>
        <Chart chartType='line' granularities={this.props.params.granularities} />
      </DataSource>
    );
  }
}
export { Chart, DataSource };
export default GioChart;
