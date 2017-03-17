"use strict";
/*
 * 用来简易使用单图的模块，将获取数据和绘制图表用在一起
 */
import { assign, map, zip } from "lodash";
import * as React from "react";
import Chart from "./Chart";
import {DataRequestProps, Granulariy, SingleChartProps} from "./ChartProps";
import ContextListener from "./ContextListener";
import DataSource from "./DataSource";
import GrTable from "./GrTable";
interface GioProps {
  adjust?: string;
  chartType: string;
  colorTheme?: string;
  params: DataRequestProps;
  style?: any;
  extraColumns?: any;
  groupCol?: string;
}

const ChartV4 = (props: GioProps) => (
  <DataSource params={props.params} style={props.style} sourceUrl={props.sourceUrl}>
    <ContextListener
      chartType={props.chartType}
      colorTheme={props.colorTheme}
      granularities={props.params.granularities}
      adjust={props.adjust}
      extraColumns={props.extraColumns}
      groupCol={props.groupCol}
    />
  </DataSource>
);
// 根据v3的chartParams计算v4的Scheme转化
const convertChartParams = (v3Params: any): GioProps => {
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
          period: (v3Params.chartType === "comparison" ? "auto" : undefined)
        });
    }

    const params: DataRequestProps =  {
        aggregateType: (v3Params.chartType === "singleNumber" ? v3Params.aggregateType : undefined), // 聚合类型: sum, avg
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

    let chartType: string = v3Params.chartType;
    if (chartType.includes("dimension")) {
      chartType = chartType.replace("dimension", "").toLowerCase();
      if (chartType === "line" && v3Params.attrs.subChartType === "total") {
        chartType = "area";
      }
    }
    const adjust: string = (v3Params.attrs.subChartType === "total") ? "stack" : "dodge";
    return { adjust, chartType, params };
}

const GioChart = (props: GioProps) => (
  props.chartType ? <ChartV4 {...props}/> : <ChartV4 {...convertChartParams(props.params)} />
);

export { Chart, ContextListener, DataSource, GrTable, convertChartParams};
export default GioChart;
