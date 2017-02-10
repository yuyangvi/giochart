"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var update = require("react/lib/update");
var DataSource_1 = require("../src/DataSource");
var GrChart2_1 = require("../src/GrChart2");
var DimensionPanel_1 = require("../src/DimensionPanel");
var lineParams = {
    aggregateType: 'sum',
    attrs: { metricType: 'none', period: 7, timeRange: 'day:8,1', subChartType: 'total' },
    chartType: 'line',
    createdAt: 1483535473005,
    creator: 'liuhuaqing',
    creatorId: 'GQPDMloN',
    dimensions: [{ id: 'tm', name: '时间' }],
    dimensionsNames: ['时间'],
    filter: { op: '=', key: 'rt', value: '搜索引擎', name: '一级访问来源' },
    id: 'JoOWV0Ao',
    interval: 86400000,
    metrics: [
        { id: '9yGbpp8x', level: 'complex' },
        { id: 'j9yKL8Py', level: 'simple', action: 'imp' }
    ],
    metricsNames: ['访问用户量', '保存创建分群浏览量'],
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
    Demo.prototype.addDimension = function (dim) {
        var chartParams = update(lineParams, { dimensions: { $push: dim } });
        this.setState({ chartParams: chartParams });
    };
    Demo.prototype.render = function () {
        return (React.createElement("div", { className: 'container' },
            React.createElement("div", { className: 'mainPanel' },
                React.createElement(DataSource_1.default, { chartParams: this.state.chartParams },
                    React.createElement(GrChart2_1.default, { chartParams: lineParams }),
                    React.createElement(GrChart2_1.default, { chartParams: lineParams }),
                    React.createElement(DimensionPanel_1.default, { addDimension: this.addDimension.bind(this) })))));
    };
    return Demo;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Demo;
//# sourceMappingURL=Demo2.js.map