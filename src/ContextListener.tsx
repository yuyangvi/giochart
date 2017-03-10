/*
 * ContextListener 负责监听的控件，并把context传递给Chart
 */
import * as React from "react";
import Chart from "./Chart";
import {SingleChartProps} from "./ChartProps";
import GrTable from "./GrTable";

class ContextListener extends React.Component <SingleChartProps, any> {
  private static contextTypes: React.ValidationMap<any> = {
    columns: React.PropTypes.array,
    selectHandler: React.PropTypes.func,
    selected: React.PropTypes.any,
    source: React.PropTypes.any
  };
  public render() {
    const chartParams = this.generateChartParams();
    return chartParams.chartType === "table" ?
      <GrTable chartParams={chartParams} source={this.context.source} select={this.props.select} /> :
      <Chart chartParams={chartParams} source={this.context.source} select={this.props.select} />;
  }
  private generateChartParams() {
    if (this.props.hasOwnProperty("chartParams")) {
      return this.props.chartParams;
    }
    return {
      adjust: this.props.adjust,
      chartType: this.props.chartType,
      columns: this.context.columns,
      granularities: this.props.granularities
    };
  }
}

export default ContextListener;