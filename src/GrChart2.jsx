"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ReactDOM = require("react-dom");
var lodash_1 = require("lodash");
var G2 = require("g2");
var GrChart = (function (_super) {
    __extends(GrChart, _super);
    function GrChart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GrChart.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        if (nextContext.source) {
            this.chart && this.chart.destroy();
            this.drawChart(nextProps.chartParams, nextContext.source);
        }
    };
    GrChart.prototype.render = function () {
        return <div></div>;
    };
    /*defaultRetryRequest() {
      let {chartParams} = this.props;
      let result = Promise.reject();
      for (let i = 3; i > 0; i--) {
        result = result.catch(this.defaultRequest.bind(this, chartParams, this.drawChart));
      }
      return result;
    }*/
    GrChart.prototype.componentDidMount = function () {
        var _a = this.props, chartParams = _a.chartParams, source = _a.source;
        if (this.props.hasOwnProperty('source')) {
            this.chart && this.chart.destroy();
            this.drawChart(chartParams, source);
        }
    };
    GrChart.prototype.drawChart = function (chartParams, source) {
        var dom = document.createElement('div');
        ReactDOM.findDOMNode(this).appendChild(dom);
        var chart = new G2.Chart({
            container: dom,
            height: dom.getBoundingClientRect().height || 250,
            forceFit: true,
            plotCfg: {}
        });
        var frame = new G2.Frame(source);
        var sourceDef = this.createSourceConfig(chartParams);
        var metricCols = lodash_1.map(chartParams.metrics, 'id');
        var dimCols = lodash_1.map(chartParams.dimensions, 'id');
        if (chartParams.chartType !== 'bubble' && chartParams.metrics.length > 1) {
            frame = G2.Frame.combinColumns(frame, metricCols, 'val', 'metric', dimCols);
            dimCols.push('metric');
            metricCols = ['val'];
            //设定id=>name
            var metricDict_1 = lodash_1.fromPairs(lodash_1.zip(metricCols, chartParams.metricsNames));
            var mColVals = frame.colArray('metric');
            var mColNames = mColVals.map(function (n) { return metricDict_1[n]; });
            frame.colReplace('metric', mColNames);
        }
        chart.source(frame, sourceDef);
        //做分组
        chart.axis('tm', { title: false });
        chart.axis('val', { title: false });
        var geom = this.caculateGeom(chart, chartParams.chartType, chartParams.attrs.subChartType);
        var pos;
        if (chartParams.chartType === 'bubble') {
            pos = metricCols[0] + '*' + metricCols[1];
        }
        else if (chartParams.chartType === 'funnel') {
            pos = G2.Stat.summary.sum('metric*val');
        }
        else {
            pos = dimCols[0] + '*' + metricCols[0];
        }
        geom.position(pos);
        if (chartParams.chartType === 'funnel') {
            geom.color('metric', ['#C82B3D', '#EB4456', '#F9815C', '#F8AB60', '#EDCC72'])
                .label('metric', { offset: 10, label: { fontSize: 14 } });
        }
        else if (dimCols.length > 1) {
            geom.color(dimCols[1]);
        }
        chart.render();
        this.chart = chart;
        chart.setMode('select');
        chart.select('rangeX');
        //设置筛选功能,将选区传给GrLoader，其他组件通过context传导filter,
        if (chartParams.chartType === 'line') {
            chart.on('rangeselectend', this.context.selectHandler);
        }
    };
    GrChart.prototype.createSourceConfig = function (chartParams) {
        var sourceDef = {};
        //射击
        chartParams.metrics.forEach(function (m, i) {
            sourceDef[m.id] = { alias: chartParams.metricsNames[i] };
        });
        chartParams.dimensions.forEach(function (m, i) {
            sourceDef[m.id] = { alias: chartParams.dimensionsNames[i] };
        });
        if (lodash_1.find(chartParams.dimensions, { id: 'tm' })) {
            var timeDef = {
                alias: '时间',
                type: 'time',
                mask: 'mm-dd',
                nice: true,
                tickCount: 7
            };
            if (chartParams.timeRange === 'day:8,1') {
                timeDef.tickCount = 7;
            }
            if (chartParams.interval === 86400000) {
                timeDef.mask = 'mm-dd';
            }
            else if (chartParams.interval === 3600000) {
                timeDef.mask = 'HH:mm';
            }
            if (chartParams.chartType === 'bar' || chartParams.chartType === 'vbar') {
                timeDef.type = 'timeCat';
            }
            sourceDef['tm'] = timeDef;
        }
        return sourceDef;
    };
    GrChart.prototype.caculateGeom = function (chart, gt, subType) {
        var adjust;
        if (subType === 'seperate') {
            adjust = 'dodge';
        }
        else if (subType === 'total') {
            adjust = 'stack';
        }
        else if (subType === 'percent') {
            adjust = 'stack';
        }
        if (gt === 'bar') {
            chart.coord('rect').transpose();
            return chart.interval(adjust);
        }
        else if (gt === 'vbar') {
            return chart.interval(adjust);
        }
        else if (gt === 'funnel') {
            chart.coord('rect').transpose().scale(1, -1);
            chart.axis(false);
            return chart.intervalSymmetric().shape('funnel');
        }
        else if (gt === 'bubble') {
            //TODO:重新设计Tooltip;
            return chart.point();
        }
        else if (gt === 'line') {
            return chart.line().size(2);
        }
        return chart[gt](adjust);
    };
    return GrChart;
}(React.Component));
GrChart.contextTypes = {
    source: React.PropTypes.any,
    selected: React.PropTypes.any,
    selectHandler: React.PropTypes.func
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GrChart;
