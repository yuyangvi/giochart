/***
 * 文档
 */
import {ChartProps, Metric} from './ChartProps';
import * as React from "react";
import * as moment from 'moment';
import { Table } from 'antd';
import 'antd/lib/table/style/index.js';
const sorterDecorator = (column: string) => (a:any, b:any) => (a[column] > b[column] ? 1 : -1);

class GrTable extends React.Component <ChartProps, any> {
  static contextTypes: React.ValidationMap<any> = {
    columns: React.PropTypes.array,
    selected: React.PropTypes.any,
    selectHandler: React.PropTypes.func,
    source: React.PropTypes.array
  };
  static formatDate(v: number) {
    return moment.unix(v/1000).format('YYYY-MM-DD');
  }
  private generateChartParams(columns: Metric[]) {
    if (!columns) {
      return;
    }
    return {
      chartType: 'table',
      columns: columns,
      granularities: this.props.granularities
    };
  }


  render() {
    let source = this.props.source || this.context.source;
    let chartParams = this.props.chartParams || this.generateChartParams(this.context.columns);
    console.log(chartParams, source);
    if (!source || !chartParams) {
      return null;
    }

    let cols = chartParams.columns.map((m: Metric) => ({
      title: m.name,
      dataIndex: m.id,
      key: m.id,
      sorter: sorterDecorator(m.id),
      render: m.id === 'tm' ? GrTable.formatDate : undefined
    }));
    /*
    if (this.context.selected) {
      let selected = this.context.selected;
      let cols = Object.keys(selected);
      source = filter(source, (n: any) => every(cols,
        (c: string) => (n[c] >= selected[c][0] && n[c] <= selected[c][1])
      ));
    }*/
    return <Table dataSource={source} columns={cols} pagination={ source.length > 20 ? undefined: false } />
  }
}

export default GrTable;
