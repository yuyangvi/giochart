/***
 * 文档
 */
import {ChartProps, Metric, DataRequestProps} from './ChartProps';
import * as React from "react";
import * as moment from 'moment';
import { map, zipObject, extend, filter, every } from 'lodash';
import { Table } from 'antd';
import 'antd/lib/table/style/index.js';
const sorterDecorator = (column: string) => (a:any, b:any) => (a[column] > b[column] ? 1 : -1);

class GrTable extends React.Component <ChartProps, any> {
  static contextTypes: React.ValidationMap<any> = {
    chartData: React.PropTypes.any,
    selected: React.PropTypes.any,
    selectHandler: React.PropTypes.func
  };
  static formatDate(v: number) {
    return moment.unix(v/1000).format('YYYY-MM-DD');
  }

  render() {
    let source = this.props.source || this.context.source;
    if (!source) {
      return null;
    }

    let cols = source.meta.map((m: Metric) => ({
      title: m.name,
      dataIndex: m.id,
      key: m.id,
      sorter: sorterDecorator(m.id),
      render: m.id === 'tm' ? GrTable.formatDate : undefined
    }));

    if (this.context.selected) {
      let selected = this.context.selected;
      let cols = Object.keys(selected);
      source = filter(source, (n: any) => every(cols,
        (c: string) => (n[c] >= selected[c][0] && n[c] <= selected[c][1])
      ));
    }
    return <Table dataSource={source} columns={cols} pagination={ source.length > 20 ? undefined: false } />
  }
}

export default GrTable;
