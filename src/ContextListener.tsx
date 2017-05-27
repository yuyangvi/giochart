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
    startTime: React.PropTypes.number,
    trackWords: React.PropTypes.any
  };

  public render() {
    const chartParams = this.generateChartParams();
    const withAggregate: boolean = ["comparison", "singleNumber"].includes(chartParams.chartType);

    if (chartParams.chartType === "table") {
      return (
        <GrTable
          chartParams={chartParams}
          extraColumns={this.props.extraColumns}
          source={this.context.source}
          select={this.props.select}
          selected={this.context.selected}
          sortHandler={this.props.sortHandler}
          startTime={this.context.startTime}
          trackWords={this.context.trackWords}
        />
      );
    } else if (!this.context.source || !this.context.source.length) {
      const outerStyle = {
        "-webkit-box-orient": "vertical",
        "-webkit-box-pack": "center",
        "display": "-webkit-box",
        "height": "100%"
      };
      const wordStyle = {
        color: "#999999",
        fontSize: 16,
        fontWeight: 200,
        textAlign: "center"
      };
      return (
        <div style={outerStyle}>
          <div style={wordStyle}>暂无数据</div>
        </div>
      );
    } else if (withAggregate) {
      const isRate = !!(this.context.columns && this.context.columns.length > 1 && this.context.columns[1].isRate);
      return (
        <div className={`gr-chart-wrapper ${chartParams.chartType}`}>
          <Aggregate data={this.context.aggregates} period={this.props.range} isRate={isRate} />
          <Chart
            chartParams={chartParams}
            colorTheme={this.props.colorTheme}
            source={this.context.source}
            select={this.props.select}
            selected={this.context.selected}
            startTime={this.context.startTime}
            trackWords={this.context.trackWords}
            isThumb={this.props.isThumb}
          />
        </div>);
    } else if (chartParams.chartType === "singleNumber") {
      return (
        <div className="gr-chart-wrapper">
          <Aggregate data={this.context.aggregates} period={this.props.range} />
          <Chart
            chartParams={chartParams}
            colorTheme={this.props.colorTheme}
            source={this.context.source}
            select={this.props.select}
            style={{height: "calc(100% - 40px)"}}
            selected={this.context.selected}
            startTime={this.context.startTime}
            trackWords={this.context.trackWords}
            isThumb={this.props.isThumb}
          />
        </div>);
    }
    return (
      <Chart
        chartParams={chartParams}
        source={this.context.source}
        select={this.props.select}
        selected={this.context.selected}
        startTime={this.context.startTime}
        trackWords={this.context.trackWords}
        isThumb={this.props.isThumb}
      />
    );
  }
  private generateChartParams() {
    if (this.props.hasOwnProperty("chartParams")) {
      return this.props.chartParams;
    }
    return {
      adjust: this.props.adjust,
      aggregates: this.context.aggregates,
      chartType: this.props.chartType,
      colorTheme: this.props.colorTheme,
      columns: this.context.columns,
      // 以下目前只有表格处用到
      granularities: this.props.granularities,
      groupCol: this.props.groupCol
    };
  }
}

export default ContextListener;
