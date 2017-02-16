/***
 * 文档
 */
import {GrChartProps, ChartParamsProps, ChartDataProps, Meta, Source} from './chartProps';
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { map, fromPairs, zip, pick, filter, isEmpty } from 'lodash';
import G2 = require('g2');


declare var require: {
  <T>(path: string): T;
  (paths: string[], callback: (...modules: any[]) => void): void;
  ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

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
    source: React.PropTypes.any,
    selected: React.PropTypes.any
    /*selectHandler: React.PropTypes.func*/
  };

  componentWillReceiveProps(nextProps: GrChartProps, nextContext: any) {
    if (nextContext.source) {
      let source = nextContext.source;
      if (nextContext.selected) {
        //算维度的差集
        let selected = pick(nextContext.selected, nextProps.chartParams.dimensions);
        if (!isEmpty(selected) && this.chart) {
          return;
        }
        source = filter(source, nextContext.selected);
      }
      // TODO: 如果只是context修改
      console.log(nextProps.chartParams.chartType);
      this.chart && this.chart.destroy();
      this.drawChart(nextProps.chartParams, source);

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
    let {chartParams, source} = this.props;

    if (this.props.hasOwnProperty('source')) {
      this.chart && this.chart.destroy();
      this.drawChart(chartParams, source);
    }
  }
  componentWillUnmount() {
    this.chart && this.chart.destroy();
  }

  drawChart(chartParams: ChartParamsProps, source: Source) {
    let dom = document.createElement('div');
    ReactDOM.findDOMNode(this).appendChild(dom);
    let chart = new G2.Chart({
      container: dom,
      height: dom.getBoundingClientRect().height || 350,
      forceFit: true,
      plotCfg: {}
    });


    let frame = new G2.Frame(source);
    let sourceDef: SourceConfig = this.createSourceConfig(chartParams);

    let metricCols = map(chartParams.metrics, 'id');
    let dimCols    = chartParams.dimensions;

    if (chartParams.chartType !== 'bubble' && chartParams.metrics.length > 1) {
      frame = G2.Frame.combinColumns(frame, metricCols, 'val', 'metric', dimCols);
      dimCols.push('metric');
      //设定id=>name
      let metricDict = fromPairs(zip(metricCols, chartParams.metricsNames));

      let mColVals = frame.colArray('metric');
      let mColNames = mColVals.map((n: string) => metricDict[n]);
      metricCols = ['val'];
      frame.colReplace('metric', mColNames);
    }

    //sourceDef['metric'] = {alias:'指标', type: 'cat'};
    chart.source(frame, sourceDef);
    //做分组
    chart.axis('tm', { title: false });
    chart.axis('val', { title: false });
    let geom = this.caculateGeom(chart, chartParams.chartType, chartParams.attrs.subChartType);

    let pos;
    let selectCols:string[];
    if (chartParams.chartType === 'bubble') {
      pos = metricCols[0] + '*' + metricCols[1];
      selectCols = metricCols as string[];
    } else if (chartParams.chartType === 'funnel') {
      pos = G2.Stat.summary.sum('metric*val');
      selectCols = ['metric'];
    } else if (chartParams.chartType === 'map') {
      // TODO:列出
      const mapData = require('china-geojson/src/geojson/china.json');
      pos = G2.Stat.map.region(dimCols[0], mapData);
    } else {
      pos = G2.Stat.summary.sum(dimCols[0] + '*' + metricCols[0]);
      selectCols = [dimCols[0]];
    }
    geom.position(pos);

    if (chartParams.chartType === 'funnel') {
      geom.color('metric', ['#C82B3D', '#EB4456', '#F9815C', '#F8AB60', '#EDCC72'])
          .label('metric', { offset: 10, label: { fontSize: 14 } });
    } else if (chartParams.chartType === 'map') {
      geom.color(metricCols[0], '#F4EC91-#AF303C').style({
        stroke: '#333',
        lineWidth: 1
      });
    } else if (dimCols.length > 1) { //TODO: metrics
      geom.color('metric');
    }
    if (this.props.hasOwnProperty('select')) {
      geom.selected(true, {
        selectedMode: 'single',
        style: { fill: '#fe9929' }
      });
      if (dimCols[0] !== 'tm') {
        // plotclick=图表坐标系内的事件  itemselected=图形元素上的事件
        chart.on('itemselected', (evt: any) => { this.selectHandler(evt, selectCols) });
      }
    }

    chart.render();
    this.chart = chart;
/*
    chart.setMode('select');
    chart.select('rangeX');
    //设置筛选功能,将选区传给GrLoader，其他组件通过context传导filter,
    if (chartParams.chartType === 'line') {
      chart.on('rangeselectend', this.context.selectHandler);
    }
*/
  }
  selectHandler(ev: any, selectCols: string[]) {
    let shape = ev.shape;
    if (shape && shape.get('selected')) {
      let item = shape.get('origin');
      //过滤
      this.props.select(pick(item._origin, selectCols));
    } else {
      if(shape){
        let item = shape.get('origin');
        console.log(item);
      }
    }
  }

  createSourceConfig(chartParams: ChartParamsProps): SourceConfig {
    let sourceDef: SourceConfig = {};
    //射击
    chartParams.metrics.forEach(
      (m, i:number) => {
        sourceDef[m.id] = { alias: chartParams.metricsNames[i] }
      }
    );
    chartParams.dimensions.forEach(
      (m, i:number) => {
        sourceDef[m] = { alias: chartParams.dimensionsNames[i], type: 'cat' }
      }
    );

    if (chartParams.dimensions.includes('tm')) {
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
      //chart.coord('rect').transpose();
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
    } else if (gt === 'map') {
      return chart.polygon();
    }
    return chart[gt](adjust);
  }
}

export default GrChart;
