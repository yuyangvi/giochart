/***
 * 文档
 */
import { assign, flatten, isEqual, map, zipObject, zipWith } from "lodash";
import * as React from "react";
import * as DataCache from "./DataCache";
import {DataLoaderProps, DataRequestProps, Metric, ResponseParams} from "./ChartProps";
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
type NumberArray = Array<number|null>;
class DataSource extends React.Component <DataLoaderProps, any> {
  private static childContextTypes: React.ValidationMap<any> = {
    aggregates: React.PropTypes.array,
    columns: React.PropTypes.array,
    selectHandler: React.PropTypes.func,
    selected: React.PropTypes.any,
    source: React.PropTypes.any
  };
  private tryTimes = 0;
  private constructor(props: DataLoaderProps) {
    super(props);
    // 加载状态
    this.state = {
      aggregates: null,
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
  private componentWillUnmount() {
    // TODO: 取消未完成的请求
    console.log("正在取消未完成的请求");

  }
  public render() {
    return React.Children.only(this.props.children);
  }
  // TODO: 用来给子孙节点中的GrChart自定义 Demo props state改变触发 DataSource取数据返回触发
  private getChildContext() {
    return {
      aggregates: this.state.aggregates,
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
    if (JSON.stringify(this.props.params) !== JSON.stringify(nextProps.params)) {
      if (nextProps.hasOwnProperty("cacheOptions")) {
        const chartDataInCache = DataCache.getChartData(nextProps.params, nextProps.hashKeys);
        if (chartDataInCache) {
          this.setState(chartDataInCache);
          return;
        }
      }
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
      if (this.props.sourceUrl === "auto") { // TODO: 临时在线上用的，上线前务必删掉。
        const headers = new Headers();
        headers.append("authorization", "Token 836bd4152bbb69b979a7b2c3299d1af75a99faa883f69e07182165c61ae52c39");
        const request = new Request(`http://gat.growingio.dev:18443/v4/projects/${project.id}/chartdata`, { headers: headers });
        fetchObj = fetch(request, {
          body: JSON.stringify(chartParams),
          credentials: "same-origin",
          /* contentType: "application/json", */
          method: "post"
        });
      } else {
        fetchObj = fetch(this.props.sourceUrl);
      }
    } else {
      fetchObj = fetch(`/v4/projects/${project.id}/chartdata`, {
        body: JSON.stringify(chartParams),
        credentials: "same-origin",
        /*contentType: "application/json",*/
        method: "post",
      });
    }
    fetchObj.then((response: any) => {
      const status = response.status;
      if (status === HttpStatus.Ok) {
        this.tryTimes = 0;
        return response.json();
      } else if (status === HttpStatus.RequestTimeout && this.tryTimes < 2) {
        this.tryTimes++;
        setTimeout(this.defaultRequest.bind(this, chartParams, callback), 200);
      }
    }).then((data: ResponseParams) => callback(data)).catch((e: any) => void(0));
  }

  private componentDidMount() {
    const { params } = this.props;
    if (this.props.hasOwnProperty("cacheOptions")) {
      const chartDataInCache = DataCache.getChartData(params, this.props.hashKeys);
      if (chartDataInCache) {
        this.setState(chartDataInCache);
        return;
      }
    }
    this.defaultRequest(params, this.afterFetch.bind(this));
  }

  private afterFetch(chartData: ResponseParams) {
    let columns = chartData.meta.columns;
    let colIds = map(chartData.meta.columns, "id");
    const offset = chartData.meta.offset;
    // any是因为下面的zipWith返回的schema有bug
    let sourceData: any = chartData.data;

    // 为了支持周期对比图，这里需要meta的offset 转化
    if (chartData.meta.offset) {
      // 寻找粒度
      const offsetPeriod = (7 * 86400000);
      // 强行配对，没验证...
      sourceData = zipWith(
        sourceData.slice(0, offset),
        sourceData.slice(offset),
        (thisTurn: NumberArray, lastTurn: NumberArray): NumberArray =>
          (thisTurn || [lastTurn[0] + offsetPeriod, null]).concat(lastTurn));
      // 加上下划线表示上一周期的字段
      colIds = colIds.concat(map(colIds, (n: string) => (n + "_")));
      // 取得Metric ID
      columns[1].name = "当前周期";
      columns = columns.concat(map(columns,
        (n: Metric) => assign({}, n, {
          id: n.id + "_",
          name: n.isDim ? undefined : "上一周期"
        })
      ));
    }
    const source = map(sourceData, (n: number[]) => zipObject(colIds, n));
    const state = {
      aggregates: chartData.meta.aggregates,
      columns,
      source
    };
    if (this.props.hasOwnProperty("cacheOptions")) {
      DataCache.setChartData(this.props.params, state, this.props.hashKeys, this.props.cacheOptions);
    }

    this.setState(state);
    if (this.props.onLoad) {
      this.props.onLoad(this.state);
    }
  }
}

export default DataSource;
