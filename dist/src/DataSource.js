"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var lodash_1 = require("lodash");
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
var DataSource = (function (_super) {
    __extends(DataSource, _super);
    function DataSource(props) {
        var _this = _super.call(this, props) || this;
        // 加载状态
        _this.state = {
            isLoaded: false,
            source: null,
            selected: null,
        };
        return _this;
    }
    DataSource.prototype.selectHandler = function (evt) {
        this.setState({
            selected: evt.selected
        });
    };
    //TODO: 用来给子孙节点中的GrChart自定义
    DataSource.prototype.getChildContext = function () {
        return {
            source: this.state.source,
            selected: this.state.selected,
            selectHandler: this.selectHandler.bind(this)
        };
    };
    DataSource.prototype.render = function () {
        return React.createElement("div", null, this.props.children);
    };
    //动态变化Dimension
    /*defaultRetryRequest() {
      let {chartParams} = this.props;
      let result = Promise.reject();
      for (let i = 3; i > 0; i--) {
        result = result.catch(this.defaultRequest.bind(this, chartParams, this.drawChart));
      }
      return result;
    }*/
    DataSource.prototype.defaultRequest = function (chartParams, callback) {
        var url = this.props.sourceUrl || "https://gta.growingio.com/_private/v3/projects/" + project.id + "/chartdata";
        return fetch(url)
            .then(function (response) {
            var status = response.status;
            if (status === exports.HttpStatus.Ok) {
                return response.json();
            }
        }).then(function (data) { return callback(data); });
    };
    DataSource.prototype.componentDidMount = function () {
        var chartParams = this.props.chartParams;
        this.defaultRequest(chartParams, this.afterFetch.bind(this));
    };
    DataSource.prototype.afterFetch = function (chartData) {
        var colIds = lodash_1.map(chartData.meta, function (n) { return (n.isDim ? n.id : n.metricId.id); });
        var source = lodash_1.map(chartData.data, function (n) { return lodash_1.zipObject(colIds, n); });
        this.setState({
            isLoaded: true,
            source: source
        });
    };
    return DataSource;
}(React.Component));
DataSource.childContextTypes = {
    source: React.PropTypes.any,
    selected: React.PropTypes.any,
    selectHandler: React.PropTypes.func
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataSource;
//# sourceMappingURL=DataSource.js.map