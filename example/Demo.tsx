import * as React from 'react';
import * as update from 'react/lib/update';
import DataSource from '../src/DataSource';
import { ChartParamsProps, Meta } from '../src/chartProps';
import SyntheticEvent = React.SyntheticEvent;
import GrChart from '../src/GrChart';
import DimensionPanel from "../src/DimensionPanel";
interface EventSeletorTarget extends EventTarget {
  value:string
}
interface SyntheticSeletorEvent extends SyntheticEvent<HTMLSelectElement> {
  target: EventSeletorTarget
}

const originParams: ChartParamsProps = {
  metrics:[{ id:'4PYKzgx9', level:'simple', action:'imp' }],
  id:'rREppgm9',
  name:'GIO 3.0 logo 浏览量',
  chartType:'table',
  top:100,
  metricsNames:['GrowingIO_221796_浏览量'],
  dimensions:['tm'],
  dimensionsNames:['时间'],
  filter:{op: "=", key: "countryCode", value: "CN", name: "国家代码"},
  interval:86400000,
  aggregateType:'sum',
  attrs:{
    'metricType':'none',
    'period':7,
    'timeRange':'day:8,1',
    'metrics':{
      'z98xev09':{metricName:'GrowingIO_221796_浏览量'}}
  },
  'createdAt':1482896072289,
  'updatedAt':1482896072289,
  'creator':'张溪梦',
  'updater':'张溪梦',
  'versionNumber':1,
  'period':7,
  'timeRange':'day:8,1',
  'orders':null,
  'creatorId':'GQPDxPNm',
  'updaterId':'GQPDxPNm',
  'status':'activated',
  'visibleTo':{type:'Public'},
  'userTag':null
};
const lineParams = update(originParams, { chartType: { $set: 'line' } });
class Demo extends React.Component<any, any> {
  dataSource:React.Component<any,any>;
  constructor() {
    super();
    this.state = {
      dim: null,
      select: null
    };
  }
  addDimension(dim: string[]) {
    this.setState({ dim });
    this.dataSource.setState({ selected: null });
  }
  select(selected: any) {
    this.dataSource.setState({ selected });
  }
  render() {
    let dim = this.state.dim
    let chartParams = originParams;
    let barParams = null;
    if (dim) {
      chartParams = update(originParams, { dimensions: { $push: dim } });
      barParams = update(chartParams, {
        dimensions: { $set: dim },
        chartType: { $set: (dim[0] === 'region' ? 'map' : 'bar') }
      });
    }
    //ref='dataSource1'
    return (
      <div className='container'>
        <div className='mainPanel'>
          <DataSource chartParams={chartParams} ref={(DataSource)=>{this.dataSource=DataSource;}}>
            <GrChart chartParams={lineParams} />
            { barParams ? <GrChart chartParams={barParams} select={this.select.bind(this)} /> : null }
            <DimensionPanel addDimension={this.addDimension.bind(this)} />
          </DataSource>
        </div>
      </div>
    );
  }
}
export default Demo;
