"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var update_1 = require("react/lib/update");
var GrLoader_1 = require("../src/GrLoader");
var GrChart_1 = require("../src/GrChart");
var GrTable_1 = require("../src/GrTable");
var Aggregate_1 = require("../src/Aggregate");
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
var aggParams = { "metrics": [{ "id": "PWq7nnvv", "level": "complex" }], "id": "4PYqqxjP", "name": "MKT | 新访问周期比", "chartType": "comparison", "top": 10, "dimensions": [], "filter": {}, "interval": 86400000, "aggregateType": "sum", "attrs": { "metricType": "none", "colorTheme": "252, 95, 58", "period": 7, "timeRange": "day:8,1", "metrics": { "PWq7nnvv": { "metricName": "新访问用户量" } } }, "createdAt": 1482908162272, "updatedAt": 1482908162272, "creator": "Alex", "updater": "Alex", "versionNumber": 1, "period": 7, "timeRange": "day:8,1", "orders": null, "creatorId": "EoZk8M9k", "updaterId": "EoZk8M9k", "status": "activated", "visibleTo": { "type": "Private", "ids": ["EoZk8M9k"], "userIds": ["EoZk8M9k"] } };
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
        return (<div className='container'>
        <div className='sidebar'>
          <p>
          <label>图表类型</label>
          <select onChange={function (e) {
            var selectElement = e.target;
            var chartType = selectElement.value;
            _this.setParams(chartType);
        }}>
            <option value='line'>线图</option>
            <option value='area'>面积图</option>
            <option value='vbar'>柱形图</option>
            <option value='bubble'>散点图</option>
            <option value='bar'>横向柱</option>
            <option value='funnel'>漏斗图</option>
          </select>
          </p>
          <p>
            <label>堆积方式</label>
            <select onChange={function (e) {
            var selectElement = e.target;
            var subChartType = selectElement.value;
            _this.setSubParams(subChartType);
        }}>
              <option value='total'>堆积</option>
              <option value='seperate'>分组</option>
              <option value='percent'>百分比</option>
            </select>
          </p>
        </div>
        <div className='mainPanel'>
          <GrLoader_1.default chartParams={this.state.chartParams}>
            <GrChart_1.default chartParams={this.state.chartParams}/>
            <GrTable_1.default chartParams={this.state.chartParams}/>
          </GrLoader_1.default>
          <GrLoader_1.default chartParams={aggParams}>
            <Aggregate_1.default chartParams={aggParams}/>
          </GrLoader_1.default>
        </div>
      </div>);
    };
    return Demo;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Demo;
