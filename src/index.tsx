"use strict";
/*
 * 用来简易使用单图的模块，将获取数据和绘制图表用在一起
 * TODO
 */
import * as React from "react";
import DataSource from "./DataSource";
import Chart from "./Chart";
import GrTable from './GrTable';

import { DataRequestProps } from './ChartProps';
interface GioProps {
  chartType: string;
  params: DataRequestProps;
  style?: any;
}

class GioChart extends React.Component <GioProps, any> {
  render() {
    return (
      <DataSource params={this.props.params} style={this.props.style}>
        { this.props.chartType === 'table' ?
          <GrTable granularities={this.props.params.granularities} /> :
          <Chart chartType={this.props.chartType} granularities={this.props.params.granularities}/>
        }
      </DataSource>
    );
  }
}
export { Chart, DataSource, GrTable };
export default GioChart;
