import * as React from 'react';
import * as update from 'react/lib/update';
import DataSource from '../src/DataSource';
import { ChartParamsProps, Meta } from '../src/chartProps';
import SyntheticEvent = React.SyntheticEvent;
import GrChart from '../src/GrChart2';
import DimensionPanel from "../src/DimensionPanel";
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
class Demo extends React.Component<any, any> {
  constructor() {
    super();
    this.state = {
      chartParams: lineParams
    };
  }
  addDimension(dim: Meta) {
    let chartParams = update(
      lineParams,
      { dimensions: { $push: dim } }
    );
    this.setState({ chartParams });
  }
  render() {
    return (
      <div className='container'>
        <div className='mainPanel'>
          <DataSource chartParams={this.state.chartParams}>
            <GrChart chartParams={lineParams} />
            <GrChart chartParams={lineParams} />
            <DimensionPanel addDimension={this.addDimension.bind(this)} />
          </DataSource>
        </div>
      </div>
    );
  }
}
export default Demo;
