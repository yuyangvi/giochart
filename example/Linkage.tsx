import * as React from 'react';
import * as update from 'react/lib/update';
import DataSource from '../src/DataSource';
import { DataRequestProps, DrawParamsProps, Metric } from '../src/ChartProps';
import SyntheticEvent = React.SyntheticEvent;
import DimensionPanel from "../src/DimensionPanel";
import {isEqual, isMatch, filter, map, isEmpty} from 'lodash';
import ContextListener from "../src/ContextListener";

interface EventSeletorTarget extends EventTarget {
    value: string
}
interface SyntheticSeletorEvent extends SyntheticEvent<HTMLSelectElement> {
    target: EventSeletorTarget
}

const originParams: DataRequestProps = {
  "metrics": [{"id": "woV73y92", "level": "simple", "action": "page"}],
  "dimensions": ["tm"],
  "granularities": [],
  "timeRange": "day:8,1"
};
const lineParams: DrawParamsProps = {
    chartType: 'line',
    "granularities": [{"id": "tm", "interval": 86400}],
    columns: [
      {"id": "tm", "name": "时间", isDim: true},
      {"id": "woV73y92", "name": "看板细节页面浏览数量——主要功能", isDim: false}
    ],
};
class Demo extends React.Component<any, any> {
  dataSource: React.Component<any,any>;
  params: DataRequestProps;
  selected: Object[]=[];
  constructor() {
    super();
    this.state = {
      dim: null,
      modeValue: false,
      select: null
    };
  }

  //modeValue true=替换 false=追加
  addDimension(dim: string[], modeValue: boolean) {
    if (!isEqual(this.state.dim, dim)) {
      this.setState({dim, modeValue});
      this.dataSource.setState({selected: null});
    }
  }

  select(metaSelected: any, metaUnselected:any) {
    // 不是自己select这样只有一个 应该是多个 数组 或 object
    if(metaSelected){
      this.selected.push(metaSelected);
    }
    if(metaUnselected){
      this.selected=filter(this.selected, (item)=>{
        return !isMatch(item,metaUnselected);
      });
    }

    this.dataSource.setState({selected:this.selected});
  }

  render() {
    let dim: string[] = this.state.dim;
    let barParams = null;

    //modeValue true=替换 false=追加
    if (dim) {
      if(this.state.modeValue){
        this.params = update(originParams, {dimensions: {$push: dim}});
      }else{
        if(this.params === null){
          this.params = originParams;
        }
        this.params = update(this.params, {dimensions: {$push: dim}});
      }
      // 计算barParams
      const dimCols: Metric[] = map(dim, (n: string) =>({ id: n,isDim: true}));
      const cols = filter(lineParams.columns, { isDim: false }).concat(dimCols);
      barParams = update(lineParams, {
        chartType: {$set: 'bar'},
        columns: {$set: cols}
      });
    } else {
      this.params = originParams;
    }

    return (
      <div className='container'>
        <div className='mainPanel'>
          <DataSource params={this.params} ref={ (DataSource) => { this.dataSource = DataSource; }}>
            <ContextListener chartParams={lineParams} />
            { barParams ? <ContextListener chartParams={barParams} select={this.select.bind(this)} /> : null }
            <DimensionPanel addDimension={this.addDimension.bind(this)} />
          </DataSource>
        </div>
      </div>
    );
  }
}
export default Demo;
