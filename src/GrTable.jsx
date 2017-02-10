"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var moment = require("moment");
var lodash_1 = require("lodash");
var antd_1 = require("antd");
require("antd/lib/table/style/index.js");
var sorterDecorator = function (column) { return function (a, b) { return (a[column] > b[column] ? 1 : -1); }; };
var GrTable = (function (_super) {
    __extends(GrTable, _super);
    function GrTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GrTable.formatDate = function (v) {
        return moment.unix(v / 1000).format('YYYY-MM-DD');
    };
    GrTable.prototype.render = function () {
        var chartData = this.props.chartData || this.context.chartData;
        if (!chartData) {
            return null;
        }
        var cols = chartData.meta.map(function (m) { return ({
            title: m.name,
            dataIndex: m.id,
            key: m.id,
            sorter: sorterDecorator(m.id),
            render: m.id === 'tm' ? GrTable.formatDate : undefined
        }); });
        // TODO: 类型转换，筛选排序
        var colIds = lodash_1.map(chartData.meta, 'id');
        var jsonData = lodash_1.map(chartData.data, function (n, i) { return lodash_1.extend(lodash_1.zipObject(colIds, n), { key: i }); });
        if (this.context.selected) {
            var selected_1 = this.context.selected;
            var cols_1 = Object.keys(selected_1);
            jsonData = lodash_1.filter(jsonData, function (n) { return lodash_1.every(cols_1, function (c) { return (n[c] >= selected_1[c][0] && n[c] <= selected_1[c][1]); }); });
        }
        return <antd_1.Table dataSource={jsonData} columns={cols} pagination={jsonData.length > 20 ? undefined : false}/>;
    };
    return GrTable;
}(React.Component));
GrTable.contextTypes = {
    chartData: React.PropTypes.any,
    selected: React.PropTypes.any,
    selectHandler: React.PropTypes.func
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GrTable;
