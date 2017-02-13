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
var originParams = {
    metrics: [{ id: '4PYKzgx9', level: 'simple', action: 'imp' }],
    id: 'rREppgm9',
    name: 'GIO 3.0 logo 浏览量',
    chartType: 'table',
    top: 100,
    metricsNames: ['GrowingIO_221796_浏览量'],
    dimensions: ['tm'],
    dimensionsNames: ['时间'],
    filter: {},
    interval: 86400000,
    aggregateType: 'sum',
    attrs: {
        'metricType': 'none',
        'period': 7,
        'timeRange': 'day:8,1',
        'metrics': {
            'z98xev09': { metricName: 'GrowingIO_221796_浏览量' }
        }
    },
    'createdAt': 1482896072289,
    'updatedAt': 1482896072289,
    'creator': '张溪梦',
    'updater': '张溪梦',
    'versionNumber': 1,
    'period': 7,
    'timeRange': 'day:8,1',
    'orders': null,
    'creatorId': 'GQPDxPNm',
    'updaterId': 'GQPDxPNm',
    'status': 'activated',
    'visibleTo': { type: 'Public' },
    'userTag': null
};
var lineParams = update(originParams, { chartType: { $set: 'line' } });
var Demo = (function (_super) {
    __extends(Demo, _super);
    function Demo() {
        var _this = _super.call(this) || this;
        _this.state = {
            dim: null,
            select: null
        };
        return _this;
    }
    Demo.prototype.addDimension = function (dim) {
        this.setState({ dim: dim });
    };
    Demo.prototype.select = function (selected) {
        this.refs.dataSource1.setState({ selected: selected });
    };
    Demo.prototype.render = function () {
        var chartParams = originParams;
        var barParams = null;
        if (this.state.dim) {
            chartParams = update(originParams, { dimensions: { $push: this.state.dim } });
            barParams = update(chartParams, { dimensions: { $set: this.state.dim }, chartType: { $set: 'bar' } });
        }
        return (React.createElement("div", { className: 'container' },
            React.createElement("div", { className: 'mainPanel' },
                React.createElement(DataSource_1["default"], { chartParams: chartParams, ref: 'dataSource1' },
                    React.createElement(GrChart2_1["default"], { chartParams: lineParams }),
                    barParams ? React.createElement(GrChart2_1["default"], { chartParams: barParams, select: this.select.bind(this) }) : null,
                    React.createElement(DimensionPanel_1["default"], { addDimension: this.addDimension.bind(this) })))));
    };
    return Demo;
}(React.Component));
exports.__esModule = true;
exports["default"] = Demo;
//# sourceMappingURL=Demo2.js.map