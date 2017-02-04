/***
 * 文档
 */
import {GrChartProps, ChartParamsProps, ChartDataProps, Meta} from './chartProps';
import * as React from "react";
import * as ReactDOM from 'react-dom';
import { find, filter, map, zipObject, maxBy } from 'lodash';
import G2 = require('g2');
G2.track(false);
interface SourceConfig {
  [colName: string]: {
    tickCount?: number;
    mask?: string;
    alias?: string;
    type?: string;
    nice?: boolean;
    min?: number;
    max?: number;
  }
}

class Aggregate extends React.Component <GrChartProps, any> {
  chart: any;
  static contextTypes: React.ValidationMap<any> = {
    chartData: React.PropTypes.any
  };

  componentWillReceiveProps(nextProps: GrChartProps, nextContext: any) {
    if (nextContext.chartData) {
      this.chart && this.chart.destroy();
      this.drawComparison(nextProps.chartParams, nextContext.chartData);
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
      this.drawComparison(chartParams, chartData);
    }
  }

  drawNumber(chartParams: ChartParamsProps, chartData: ChartDataProps) {
    let dom = document.createElement('div');
    ReactDOM.findDOMNode(this).appendChild(dom);

    const Frame = G2.Frame;
      let jsonData = map(chartData.data, n => zipObject(['tm', 'val'], n));
      let frame = new G2.Frame(jsonData);
      let rect = dom.getBoundingClientRect();

      let chart = new G2.Chart({
        container: dom,
        width: rect.width,
        height: 54,
        plotCfg: {
          margin: [1, 0, 1, 0],
        }
      });
      chart.source(frame, {
        tm: { type: 'time' }
      });
      chart.axis(false);
      chart.tooltip(false);
      chartParams.attrs.colorTheme = chartParams.attrs && chartParams.attrs.colorTheme || '125, 128, 243';
      chart.area().color(`l(90) 0:rgba(${chartParams.attrs.colorTheme}, 0.3) 1:rgba(${chartParams.attrs.colorTheme}, 0.1)`).shape('smooth').position('tm*val');
      chart.line().shape('smooth').color(`rgb(${chartParams.attrs.colorTheme})`).position('tm*val').size(2);

      chart.render();
      this.chart = chart;
      return chart;
  }


  drawComparison(chartParams: ChartParamsProps, chartData: ChartDataProps) {
    let dom = document.createElement('div');
    ReactDOM.findDOMNode(this).appendChild(dom);
    let chart = new G2.Chart({
      container: dom,
      height: dom.getBoundingClientRect().height || 250,
      forceFit: true,
      plotCfg: {margin:[40, 10, 40, 60]}
    });

    let sourceDef: SourceConfig = this.createSourceConfig(chartParams, chartData.meta);
    let colIds = ['tm', 'val', 'tm_', 'val_'];

    let jsonData = map(chartData.data, (n: number[]) => zipObject(colIds, n));
    let frame = new G2.Frame(jsonData);

    sourceDef['val'] = sourceDef['val_'] = {
      min: 0,
      max: Math.max(G2.Frame.max(frame, 'val'), G2.Frame.max(frame, 'val_'))
    };
    chart.source(frame, sourceDef);
    //做分组
    chart.axis('tm', { title: false });
    chart.axis('val',{ title: false });
    chart.axis('val_', false);
    //TODO: scale
    //第一条线
    chart.area().position('tm*val').color(`rgba(${chartParams.attrs.colorTheme}, .5)`);
    chart.line().position('tm*val').color(`rgb(${chartParams.attrs.colorTheme})`);
    chart.line().position('tm*val_').color('gray');
    chart.legend(false);
    //chart drawGuild
    let bCanvas = chart.get('backCanvas');
    bCanvas.addShape('text', {
      attrs: {
        x: 586,
        y: 0,
        text: chartData.desc.data[0],
        fontSize: 24,
        textAlign: 'right',
        textBaseline: 'top',
        fill: '#666'
      }
    });
    let ratio = 100 * (chartData.desc.data[0] / chartData.desc.data[1] - 1);
    bCanvas.addShape('text', {
      attrs: {
        x: 656,
        y: 0,
        text: ratio.toPrecision(3)+'%',
        fontSize: 14,
        textAlign: 'right',
        textBaseline: 'top',
        fill: '#28c29b'
      }
    });
    bCanvas.addShape('text', {
      attrs: {
        x: 656,
        y: 20,
        text: '相比7天前',
        fontSize: 12,
        textAlign: 'right',
        textBaseline: 'top',
        fill: '#666'
      }
    });

    bCanvas.draw();
    chart.render();

    this.chart = chart;
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
}
Aggregate.contextTypes = {
  chartData: React.PropTypes.any
};

export default Aggregate;
