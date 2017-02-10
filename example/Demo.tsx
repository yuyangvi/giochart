import * as React from 'react';
import update from 'react/lib/update';
import GrLoader from '../src/GrLoader';
import { ChartParamsProps } from '../src/chartProps';
import SyntheticEvent = React.SyntheticEvent;
import GrChart from '../src/GrChart';
import GrTable from '../src/GrTable';
import Aggregate from "../src/Aggregate";
interface EventSeletorTarget extends EventTarget {
  value:string
}
interface SyntheticSeletorEvent extends SyntheticEvent<HTMLSelectElement> {
  target: EventSeletorTarget
}
const lineParams: ChartParamsProps = {
  aggregateType: 'sum',
  attrs: { metricType: 'none', period: 7, timeRange: 'day:8,1', subChartType: 'total' },
  chartType: 'line',
  createdAt: 1483535473005,
  creator: 'liuhuaqing',
  creatorId: 'GQPDMloN',
  dimensions: [{id: 'tm', name: '时间'}],
  dimensionsNames:['时间'],
  filter: {op: '=', key: 'rt', value: '搜索引擎', name: '一级访问来源'},
  id: 'JoOWV0Ao',
  interval: 86400000,
  metrics: [
    {id: '9yGbpp8x', level: 'complex'},
    {id: 'j9yKL8Py', level: 'simple', action: 'imp'}
  ],
  metricsNames:['访问用户量', '保存创建分群浏览量'],
  name: 'sssssssfff',
  orders: null,
  period: 7,
  status: 'activated',
  timeRange: 'day:8,1',
  top: 10,
  updatedAt: 1483535473005,
  updater: 'liuhuaqing',
  updaterId: 'GQPDMloN',
  versionNumber: 1
};
const aggParams: ChartParamsProps = {
  "metrics":[{"id":"PWq7nnvv","level":"complex"}],
  "metricsNames":['新访问周期比'],
  "id":"4PYqqxjP","name":"MKT | 新访问周期比",
  "chartType":"comparison",
  "top":10,
  "dimensions":[],
  "dimensionsNames":[],
  "filter":{},
  "interval":86400000,
  "aggregateType":"sum",
  "attrs":{"metricType":"none","colorTheme":"252, 95, 58","period":7,"timeRange":"day:8,1","metrics":{"PWq7nnvv":{"metricName":"新访问用户量"}}},
  "createdAt":1482908162272,
  "updatedAt":1482908162272,
  "creator":"Alex",
  "updater":"Alex",
  "versionNumber":1,
  "period":7,
  "timeRange":"day:8,1",
  "orders":null,
  "creatorId":"EoZk8M9k",
  "updaterId":"EoZk8M9k",
  "status":"activated",
  "visibleTo":{"type":"Private","ids":["EoZk8M9k"],"userIds":["EoZk8M9k"]}
};
class Demo extends React.Component<any, any> {
  constructor() {
    super();
    this.state = {
      chartParams: lineParams
    };
  }
  setParams(chartType: string) {
    let params = this.state.chartParams;
    this.setState({
      chartParams: update(params, { chartType: { $set: chartType } })
    })
  }
  setSubParams(subChartType: string) {
    let params = this.state.chartParams;

    let chartParams = update(params, { attrs: { subChartType: { $set: subChartType } } })
    this.setState({ chartParams });
  }
  render() {
    return (
      <div className='container'>
        <div className='sidebar'>
          <p>
          <label>图表类型</label>
          <select onChange={ (e: SyntheticSeletorEvent) => {
            let selectElement = e.target;
            let chartType: string = selectElement.value;
            this.setParams(chartType);
            }
          }>
            <option value='line'>线图</option>
            <option value='area'>面积图</option>
            <option value='vbar'>柱形图</option>
            <option value='bubble'>散点图</option>
            <option value='bar'>横向柱</option>
            <option value='funnel'>漏斗图</option>
          </select>
          </p>
          <p>
            <label>堆积方式</label>
            <select onChange={ (e: SyntheticSeletorEvent) => {
              let selectElement =  e.target;
              let subChartType: string = selectElement.value;
              this.setSubParams(subChartType);
              }
            }>
              <option value='total'>堆积</option>
              <option value='seperate'>分组</option>
              <option value='percent'>百分比</option>
            </select>
          </p>
        </div>
        <div className='mainPanel'>
          <GrLoader chartParams={this.state.chartParams}>
            <GrChart chartParams={this.state.chartParams} />
            <GrTable chartParams={this.state.chartParams} />
          </GrLoader>
          <GrLoader chartParams={aggParams}>
            <Aggregate chartParams={aggParams} />
          </GrLoader>
        </div>
      </div>
    );
  }
}
export default Demo;
