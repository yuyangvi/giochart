/***
 * 文档
 */
import { difference, fill, filter, find, flatMap, forIn, groupBy, map, pick, unionBy, values, isEqual } from "lodash";
import moment from "moment";
import React from "react";
import {ChartProps, Metric, Source} from "./ChartProps";

import G2 = require("g2");
import Table = require("antd/lib/table");
const ATable: any = Table;
const sorterDecorator = (column: string) => (a: any, b: any) => (a[column] >= b[column] ? 1 : -1);
moment.locale("zh-cn");
// 根据中位数计算颜色,这段难理解，自己斟酌
const calculateWeight = (range: [number, number],  median: number) => (v: number) => {
  if (median ===  null) {
    return "";
  }
  if (v > median) {
    return `rgba(255,211,99, ${(v - median) * 0.5 /  (range[1] - median)})`;
  } else if (v < median) {
    return `rgba(95,182,199, ${(v - median) * 0.5 / (range[0] - median)})`;
  }
}
// 根据metric取得背景色
const descValue = (value: number|undefined, isRate: boolean): string|undefined => {
  if (value) {
    if (isRate) {
      return (100 * value).toPrecision(3) + "%";
    } else if (!Number.isInteger(value)) {
      const s = value.toString();
      if (s.length - s.lastIndexOf(".") < 5) {
        return s;
      }
      return value.toPrecision(3);
    }
  }
  if (typeof value === "string") {
    return value;
  }
  if (value === null) {
    return "";
  }
  return value === undefined ? undefined : value.toString();
}
const generateColRender = (getBgColor: (v: number) => string, m: Metric): ((v: number) => any) =>
  (value: number) => ({
    children: descValue(value, m.isRate), // (value && !Number.isInteger(value) ? value.toPrecision(3) : value),
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
  private lastSorter = {};
  private checkDate(m: Metric) {
    if (m.id === "tm") {
      const gra = find(this.props.chartParams.granularities, {id: "tm"});
      if (gra.interval && gra.interval >= 864e5) {
        return (v: number) => moment.unix(v / 1000).format("YYYY-MM-DD");
      } else {
        return (v: number) => moment.unix(v / 1000).format("YYYY-MM-DD HH:mm");
      }
    }
  }
  // 将多指标扁平成一条
  private static groupFlatter(n: any, groupCol: string, groupCols: string[], otherDims: string[]) {
    return n.reduce((result: any, value: any) => {
      const i: number = groupCols.indexOf(value[groupCol]);
      forIn(value, (v, k) => {
        if (k === groupCol) {
          return;
        } else if (otherDims.includes(k)) {
          result[k] = value[k];
        } else {
          result[`${groupCol}_${i}_${k}`] = value[k];
        }
      });
      return result;
    }, {});
  }
  public render() {
    const chartParams = this.props.chartParams;
    let source = this.props.source;
    let cols: any[] = [];
    try {
      if (!source || !chartParams) {
        return null;
      }
      if (chartParams.groupCol) {
        const dimNames: any[] = difference(map(filter(chartParams.columns, "isDim"), "id"), [chartParams.groupCol]);
        const metrics: Metric[] = filter(chartParams.columns, {isDim: false});

        const groupColValues: any[] = flatMap(unionBy(source, chartParams.groupCol), chartParams.groupCol);
        // TODO 按时间分组
        const join = (row: any) => values(pick(row, dimNames)).join("");
        const groupSource = values(groupBy(source, join));
        source = map(groupSource, (n: any) => GrTable.groupFlatter(n, chartParams.groupCol, groupColValues, dimNames));
        const frame = new G2.Frame(source);
        // 分三段
        cols = map(dimNames, (id: string) => ({
          dataIndex: id,
          key: id,
          sorter: sorterDecorator(id),
          title: find(chartParams.columns, {id}).name
        }));
        const metricCols = groupColValues.map((name: string, i: number) => ({
          title: name,
          children: map(metrics, (m: Metric) => {
            const id = `${chartParams.groupCol}_${i}_${m.id}`;
            return {
              className: "metric",
              dataIndex: id,
              key: id,
              render: generateColRender(calculateWeight(G2.Frame.range(frame, id), G2.Frame.median(frame, id)), m),
              sorter: sorterDecorator(id),
              title: m.name,
            };
          })
        }));
        cols = cols.concat(metricCols);
      } else {
        const frame = new G2.Frame(source);
        cols = chartParams.columns.map((m: Metric, i: number) => ({
          className: m.isDim ? undefined : "metric",
          dataIndex: m.id,
          key: `${m.id}_${i}`,
          render: (m.isDim ?
            this.checkDate(m) :
            generateColRender(calculateWeight(G2.Frame.range(frame, m.id), G2.Frame.median(frame, m.id)), m)
          ),
          sorter: sorterDecorator(m.id),
          title: m.name,
        }));
      }
      // hardcode
      if (this.props.hasOwnProperty("extraColumns") && this.props.extraColumns) {
        const extraColumns = this.props.extraColumns;
        if (!find(cols, {dataIndex: extraColumns.dataIndex})) { // 防止冲突
          if (!extraColumns.render) {
            extraColumns.render = ((v: string) => v);
          }
          cols = cols.concat(extraColumns);
        }
      }
      /*
       if (this.context.selected) {
       let selected = this.context.selected;
       let cols = Object.keys(selected);
       source = filter(source, (n: any) => every(cols,
       (c: string) => (n[c] >= selected[c][0] && n[c] <= selected[c][1])
       ));
       }*/
      // 这步就是成功
      return (
        <ATable
          bordered
          columns={cols}
          dataSource={source}
          emptyText={ () => "" }
          pagination={source.length > 10 ? { pageSize: 10 } : false}
          rowKey={GrTable.getRowKey}
          onChange={this.onChange.bind(this)}
          ref={this.onLoad.bind(this)}
        />
      );
    } catch (e) {
      this.track("report_render_fail");
      return null;
    }

    // TODO: 增加selected处理
  }
  private onLoad(e: any) {
    if (e) {
      this.track("report_render_success");
    }
  }
  private track(trackKey: string) {
    try {
      const vds = window._vds;
      vds.track(trackKey, {
        project_id: window.project.id,
        chart_name: this.props.trackWords.name,
        board_name: this.props.trackWords.board_name,
        report_load_time: Date.now() - this.props.startTime,
        channel_name: this.props.trackWords.channel_name
      });
    } catch (e) { return; }

  }
  private onChange(pagination: any, filters: any, sorter: any) {
    if (!isEqual(this.lastSorter, sorter)) {
      this.props.sortHandler(sorter);
      this.lastSorter = sorter;
    }
  }
}

export default GrTable;
