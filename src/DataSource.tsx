/***
 * 文档
 */
import { flatten, isEqual, map, zipObject } from "lodash";
import * as React from "react";
import {DataLoaderProps, DataRequestProps, ResponseParams} from "./ChartProps";
// declare function fetch(a: any, b?: any): any;
declare const project: any;
// 数据统计必备字段，中端需要以下字段提供数据
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

class DataSource extends React.Component <DataLoaderProps, any> {
  private static childContextTypes: React.ValidationMap<any> = {
    columns: React.PropTypes.array,
    selectHandler: React.PropTypes.func,
    selected: React.PropTypes.any,
    source: React.PropTypes.any
  };

  private constructor(props: DataLoaderProps) {
    super(props);
    // 加载状态
    this.state = {
      columns: null,
      isLoaded: false,
      selected: null,
      source: null
    };
  }
  /*
  selectHandler(evt: any) {
   this.setState({
   selected: evt.selected
   });
  }
  */
  public render() {
    // TODO div高度
    const children = this.props.children;
    return <div>{children}</div>;
    // return React.Children.count(children) < 2 ? React.Children.only(children) : <div>{children}</div>
  }
  // TODO: 用来给子孙节点中的GrChart自定义 Demo props state改变触发 DataSource取数据返回触发
  private getChildContext() {
    return {
      columns: this.state.columns,
      selected: this.state.selected,
      source: this.state.source
      /*,
       selectHandler: this.selectHandler.bind(this)
       */
    };
  }
  private componentWillReceiveProps(nextProps: DataLoaderProps) {
    // TODO status改变也会触发，所以多了一层判断
    if (this.props.params !== nextProps.params) {
      this.defaultRequest(nextProps.params, this.afterFetch.bind(this));
    }
  }

  // 动态变化Dimension
  /* defaultRetryRequest() {
   let {chartParams} = this.props;
   let result = Promise.reject();
   for (let i = 3; i > 0; i--) {
   result = result.catch(this.defaultRequest.bind(this, chartParams, this.drawChart));
   }
   return result;
  } */

  private defaultRequest(chartParams: DataRequestProps, callback: any) {
    let fetchObj;
    // Todo 检查是否是DEV环境
    if (this.props.hasOwnProperty("sourceUrl")) {
      fetchObj = fetch(this.props.sourceUrl);
    } else {
      fetchObj = fetch(`/v4/projects/${project.id}/chartdata`, {
        credentials: "same-origin",
        contentType: "application/json",
        method: "post",
        body: JSON.stringify(chartParams)
      });
    }
    fetchObj.then((response: any) => {
      const status = response.status;
      if (status === HttpStatus.Ok) {
        return response.json();
      }
    }).then((data: ResponseParams) => callback(data));
  }

  private componentDidMount() {
    const { params } = this.props;
    this.defaultRequest(params, this.afterFetch.bind(this));
  }

  private afterFetch(chartData: ResponseParams) {
    const columns = chartData.meta.columns;
    const colIds = map(chartData.meta.columns, "id");
    const source = map(chartData.data, (n: number[]) => zipObject(colIds, n));
    this.setState({
      isLoaded: true,
      columns,
      source
    });
    if (this.props.onLoad) {
      this.props.onLoad(this.state);
    }
  }
}

export default DataSource;
