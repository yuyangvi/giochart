/***
 * 文档
 */
import {GrChartProps, ChartParamsProps, ChartDataProps, Meta} from './chartProps';
import * as React from "react";
import * as moment from 'moment';
import { map, zipObject, extend } from 'lodash';
import { Table } from 'antd';

import 'antd/lib/table/style/index.js';
const sorterDecorator = (column: string) => (a:any, b:any) => (a[column] > b[column] ? 1 : -1);

class GrTable extends React.Component <GrChartProps, any> {
  static contextTypes: React.ValidationMap<any> = {
    chartData: React.PropTypes.any
  };
  static formatDate(v: number) {
    return moment.unix(v/1000).format('YYYY-MM-DD');
  }

  render() {
    let chartData = this.props.chartData || this.context.chartData;
    if (!chartData) {
      return null;
    }

    let cols = chartData.meta.map((m: Meta) => ({
      title: m.name,
      dataIndex: m.id,
      key: m.id,
      sorter: sorterDecorator(m.id),
      render: m.id === 'tm' ? GrTable.formatDate : undefined
    }));

    // TODO: 类型转换，筛选排序
    let colIds = map(chartData.meta, 'id');
    let jsonData = map(chartData.data, (n: number[], i: number) => extend(zipObject(colIds, n), { key: i }));

    return <Table dataSource={jsonData} columns={cols} pagination={ jsonData.length > 20? undefined: false } />
  }
}
GrTable.contextTypes = {
  chartData: React.PropTypes.any
};

export default GrTable;
