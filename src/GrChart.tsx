/***
 * 文档
 */
import {GrChartProps, ChartParamsProps, ChartDataProps, Meta} from './chartProps';
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { find, filter, map, zipObject, fromPairs } from 'lodash';
import G2 = require('g2');

interface SourceConfig {
  [colName: string]: {
    tickCount?: number;
    mask?: string;
    alias?: string;
    type?: string;
    nice?: boolean;
  }
}

class GrChart extends React.Component <GrChartProps, any> {
  chart: any;
  static contextTypes: React.ValidationMap<any> = {
    chartData: React.PropTypes.any,
    selected: React.PropTypes.any,
    selectHandler: React.PropTypes.func
  };

  componentWillReceiveProps(nextProps: GrChartProps, nextContext: any) {
    if (nextContext.chartData) {
      this.chart && this.chart.destroy();
      this.drawChart(nextProps.chartParams, nextContext.chartData);
    }
  }
  render() {
    return <div></div>;
  }

  /*defaultRetryRequest() {
    let {chartParams} = this.props;
    let result = Promise.reject();
    for (let i = 3; i > 0; i--) {
      result = result.catch(this.defaultRequest.bind(this, chartParams, this.drawChart));
    }
    return result;
  }*/

  componentDidMount() {
    let {chartParams, chartData} = this.props;

    if (this.props.hasOwnProperty('chartData')) {
      this.chart && this.chart.destroy();
      this.drawChart(chartParams, chartData);
    }
  }
  drawChart(chartParams: ChartParamsProps, chartData: ChartDataProps) {
    let dom = document.createElement('div');
    ReactDOM.findDOMNode(this).appendChild(dom);
    let chart = new G2.Chart({
      container: dom,
      height: dom.getBoundingClientRect().height || 250,
      forceFit: true,
      plotCfg: {}
    });

    let sourceDef: SourceConfig = this.createSourceConfig(chartParams, chartData.meta);
    let colIds = map(chartData.meta, 'id');
    let jsonData = map(chartData.data, (n: number[]) => zipObject(colIds, n));
    let frame = new G2.Frame(jsonData);
    let metrics = filter(chartData.meta, { isDim: false })
    let metricCols = map(metrics, 'id');
    let dimCols    = map(filter(chartData.meta, { isDim: true }), 'id');

    if (chartParams.chartType !== 'bubble' && chartParams.metrics.length > 1) {
      frame = G2.Frame.combinColumns(frame, metricCols, 'val', 'metric', dimCols);
      dimCols.push('metric');
      metricCols = ['val'];
      //设定id=>name
      let metricDict = fromPairs(map(metrics, (n: Meta) => [n.id, n.name]));
      let mColVals = frame.colArray('metric');
      let mColNames = mColVals.map((n: string) => metricDict[n]);
      frame.colReplace('metric', mColNames);
    }

    chart.source(frame, sourceDef);
    //做分组
    chart.axis('tm', { title: false });
    chart.axis('val', { title: false });

    let geom = this.caculateGeom(chart, chartParams.chartType, chartParams.attrs.subChartType);

    let pos;
    if (chartParams.chartType === 'bubble') {
      pos = metricCols[0] + '*' + metricCols[1];
    } else if (chartParams.chartType === 'funnel') {
      pos = G2.Stat.summary.sum('metric*val');
    } else {
      pos = dimCols[0] + '*' + metricCols[0]
    }
    geom.position(pos);

    if (chartParams.chartType === 'funnel') {
      geom.color('metric', ['#C82B3D', '#EB4456', '#F9815C', '#F8AB60', '#EDCC72'])
          .label('metric', { offset: 10, label: { fontSize: 14 } });
    } else if (dimCols.length > 1) {
      geom.color(dimCols[1]);
    }

    chart.render();
    this.chart = chart;

    chart.setMode('select');
    chart.select('rangeX');
    //设置筛选功能,将选区传给GrLoader，其他组件通过context传导filter,
    if (chartParams.chartType === 'line') {
      chart.on('rangeselectend', this.context.selectHandler);
    }
  }

  createSourceConfig(chartParams: ChartParamsProps, metas: Meta[]): SourceConfig {
    let sourceDef: SourceConfig = {};
    metas.forEach(m => sourceDef[m.id] = { alias: m.name } )
    if (find(metas, { id: 'tm' })) {
      let timeDef = {
        alias: '时间',
        type: 'time',
        mask: 'mm-dd',
        nice: true,
        tickCount: 7
      };

      if (chartParams.timeRange === 'day:8,1') {
        timeDef.tickCount = 7;
      }
      if (chartParams.interval === 86400000) {
        timeDef.mask = 'mm-dd';
      } else if (chartParams.interval === 3600000) {
        timeDef.mask = 'HH:mm';
      }
      if (chartParams.chartType === 'bar' || chartParams.chartType === 'vbar') {
        timeDef.type = 'timeCat';
      }
      sourceDef['tm'] = timeDef;
    }
    return sourceDef;
  }

  caculateGeom(chart:any, gt:string, subType: string) {
    let adjust: string;
    if (subType === 'seperate'){
      adjust = 'dodge';
    } else if (subType === 'total') {
      adjust = 'stack';
    } else if (subType === 'percent') {
      adjust = 'stack';
    }

    if (gt === 'bar') {
      chart.coord('rect').transpose();
      return chart.interval(adjust);
    } else if (gt === 'vbar') {
      return chart.interval(adjust);
    } else if (gt === 'funnel') {
      chart.coord('rect').transpose().scale(1, -1);
      chart.axis(false);
      return chart.intervalSymmetric().shape('funnel');
    } else if (gt === 'bubble') {
      //TODO:重新设计Tooltip;
      return chart.point();
    } else if (gt === 'line') {
      return chart.line().size(2);
    }
    return chart[gt](adjust);
  }
}

export default GrChart;
