/***
 * 文档
 */
import { assign, flatten, isEqual, map, uniqBy, zipObject, zipWith } from "lodash";
import * as React from "react";
import * as DataCache from "./DataCache";
import {DataLoaderProps, DataRequestProps, Metric, ResponseParams, Source} from "./ChartProps";

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
const getErrorMsg = (data: string): string => {
  let errorMsg: any = "";
  try {
    errorMsg = JSON.parse(data);
    errorMsg = errorMsg.message;
    if (typeof errorMsg === "string") {
      errorMsg = JSON.parse(errorMsg);
      errorMsg = errorMsg.reason;
    }
  } catch (e) {
    errorMsg = "网络错误";
  }
  return errorMsg;
}
class DataSource extends React.Component <DataLoaderProps, any> {
  private static childContextTypes: React.ValidationMap<any> = {
    aggregator: React.PropTypes.any,
    columns: React.PropTypes.array,
    selectHandler: React.PropTypes.func,
    selected: React.PropTypes.any,
    source: React.PropTypes.any,
    startTime: React.PropTypes.number,
    trackWords: React.PropTypes.any
  };
  private tryTimes = 0;
  private startTime = 0;
  private trackWords = {
    board_name: "",
    channel_name: "",
    name: ""
  };
  private xhr: any = "";
  private constructor(props: DataLoaderProps) {
    super(props);
    // 加载状态
    this.state = {
      aggregator: null,
      columns: null,
      error: false,
      loading: true,
      selected: null,
      source: null
    };

  }

  public render() {
    if (this.state.error) {
      const errorWord: any = {
        101: "数据加载失败",
        102: "业务计算超时"
      }
      return (
        <div className="chart-error">
          <div>抱歉，{errorWord[this.state.error]}<br />请稍后重试</div>
        </div>
      );
    } else if (this.state.loading) {
      return (
        <div className="gr-loading-mask">
          <div className="loading-gif" />
        </div>
      );
    }
    return React.Children.only(this.props.children);
  }
  // TODO: 用来给子孙节点中的GrChart自定义 Demo props state改变触发 DataSource取数据返回触发
  private getChildContext() {
    return {
      aggregator: this.state.aggregator,
      columns: this.state.columns,
      selected: this.state.selected,
      source: this.state.source,
      startTime: this.startTime,
      trackWords: this.trackWords
      /*,
       selectHandler: this.selectHandler.bind(this)
       */
    };
  }
  private componentWillReceiveProps(nextProps: DataLoaderProps) {
    // TODO status改变也会触发，所以多了一层判断
    if (!isEqual(this.props.params, nextProps.params)) {
      if (nextProps.hasOwnProperty("cacheOptions")) {
        const chartDataInCache = DataCache.getChartData(nextProps.params, nextProps.hashKeys);
        if (chartDataInCache) {
          this.setState(chartDataInCache);
          return;
        }
      }
      this.startTime = Date.now();
      this.setState({ loading: true });
      this.defaultRequest(nextProps.params, this.afterFetch.bind(this));
    }
  }

