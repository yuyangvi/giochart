/***
 * 文档
 */
import * as React from "react";
import { find, filter, map, zipObject, fromPairs } from 'lodash';
import G2 = require('g2');
declare function fetch(a: any, b?: any): any;
//数据统计必备字段，中端需要以下字段提供数据
interface Filter {
  op: string;
  key: string;
  value: string;
  name: string;
}
interface Filters {
  exprs: Filter[];
  op: string;
}
//数据统计必备字段，中端需要以下字段提供数据
export interface ChartParamsProps {
  /* 数据统计的规则 'sum' or 'avg' */
  aggregateType:string;
  /* 指标 */
  metrics: Metric[];
  /* 维度 */
  dimensions: Meta[];
  /* 咱不知道是啥,好像没用 */
  period: number;
  /* 筛选条件 */
  filter: Filters[] | Filter;
  /* 周期,如day:8,1 */
  timeRange: string;
  /* 粒度 */
  interval: number;
  //排序 */
  orders?: string | null;
  /* 前xx条 */
  top?: number
//}
//interface ChartParams {//留供前端识别的数据，中端只帮着保存，不参考它取数据
  /* 图表ID */
  id: string;
  name: string;
  /* 图表类型 */
  chartType: string;
  /* 不知道做啥的 */
  status: string;
  /* 包含颜色信息等配置信息杂项 */
  attrs: any;
  /* 创建者信息 */
  createdAt: number;
  creator: string;
  creatorId: string;
  /* 修改者信息 */
  updatedAt: number;
  updater: string;
  updaterId: string;
  //subscribed、subscriptionId	新版没有订阅,应该是没用了
  userTag?: string;
  versionNumber?: number;
  visibleTo?: any;
}
interface Metric {
  id: string;
  level: string;
  action?: string;
}
interface Meta {
  id: string;
  isDim: boolean;
  name: string;
  metricId?: Metric;
  isStatic?: boolean;
}
export interface ChartDataProps {
  data: number[][];
  meta: Meta[];
}
export interface GrChartProps {
  chartParams: ChartParamsProps;
  chartData?: ChartDataProps;
}
export interface SourceConfig {
  [colName: string]: {
    tickCount?: number;
    mask?: string;
    alias?: string;
    type?: string;
    nice?: boolean;
  }
}
export const HttpStatus = {
  Ok                  : 200,
  Created             : 201,
  NoContent           : 204,
  MovedPermanently    : 301,
  SeeOther            : 303,
  NotModified         : 304,
  BadRequest          : 400,
  Unauthorized        : 401,
  Forbidden           : 403,
  NotFound            : 404,
  MethodNotAllowed    : 405,
  NotAcceptable       : 406,
  RequestTimeout      : 408,
  UnsupportedEntity   : 422,
  Locked              : 423,
  TooManyRequests     : 429,
  InternalServerError : 500,
  NotImplemented      : 501
};

class GrChart extends React.Component <GrChartProps, any> {
  refs: {
    chartArea: HTMLElement;
  };
  chart: any;

  constructor(props: any) {
    super(props);
    // 加载状态
    this.state = {
      isLoading: true
    };
  }

  render() {
    return (
      <div>
        <div ref='chartArea' />
      </div>
    );
  }

  /*defaultRetryRequest() {
    let {chartParams} = this.props;
    let result = Promise.reject();
    for (let i = 3; i > 0; i--) {
      result = result.catch(this.defaultRequest.bind(this, chartParams, this.drawChart));
    }
    return result;
  }*/
  defaultRequest(chartParams: ChartParamsProps, callback: Function) {
    return fetch(`/assets/demo.json`/*, {
      credentials: 'same-origin',
      contentType: 'application/json',
      method: 'get',
      //body: JSON.stringify(chartParams)
    }*/)
      .then((response: any) => {
        let status = response.status;
        if(status === HttpStatus.Ok) {
          return response.json();
        }
      }).then( (data: ChartDataProps) => callback(chartParams, data));
  }

  componentDidMount() {
    // this._fetchChartData(this.props);
    let {chartParams, chartData} = this.props;

    if (this.props.hasOwnProperty('chartData')) {
      this.chart && this.chart.destroy();
      this.drawChart(chartParams, chartData);
      return true;
    }
    this.defaultRequest(chartParams, this.drawChart.bind(this));
    //this.defaultRetryRequest().then(data => this.drawChart(chartParams, data));
  }

  shouldComponentUpdate(nextProps: GrChartProps) {
    let {chartParams, chartData} = nextProps;
    if (nextProps.hasOwnProperty('chartData')) {
      this.chart && this.chart.destroy();
      this.drawChart(chartParams, chartData);
      return true;
    }
    return true;
  }
  drawChart(chartParams: ChartParamsProps, chartData: ChartDataProps) {
    let dom = document.createElement('div');
    this.refs.chartArea.appendChild(dom);
    let chart = new G2.Chart({
      container: dom,
      height: dom.getBoundingClientRect().height || 450,
      forceFit: true,
      plotCfg: {}
    });

    let sourceDef: SourceConfig = this.createSourceConfig(chartParams, chartData.meta);
    let colIds = map(chartData.meta, 'id');
    let jsonData = map(chartData.data, n => zipObject(colIds, n));
    let frame = new G2.Frame(jsonData);
    let metrics = filter(chartData.meta, { isDim: false })
    let metricCols = map(metrics, 'id');
    let dimCols    = map(filter(chartData.meta, { isDim: true }), 'id');

    if (chartParams.chartType !== 'bubble' && chartParams.metrics.length > 1) {
      frame = G2.Frame.combinColumns(frame, metricCols, 'val', 'metric', dimCols);
      dimCols.push('metric');
      metricCols = ['val'];
      //设定id=>name
      let metricDict = fromPairs(map(metrics, n => [n.id, n.name]));
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
