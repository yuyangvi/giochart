/***
 * 文档
 */
import {GrChartProps, ChartParamsProps, ChartDataProps} from './chartProps';
import * as React from "react";
declare function fetch(a: any, b?: any): any;
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

class GrLoader extends React.Component <GrChartProps, any> {
  static childContextTypes: React.ValidationMap<any> = {
    chartData: React.PropTypes.any
  };

  refs: {
    chartArea: HTMLElement;
  };
  chart: any;

  constructor(props: any) {
    super(props);
    // 加载状态
    this.state = {
      isLoaded: false,
      chartData: null,
    };
  }
  //TODO: 用来给子孙节点中的GrChart自定义
  getChildContext() {
    return { chartData: this.state.chartData };
  }

  render() {
    return (
      <div ref='container'>
        {this.props.children}
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
    //TODO:
    let url = chartParams.chartType === 'comparison' ? '/assets/aggragte.json' : '/assets/demo.json';
    return fetch(url/*, {
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
      }).then( (data: ChartDataProps) => callback(data));
  }

  componentDidMount() {
    // this._fetchChartData(this.props);
    let { chartParams } = this.props;

    this.defaultRequest(chartParams, (chartData: ChartDataProps) => {
      this.setState({ isLoaded: true, chartData });
    });
    //this.defaultRetryRequest().then(data => this.drawChart(chartParams, data));
  }
}
GrLoader.childContextTypes = {
  chartData: React.PropTypes.any
};

export default GrLoader;
