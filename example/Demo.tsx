import * as React from 'react';
import * as update from 'react/lib/update';
import DataSource from '../src/DataSource';
import {ChartParamsProps, Meta} from '../src/chartProps';
import SyntheticEvent = React.SyntheticEvent;
import GrChart from '../src/GrChart';
import DimensionPanel from "../src/DimensionPanel";
import {isEqual,isMatch,filter,isEmpty} from 'lodash';

interface EventSeletorTarget extends EventTarget {
    value: string
}
interface SyntheticSeletorEvent extends SyntheticEvent<HTMLSelectElement> {
    target: EventSeletorTarget
}

const originParams: ChartParamsProps = {
    metrics: [{id: '4PYKzgx9', level: 'simple', action: 'imp'}],
    id: 'rREppgm9',
    name: 'GIO 3.0 logo 浏览量',
    chartType: 'table',
    top: 100,
    metricsNames: ['GrowingIO_221796_浏览量'],
    dimensions: ['tm'],
    dimensionsNames: ['时间'],
    filter: {op: "=", key: "countryCode", value: "CN", name: "国家代码"},
    interval: 86400000,
    aggregateType: 'sum',
    attrs: {
        'metricType': 'none',
        'period': 7,
        'timeRange': 'day:8,1',
        'metrics': {
            'z98xev09': {metricName: 'GrowingIO_221796_浏览量'}
        }
    },
    'createdAt': 1482896072289,
    'updatedAt': 1482896072289,
    'creator': '张溪梦',
    'updater': '张溪梦',
    'versionNumber': 1,
    'period': 7,
    'timeRange': 'day:8,1',
    'orders': null,
    'creatorId': 'GQPDxPNm',
    'updaterId': 'GQPDxPNm',
    'status': 'activated',
    'visibleTo': {type: 'Public'},
    'userTag': null
};
const lineParams = update(originParams, {chartType: {$set: 'line'}});
class Demo extends React.Component<any, any> {
    dataSource: React.Component<any,any>;
    chartParams: ChartParamsProps;
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
        let dim = this.state.dim;
        let barParams = null;

        //modeValue true=替换 false=追加
        if (dim) {
            if(this.state.modeValue){
                this.chartParams = update(originParams, {dimensions: {$push: dim}});
            }else{
                if(this.chartParams==null){
                    this.chartParams = originParams;
                }
                this.chartParams = update(this.chartParams, {dimensions: {$push: dim}});
            }
            barParams = update(this.chartParams, {
                dimensions: {$set: dim},
                chartType: {$set: (dim[0] === 'region' ? 'map' : 'bar')}
            });
        } else {
            this.chartParams = originParams;
        }

        return (
            <div className='container'>
                <div className='mainPanel'>
                    <DataSource chartParams={this.chartParams} ref={ (DataSource) => { this.dataSource = DataSource; }}>
                        <GrChart chartParams={lineParams}/>
                        { barParams ? <GrChart chartParams={barParams} select={this.select.bind(this)}/> : null }
                        <DimensionPanel addDimension={this.addDimension.bind(this)}/>
                    </DataSource>
                </div>
            </div>
        );
    }
}
export default Demo;
