/*
 * ContextListener 负责监听的控件，并把context传递给Chart
 */
import * as React from "react";
import Aggregate from "./Aggregate";
import Chart from "./Chart";
import { SingleChartProps, DrawParamsProps, Metric } from "./ChartProps";
import GrTable from "./GrTable";
import { retentionSourceSelector } from "./utils";
import {map, filter} from "lodash";
class ContextListener extends React.Component <SingleChartProps, any> {
  private static contextTypes: React.ValidationMap<any> = {
    aggregator: React.PropTypes.any,
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
          <Aggregate data={this.context.aggregator.values} period={this.props.range} isRate={isRate} />
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
          <Aggregate data={this.context.aggregator.values} period={this.props.range} />
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
    } else if (["retention", "retentionTrend"].includes(chartParams.chartType)) {
      const source = retentionSourceSelector(this.context.source, ["comparison_value"], false);
      let values: string[] = null;
      if (this.context.columns) {
        values = map(filter(this.context.columns, (n: Metric) => (/^retention_\d+$/.test(n.id))), "name");
      }
      const retentionParams: DrawParamsProps = {
        adjust: "stack",
        chartType: chartParams.chartType,
        columns: [
          { id: "turn", name: "留存周期", isDim: true, isRate: false, values},
          { id: "retention", name: "用户数", isDim: false, isRate: false },
          { id: "retention_rate", name: "留存率", isDim: false, isRate: true }
        ]
      };

      return (
        <Chart
          chartParams={retentionParams}
          colorTheme={this.props.colorTheme}
          source={source}
          startTime={this.context.startTime}
          trackWords={this.context.trackWords}
          isThumb={this.props.isThumb}
        />
      );
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
      aggregator: this.context.aggregator,
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