  private defaultRequest(chartParams: DataRequestProps, callback: any) {
    if (this.xhr) {
      this.xhr.abort();
    }
    const xhr = new XMLHttpRequest();
    // Todo 检查是否是DEV环境
    if (this.props.hasOwnProperty("sourceUrl")) {
      xhr.open("get", this.props.sourceUrl, true);
      xhr.send(null);
    } else {
      xhr.open("post", `${window.gateway}/_private/v4/projects/${project.id}/chartdata`, true);
      xhr.timeout = 6e4;
      xhr.withCredentials = true;
      xhr.setRequestHeader("credentials", "include");
      xhr.setRequestHeader("accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(chartParams));
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === HttpStatus.Ok) {
          const data = JSON.parse(xhr.responseText);
          callback(data, chartParams);
        } else if (xhr.status === HttpStatus.RequestTimeout && this.tryTimes < 2) {
          this.tryTimes++;
          setTimeout(this.defaultRequest.bind(this, chartParams, callback), 200);
        } else {
          this.setState({
            error: xhr.status === HttpStatus.RequestTimeout ? 102 : 101,
            loading: false
          });
          const vds = window._vds;
          vds && vds.track("report_load_fail", {
            project_id: window.accountId,
            project_name: window.project.name,
            chart_name: chartParams.name,
            board_name: this.trackWords.board_name,
            report_load_time: Date.now() - this.startTime,
            channel_name: this.trackWords.channel_name,
            error_msg: getErrorMsg(xhr.responseText)
          });
        }
      }
    };
    xhr.ontimeout = (e) => {
      if (xhr.abort) {
        xhr.abort();
      }
      this.setState({ error: 102, loading: false });
      const vds = window._vds;
      if (vds && vds.track) {
        vds.track("report_load_fail", {
          project_id: window.accountId,
          project_name: window.project.name,
          chart_name: chartParams.name,
          board_name: this.trackWords.board_name,
          report_load_time: Date.now() - this.startTime,
          channel_name: this.trackWords.channel_name,
          error_msg: getErrorMsg(xhr.responseText)
        });
      }
    };
  }

  private componentWillMount() {
    const { params } = this.props;
    try {
      const trackWords = location.pathname.match(/\/projects\/\w{8}\/([^\/]+)(?:\/([^\/]+))?/);
      if (trackWords && trackWords.length > 2) {
        this.trackWords = {
          channel_name: trackWords[1],
          board_name: trackWords[2],
          name: params.name
        };
      }
    } catch (e) {
      // void(0);
    }

    if (this.props.hasOwnProperty("cacheOptions")) {
      const chartDataInCache = DataCache.getChartData(params, this.props.hashKeys);
      if (chartDataInCache) {
        this.setState(chartDataInCache);
        return;
      }
    }
    this.startTime = Date.now();
    this.defaultRequest(params, this.afterFetch.bind(this));
  }
  private componentWillUnmount() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  private afterFetch(chartData: ResponseParams, params: DataRequestProps) {
    this.xhr = null;
    if (!isEqual(params, this.props.params)) {
      // 说明这个请求已经废弃了
      return;
    }
    let columns = chartData.meta.columns;
    columns.forEach((n: any) => {
      if (!n.isDim && n.metricId && n.metricId.action) {
        n.id += ("_" + n.metricId.action || "");
      }
    });
    // 清洗columns
    // columns = uniqBy(columns, "id");

    let colIds = map(columns, "id") as string[];
    const offset = chartData.meta.offset;
    // any是因为下面的zipWith返回的schema有bug
    let sourceData: any = chartData.data;
    // 为了支持周期对比图，这里需要meta的offset 转化
    if (chartData.meta.offset !== undefined) {
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
    const source = map(sourceData, (n: number[]) => zipObject(colIds, n)) as Source;
    // 强行添加转化率
    if (params.attrs && params.attrs.isAddFakeMetric) {
      const lastCol = columns[columns.length - 1];
      lastCol.name += "转化率";
      lastCol.isRate = true;
      const id = lastCol.id;
      source.forEach((n: any) => {
        if (n["9yGbpp8x"]) {
          n[id] /= n["9yGbpp8x"];
        } else {
          n[id] = undefined;
        }
      });
    }

    // 加载成功，打点
    if (!source || source.length === 0) {
      try {
        const vds = window._vds;
        vds.track("report_no_data", {
          project_id: window.accountId,
          project_name: window.project.name,
          chart_name: params.name,
          board_name: this.trackWords.board_name,
          report_load_time: Date.now() - this.startTime,
          channel_name: this.trackWords.channel_name,
          params: JSON.stringify(params)
        });
      } catch (e) { void(0); }
    }
    const state = {
      aggregator: chartData.meta.aggregator || null ,
      columns,
      error: false,
      loading: false,
      source
    };
    if (this.props.hasOwnProperty("cacheOptions")) {
      DataCache.setChartData(params, state, this.props.hashKeys, this.props.cacheOptions);
    }
    this.setState(state);
    if (this.props.onLoad) {
      this.props.onLoad(this.state);
    }
  }
}

export default DataSource;
