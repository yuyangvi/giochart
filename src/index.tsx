"use strict";
/*
 * 用来简易使用单图的模块，将获取数据和绘制图表用在一起
 */
import { assign, map, zip } from "lodash";
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
// 根据v3的chartParams计算v4的Scheme转化
const convertChartParams = (v3Params: any): DataRequestProps => {
    // convert metric & dimensions
    const functor = (n: any[]) => assign(n[0], {name: n[1]});
    const metrics = map(zip(v3Params.metrics, v3Params.metricNames), functor);
    let dimensions = v3Params.dimensions;
    // const dimensions = map(zip(v3Params.metrics, v3Params.dimenstionsName), functor);
    if (dimensions.length === 0) {
        dimensions = ["tm"];
    }
    // convert granularities
    let granularities;
    if (dimensions.includes("tm")) {
        granularities = [{ id: "tm", interval: v3Params.interval, period: v3Params.period }];
    }
    return {
        aggregateType: v3Params.aggregateType, // 聚合类型: sum, avg
        // attrs: {}, // 属性
        dimensions,
        filter: v3Params.filter, // 过滤
        granularities, // 粒度
        limit: v3Params.top, // 数据行限制 10
        metrics,
        orders: v3Params.orders, // 排序
        timeRange: v3Params.timeRange, // 时间区域 day:8,1
        userTag: v3Params.userTag // 用户分群ID
    };
}
export { Chart, ContextListener, DataSource, GrTable, convertChartParams};
export default GioChart;
