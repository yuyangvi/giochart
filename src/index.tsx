"use strict";
/*
 * 用来简易使用单图的模块，将获取数据和绘制图表用在一起
 */
import { assign, map, zip } from "lodash";
import * as React from "react";
import Chart from "./Chart";
import {DataRequestProps, Granulariy, SingleChartProps, Source} from "./ChartProps";
import ContextListener from "./ContextListener";
import DataSource from "./DataSource";
import GrTable from "./GrTable";
interface GioProps {
  adjust?: string;
  chartType: string;
  colorTheme?: string;
  params: DataRequestProps;
  extraColumns?: any;
  groupCol?: string;
  sourceUrl?: string;
  cacheOptions?: any;
}
const timeWeekRange = (timeRange: string) => {
  if (!timeRange) {
    timeRange = "day:8,1";
  }
  const [cate, v] = timeRange.split(":");
  const [start, end] = v.split(",");
  if (cate === "day") {
    return parseInt(start, 10) > 7;
  } else if (cate === "abs") {
    return (parseInt(end, 10) - parseInt(start, 10)) > (86400000 * 7);
  }
}

const ChartV4 = (props: GioProps) => (
  <DataSource params={props.params} cacheOptions={props.cacheOptions}>
    <ContextListener
      chartType={props.chartType}
      colorTheme={props.colorTheme}
      granularities={props.params.granularities}
      adjust={props.adjust}
      extraColumns={props.extraColumns}
      groupCol={props.groupCol}
      range={timeWeekRange(props.params.timeRange)}
    />
  </DataSource>
);
// 根据v3的chartParams计算v4的Scheme转化
const convertChartParams = (v3Params: any): GioProps => {
  if (!v3Params.chartType) {
    return null;
  }
  const metrics = v3Params.metrics;
  let dimensions = v3Params.dimensions || [];
  let granularities: Granulariy[] = [];
  if (["dimensionLine", "dimensionVbar", "singleNumber"].includes(v3Params.chartType) && !dimensions.includes("tm")) {
    granularities = granularities.concat({ id: dimensions[0], top: v3Params.top });
    dimensions = ["tm"].concat(dimensions);
  }
  if (dimensions.length === 0) {
      dimensions = [v3Params.chartType === "bar" ? "v" : "tm"].concat(dimensions);
  }
  if (dimensions.includes("tm")) {
    // const interval = v3Params.chartType === "singleNumber" ? (v3Params.interval * 1000) : v3Params.interval
    granularities = granularities.concat({
      id: "tm",
      interval: v3Params.interval,
      period: (v3Params.chartType === "comparison" ? "auto" : undefined)
    });
  }

  // 计算是否有总计: 线图、柱图、维度线图、维度柱图percent， 大数字
  // aggregation: true | false | NULL -- 是否需要返回聚合值
  // aggregator: sum | avg | NULL -- 按照那种聚合函数做聚合
  let aggregation: boolean;
  let aggregator: string;
  if (v3Params.chartType === "singleNumber") {
    aggregation = true;
    aggregator = v3Params.aggregateType || "sum";
  } else if (v3Params.chartType === "bar") {
    aggregator = "sum";
    aggregation = false;
  }
  const params: DataRequestProps = {
    aggregation, // 只有大数字是true
    aggregator, // 聚合类型: sum, avg
    attrs: v3Params.attrs, // 属性
    dimensions,
    filter: v3Params.filter, // 过滤
    granularities, // 粒度
    id: v3Params.id,
    limit: ["bar", "abar", "table"].includes(v3Params.chartType) ? v3Params.top : undefined, // 数据行限制 10
    metrics,
    orders: v3Params.orders, // 排序
    timeRange: v3Params.timeRange, // 时间区域 day:8,1
    userTag: v3Params.userTag // 用户分群ID
  };

  let chartType: string = v3Params.chartType;
  if (chartType === "line" && v3Params.metrics.length < 2) {
    chartType = "area";
  }
  if (chartType.includes("dimension")) {
    chartType = chartType.replace("dimension", "").toLowerCase();
  }
  if (chartType === "line" && v3Params.attrs.subChartType && v3Params.attrs.subChartType !== "seperate") {
    chartType = "area";
  }
  if (chartType === "abar") {
    chartType = "bar";
  }
  if (chartType === "funnel") {
    params.type = "funnel";
  }
  let adjust: string = v3Params.attrs.subChartType  || "dodge";
  if (adjust === "seperate") {
    adjust = "dodge";
  } else if (adjust === "total") {
    adjust = "stack";
  }

  const colorTheme: string = v3Params.attrs.colorTheme;
  return { adjust, chartType, params, colorTheme };
}

const GioChart = (props: GioProps) => {
  if (props.chartType) {
    return <ChartV4 {...props}/>;
  }
  const convertV4: GioProps = convertChartParams(props.params);
  if (!convertV4) {
    return <p>参数不合法</p>;
  }
  if (props.groupCol) {
    convertV4.params.expanded = true;
  }

  return (
    <ChartV4
      extraColumns={props.extraColumns}
      groupCol={props.groupCol}
      {...convertV4}
      cacheOptions={props.cacheOptions}
    />
  );
};

export { Chart, ContextListener, DataSource, GrTable, convertChartParams};
export default GioChart;
