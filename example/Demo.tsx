import * as React from "react";
import update from 'react/lib/update';
import GrChart, { ChartParamsProps, ChartDataProps } from '../src/GrChart';

import SyntheticEvent = React.SyntheticEvent;

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
  dimensions: [],
  filter: {op: '=', key: 'rt', value: '搜索引擎', name: '一级访问来源'},
  id: 'JoOWV0Ao',
  interval: 86400000,
  metrics: [
    {id: '9yGbpp8x', level: 'complex'},
    {id: 'j9yKL8Py', level: 'simple', action: 'imp'}
  ],
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
          <GrChart chartParams={this.state.chartParams} />
        </div>
      </div>
    );
  }
}
export default Demo;
