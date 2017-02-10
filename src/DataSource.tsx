/***
 * 文档
 */
import {GrChartProps, ChartParamsProps, ChartDataProps} from './chartProps';
import * as React from "react";
import update from 'react/lib/update';

import { map, zipObject } from 'lodash';
declare function fetch(a: any, b?: any): any;
declare var project: any;

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
    let url = this.props.sourceUrl || `https://gta.growingio.com/_private/v3/projects/${project.id}/chartdata`;
    return fetch(url)
      /*, {
        credentials: 'same-origin',
        contentType: 'application/json',
        method: 'get',
        //body: JSON.stringify(chartParams)
      }
    )*/
      .then((response: any) => {
        let status = response.status;
        if(status === HttpStatus.Ok) {
          return response.json();
        }
      }).then( (data: ChartDataProps) => callback(data));
  }

  componentDidMount() {
    let { chartParams } = this.props;

    this.defaultRequest(chartParams, this.afterFetch.bind(this));
  }
  afterFetch(chartData: ChartDataProps) {
    let colIds = map(chartData.meta, n => (n.isDim ? n.id : n.metricId.id));
    let source = map(chartData.data, (n: number[]) => zipObject(colIds, n));

    this.setState({
      isLoaded: true,
      source
    });
  }
}

export default DataSource;
