"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
//数据统计必备字段，中端需要以下字段提供数据
exports.HttpStatus = {
    Ok: 200,
    Created: 201,
    NoContent: 204,
    MovedPermanently: 301,
    SeeOther: 303,
    NotModified: 304,
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    RequestTimeout: 408,
    UnsupportedEntity: 422,
    Locked: 423,
    TooManyRequests: 429,
    InternalServerError: 500,
    NotImplemented: 501
};
var GrLoader = (function (_super) {
    __extends(GrLoader, _super);
    function GrLoader(props) {
        var _this = _super.call(this, props) || this;
        // 加载状态
        _this.state = {
            isLoaded: false,
            chartData: null,
        };
        return _this;
    }
    //TODO: 用来给子孙节点中的GrChart自定义
    GrLoader.prototype.getChildContext = function () {
        return { chartData: this.state.chartData };
    };
    GrLoader.prototype.render = function () {
        return (<div ref='container'>
        {this.props.children}
      </div>);
    };
    /*defaultRetryRequest() {
      let {chartParams} = this.props;
      let result = Promise.reject();
      for (let i = 3; i > 0; i--) {
        result = result.catch(this.defaultRequest.bind(this, chartParams, this.drawChart));
      }
      return result;
    }*/
    GrLoader.prototype.defaultRequest = function (chartParams, callback) {
        //TODO:
        var url = chartParams.chartType === 'comparison' ? '/assets/aggragte.json' : '/assets/demo.json';
        return fetch(url /*, {
          credentials: 'same-origin',
          contentType: 'application/json',
          method: 'get',
          //body: JSON.stringify(chartParams)
        }*/)
            .then(function (response) {
            var status = response.status;
            if (status === exports.HttpStatus.Ok) {
                return response.json();
            }
        }).then(function (data) { return callback(data); });
    };
    GrLoader.prototype.componentDidMount = function () {
        var _this = this;
        // this._fetchChartData(this.props);
        var chartParams = this.props.chartParams;
        this.defaultRequest(chartParams, function (chartData) {
            _this.setState({ isLoaded: true, chartData: chartData });
        });
        //this.defaultRetryRequest().then(data => this.drawChart(chartParams, data));
    };
    return GrLoader;
}(React.Component));
GrLoader.childContextTypes = {
    chartData: React.PropTypes.any
};
GrLoader.childContextTypes = {
    chartData: React.PropTypes.any
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GrLoader;
