/***
 * 文档
 */
import {GrChartProps, ChartParamsProps, ChartDataProps} from './chartProps';
import * as React from "react";
import update from 'react/lib/update';

import { map, zipObject, flatten } from 'lodash';
declare function fetch(a: any, b?: any): any;
declare const project: any;
//数据统计必备字段，中端需要以下字段提供数据
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

class DataSource extends React.Component <GrChartProps, any> {
  static childContextTypes: React.ValidationMap<any> = {
    source: React.PropTypes.any,
    selected: React.PropTypes.any,
    selectHandler: React.PropTypes.func
  };

  constructor(props: ChartParamsProps) {
    super(props);
    // 加载状态
    this.state = {
      isLoaded: false,
      source: null,
      selected: null,
    };
  }
  selectHandler(evt: any) {
    this.setState({
      selected: evt.selected
    });
  }
  //TODO: 用来给子孙节点中的GrChart自定义
  getChildContext() {
    return {
      source: this.state.source,
      selected: this.state.selected,
      selectHandler: this.selectHandler.bind(this)
    };
  }
  componentWillReceiveProps(nextProps: GrChartProps) {
    console.log(nextProps.chartParams);
    this.defaultRequest(nextProps.chartParams, this.afterFetch.bind(this));
  }

  render() {
    return <div>{this.props.children}</div>;
  }
  //动态变化Dimension
  /*defaultRetryRequest() {
    let {chartParams} = this.props;
    let result = Promise.reject();
    for (let i = 3; i > 0; i--) {
      result = result.catch(this.defaultRequest.bind(this, chartParams, this.drawChart));
    }
    return result;
  }*/

  defaultRequest(chartParams: ChartParamsProps, callback: Function) {
    let url = this.props.sourceUrl || `https://gta.growingio.com/v3/projects/${project.id}/chartdata`;
    let headers = new Headers();
    headers.append('authorization', 'Token 6cfe9f205f82524839616a7428748b085b51710639dd85b692bab403c6b3f3d7');
    let request = new Request(url, {headers: headers});
    return fetch(request, {
        credentials: 'same-origin',
        contentType: 'application/json',
        method: 'post',
        body: JSON.stringify(chartParams)
      })
        .then((response: any) => {
          let status = response.status;
          if(status === HttpStatus.Ok) {
            return response.json();
          }
        })
      .then( (data: ChartDataProps) => callback(data));
  }

  componentDidMount() {
    let { chartParams } = this.props;

    this.defaultRequest(chartParams, this.afterFetch.bind(this));
  }
  afterFetch(chartData: ChartDataProps) {
    let colIds: string[] = flatten(map(chartData.metaData, n => {
      if (n.isDim) {
        return n.id;
      }
      let id = n.metricId.id;
      return [id, '_' + id];
    }));

    let source = map(chartData.data, (n: number[]) => {
      let res = zipObject(colIds, n);
      if (res.tm) {
        res.tm = parseInt(res.tm);
      }
      return res;
    });

    this.setState({
      isLoaded: true,
      source
    });
  }
}

export default DataSource;
