/*
 * ContextListener 负责监听的控件，并把context传递给Chart
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import Chart from './Chart';
import {SingleChartProps} from './ChartProps';

class ContextListener extends React.Component <SingleChartProps, any> {
  private static contextTypes: React.ValidationMap<any> = {
    selected: React.PropTypes.any,
    source: React.PropTypes.any,
    columns: React.PropTypes.array,
    selectHandler: React.PropTypes.func
  };
  private generateChartParams() {
    if (this.props.hasOwnProperty('chartParams')) {
      return this.props.chartParams;
    }
    return {
      chartType: this.props.chartType,
      columns: this.context.columns,
      granularities: this.props.granularities
    };
  }
  render() {
    return <Chart chartParams={this.generateChartParams()} source={this.context.source} />
  }
}

export default ContextListener;