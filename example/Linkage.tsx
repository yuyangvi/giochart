import * as React from 'react';
import * as update from 'react/lib/update';
import DataSource from '../src/DataSource';
import { DataRequestProps, DrawParamsProps, Metric } from '../src/ChartProps';
import SyntheticEvent = React.SyntheticEvent;
import DimensionPanel from "../src/DimensionPanel";
import {isEqual, isMatch, filter, map, isEmpty} from 'lodash';
import ContextListener from "../src/ContextListener";

interface EventSeletorTarget extends EventTarget {
    value: string;
}
interface SyntheticSeletorEvent extends SyntheticEvent<HTMLSelectElement> {
    target: EventSeletorTarget;
}

const originParams: DataRequestProps = {
  "filter":{"op":"=","key":"b","value":"Web","name":"网站/手机应用"},
  "granularities":[{"id":"tm","interval":3600000}],
  "metrics":[{"id":"9yGbpp8x"}],
  "dimensions": ["tm"],
  "timeRange": "day:1,0"
};
const lineParams: DrawParamsProps = {
    chartType: 'line',
    "granularities": [{"id": "tm", "interval": 86400}],
    columns: [
      {"id": "tm", "name": "时间", isDim: true},
      {"id": "9yGbpp8x", "name": "访问用户量", isDim: false}
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

  select(metaSelected: any, metaUnselected: any) {
    // 不是自己select这样只有一个 应该是多个 数组 或 object
    if(metaSelected) {
      this.selected.push(metaSelected);
    } else if(metaUnselected) {
      this.selected=filter(this.selected, (item)=>{
        return !isMatch(item,metaUnselected);
      });
    }
    console.log(this.selected);
    this.dataSource.setState({selected:this.selected});
  }

  render() {
    let dim: string[] = this.state.dim;
    let barParams = null;

    // modeValue true=替换 false=追加
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
        chartType: {$set: 'vbar'},
        columns: {$set: cols}
      });
    } else {
      this.params = originParams;
    }

    return (
      <div className="container">
        <div className="mainPanel">
          <DataSource params={this.params} ref={ (DataSource) => { this.dataSource = DataSource; }} sourceUrl="auto">
            <div>
              <ContextListener chartParams={lineParams} />
              <DimensionPanel addDimension={this.addDimension.bind(this)} />
              {barParams ? <ContextListener chartParams={barParams} select={this.select.bind(this)} /> : null}
            </div>
          </DataSource>
        </div>
      </div>
    );
  }
}
export default Demo;
