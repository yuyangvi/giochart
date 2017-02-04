"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var update_1 = require("react/lib/update");
var _1 = require("../src/");
var lineParams = {
    aggregateType: 'sum',
    attrs: { metricType: 'none', period: 7, timeRange: 'day:8,1', subChartType: 'total' },
    chartType: 'line',
    createdAt: 1483535473005,
    creator: 'liuhuaqing',
    creatorId: 'GQPDMloN',
    dimensions: [],
    filter: { op: '=', key: 'rt', value: '搜索引擎', name: '一级访问来源' },
    id: 'JoOWV0Ao',
    interval: 86400000,
    metrics: [
        { id: '9yGbpp8x', level: 'complex' },
        { id: 'j9yKL8Py', level: 'simple', action: 'imp' }
    ],
    name: 'sssssssfff',
    orders: null,
    period: 7,
    status: 'activated',
    timeRange: 'day:8,1',
    top: 10,
    updatedAt: 1483535473005,
    updater: 'liuhuaqing',
    updaterId: 'GQPDMloN',
    versionNumber: 1
};
var Demo = (function (_super) {
    __extends(Demo, _super);
    function Demo() {
        var _this = _super.call(this) || this;
        _this.state = {
            chartParams: lineParams
        };
        return _this;
    }
    Demo.prototype.setParams = function (chartType) {
        var params = this.state.chartParams;
        this.setState({
            chartParams: update_1.default(params, { chartType: { $set: chartType } })
        });
    };
    Demo.prototype.setSubParams = function (subChartType) {
        var params = this.state.chartParams;
        var chartParams = update_1.default(params, { attrs: { subChartType: { $set: subChartType } } });
        this.setState({ chartParams: chartParams });
    };
    Demo.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { className: 'container' },
            React.createElement("div", { className: 'sidebar' },
                React.createElement("p", null,
                    React.createElement("label", null, "\u56FE\u8868\u7C7B\u578B"),
                    React.createElement("select", { onChange: function (e) {
                            var selectElement = e.target;
                            var chartType = selectElement.value;
                            _this.setParams(chartType);
                        } },
                        React.createElement("option", { value: 'line' }, "\u7EBF\u56FE"),
                        React.createElement("option", { value: 'area' }, "\u9762\u79EF\u56FE"),
                        React.createElement("option", { value: 'vbar' }, "\u67F1\u5F62\u56FE"),
                        React.createElement("option", { value: 'bubble' }, "\u6563\u70B9\u56FE"),
                        React.createElement("option", { value: 'bar' }, "\u6A2A\u5411\u67F1"),
                        React.createElement("option", { value: 'funnel' }, "\u6F0F\u6597\u56FE"))),
                React.createElement("p", null,
                    React.createElement("label", null, "\u5806\u79EF\u65B9\u5F0F"),
                    React.createElement("select", { onChange: function (e) {
                            var selectElement = e.target;
                            var subChartType = selectElement.value;
                            _this.setSubParams(subChartType);
                        } },
                        React.createElement("option", { value: 'total' }, "\u5806\u79EF"),
                        React.createElement("option", { value: 'seperate' }, "\u5206\u7EC4"),
                        React.createElement("option", { value: 'percent' }, "\u767E\u5206\u6BD4")))),
            React.createElement("div", { className: 'mainPanel' },
                React.createElement(_1.default, { chartParams: this.state.chartParams }))));
    };
    return Demo;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Demo;
//# sourceMappingURL=Demo.js.map