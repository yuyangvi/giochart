/***
 * 文档
 */
import { Table } from "antd";
import {ChartProps, Metric} from './ChartProps';
import * as React from "react";
import * as moment from 'moment';
// import Table from 'antd/lib/table';
import G2 = require("g2");
const sorterDecorator = (column: string) => (a: any, b: any) => (a[column] > b[column] ? 1 : -1);

// 根据中位数计算颜色,这段难理解，自己斟酌
const calculateWeight = (range: [number, number],  median: number) => (v: number) => {
  if (v > median) {
    return `rgba(255,211,99, ${(v - median) / (range[1] - median)})`;
  } else if (v < median) {
    return `rgba(95,182,199, ${(v - median) / (range[0] - median)})`;
  }
}
// 根据metric取得背景色
const generateColRender = (m: Metric, getBgColor: (v: number) => string): ((v: number) => any) =>
  (value: number) => ({
    children: value,
    props: { style: {backgroundColor: getBgColor(value)}}
  });
const checkDate = (m: Metric) => (m.id === "tm" ? GrTable.formatDate : undefined);

class GrTable extends React.Component <ChartProps, any> {
  public static formatDate(v: number) {
    return moment.unix(v / 1000).format("YYYY-MM-DD");
  }
  private static getRowKey(r: any, i: number) {
    return `${i}`;
  }

  public render() {
    const { chartParams, source } = this.props;
    if (!source || !chartParams) {
      return null;
    }
    const frame = new G2.Frame(source);
    let cols = chartParams.columns.map((m: Metric) => ({
      dataIndex: m.id,
      key: m.id,
      render: (m.isDim ?
        checkDate(m) :
        generateColRender(m, calculateWeight(G2.Frame.range(frame, m.id), G2.Frame.median(frame, m.id)))
      ),
      sorter: sorterDecorator(m.id),
      title: m.name,
    }));
    if (this.props.hasOwnProperty("extraColumns")) {
      cols = cols.concat(this.props.extraColumns);
    }
    /*
    if (this.context.selected) {
      let selected = this.context.selected;
      let cols = Object.keys(selected);
      source = filter(source, (n: any) => every(cols,
        (c: string) => (n[c] >= selected[c][0] && n[c] <= selected[c][1])
      ));
    }*/

    // TODO: 增加selected处理
    return (
      <Table
        dataSource={source}
        columns={cols}
        pagination={source.length > 20 ? undefined : false}
        rowKey={GrTable.getRowKey}
      />
    );
  }
}

export default GrTable;
