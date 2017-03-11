/*
 * ContextListener 负责监听的控件，并把context传递给Chart
 */
import * as React from "react";
import Aggregate from "./Aggregate";
import Chart from "./Chart";
import {SingleChartProps} from "./ChartProps";
import GrTable from "./GrTable";
class ContextListener extends React.Component <SingleChartProps, any> {
  private static contextTypes: React.ValidationMap<any> = {
    aggregates: React.PropTypes.array,
    columns: React.PropTypes.array,
    extraColumns: React.PropTypes.any,
    selectHandler: React.PropTypes.func,
    selected: React.PropTypes.any,
    source: React.PropTypes.any,
  };
  public render() {
    const chartParams = this.generateChartParams();
    if (chartParams.chartType === "table") {
      return (
        <GrTable
          chartParams={chartParams}
          source={this.context.source}
          select={this.props.select}
          extraColumns={this.props.extraColumns}
        />
      );
    } else if (chartParams.chartType === "comparison") {
      return (
        <div className="gr-chart-wrapper">
          <Aggregate data={this.context.aggregates} period={this.props.granularities[0].period >= 7} />
          <Chart chartParams={chartParams} source={this.context.source} select={this.props.select} colorTheme={this.props.colorTheme}/>
        </div>);
    }
    return <Chart chartParams={chartParams} source={this.context.source} select={this.props.select} colorTheme={this.props.colorTheme} />;
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