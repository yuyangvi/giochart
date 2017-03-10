"use strict";
/*
 * 用来简易使用单图的模块，将获取数据和绘制图表用在一起
 */
import { assign, map, zip } from "lodash";
import * as React from "react";
import Chart from "./Chart";
import {DataRequestProps, Granulariy} from "./ChartProps";
import ContextListener from "./ContextListener";
import DataSource from "./DataSource";
import GrTable from "./GrTable";
interface GioProps {
  adjust?: string;
  chartType: string;
  params: DataRequestProps;
  style?: any;
  extraColumns?: any;
}

const GioChart = (props: GioProps) => (
  <DataSource params={props.params} style={props.style}>
    <ContextListener
      chartType={props.chartType}
      granularities={props.params.granularities}
      adjust={props.adjust}
      extraColumns={props.extraColumns}
    />
  </DataSource>
);
// 根据v3的chartParams计算v4的Scheme转化
const convertChartParams = (v3Params: any): DataRequestProps => {
    const metrics = v3Params.metrics;
    const dimensions = v3Params.dimensions || [];

    const granularities: Granulariy[] = [];
    if (v3Params.chartType.includes("dimension")) {
        granularities.push({id: dimensions[0], top: v3Params.top});
        dimensions.unshift("tm");
    }
    if (dimensions.length === 0) {
        dimensions.unshift(v3Params.chartType === "bar" ? "v" : "tm");
    }
    // convert granularities
    if (dimensions.includes("tm")) {
        granularities.unshift({
          id: "tm",
          interval: v3Params.interval,
          period: (v3Params.chartType === "comparison" ? v3Params.period : undefined)
        });
    }

    return {
        aggregateType: (v3Params.chartType === "comparison" ? v3Params.aggregateType : undefined), // 聚合类型: sum, avg
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
