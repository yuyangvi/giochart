/***
 * 文档
 */
import {ChartProps, Metric} from './ChartProps';
import * as React from "react";
import * as moment from 'moment';
import { Table } from 'antd';
import G2 = require("g2");

// import 'antd/lib/table/style/index.js';
const sorterDecorator = (column: string) => (a:any, b:any) => (a[column] > b[column] ? 1 : -1);

//根据中位数计算,这段难理解，自己斟酌
const calculateWeight = (range:[number, number],  median: number) => (v: number) => {
  if (v > median) {
    return `rgba(255,211,99, ${(v - median) / (range[1]-median)})`;
  } else if (v <median) {
    return `rgba(95,182,199, ${(v - median) / (range[0]-median)})`;
  }
}
const generateColRender = (m: Metric, getBgColor: Function) : Function =>
  (value: number) => ({
    children: value,
    props: { style: {backgroundColor: getBgColor(value)}}
  });
const checkDate = (m: Metric) => (m.id === 'tm' ? GrTable.formatDate : undefined);

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
    if (!source || !chartParams) {
      return null;
    }
    let frame = new G2.Frame(source);
    let cols = chartParams.columns.map((m: Metric) => ({
      title: m.name,
      dataIndex: m.id,
      key: m.id,
      sorter: sorterDecorator(m.id),
      render: (m.isDim ?
        checkDate(m) :
        generateColRender(m, calculateWeight(G2.Frame.range(frame, m.id), G2.Frame.median(frame, m.id)))
      )
    }));
    /*
    if (this.context.selected) {
      let selected = this.context.selected;
      let cols = Object.keys(selected);
      source = filter(source, (n: any) => every(cols,
        (c: string) => (n[c] >= selected[c][0] && n[c] <= selected[c][1])
      ));
    }*/

    //需要计算色值
    return <Table dataSource={source} columns={cols} pagination={ source.length > 20 ? undefined: false } />
  }
}

export default GrTable;
