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
            var source = nextContext.source;
            if (nextContext.selected) {
                //算维度的差集
                var selected = lodash_1.pick(nextContext.selected, nextProps.chartParams.dimensions);
                if (!lodash_1.isEmpty(selected) && this.chart) {
                    return;
                }
                source = lodash_1.filter(source, nextContext.selected);
            }
            // TODO: 如果只是context修改
            console.log(nextProps.chartParams.chartType);
            this.chart && this.chart.destroy();
            this.drawChart(nextProps.chartParams, source);
        }
    };
    GrChart.prototype.render = function () {
        return React.createElement("div", null);
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
        var _this = this;
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
        var dimCols = chartParams.dimensions;
        if (chartParams.chartType !== 'bubble' && chartParams.metrics.length > 1) {
            frame = G2.Frame.combinColumns(frame, metricCols, 'val', 'metric', dimCols);
            dimCols.push('metric');
            //设定id=>name
            var metricDict_1 = lodash_1.fromPairs(lodash_1.zip(metricCols, chartParams.metricsNames));
            var mColVals = frame.colArray('metric');
            var mColNames = mColVals.map(function (n) { return metricDict_1[n]; });
            metricCols = ['val'];
            frame.colReplace('metric', mColNames);
        }
        //sourceDef['metric'] = {alias:'指标', type: 'cat'};
        chart.source(frame, sourceDef);
        //做分组
        chart.axis('tm', { title: false });
        chart.axis('val', { title: false });
        var geom = this.caculateGeom(chart, chartParams.chartType, chartParams.attrs.subChartType);
        var pos, selectCols;
        if (chartParams.chartType === 'bubble') {
            pos = metricCols[0] + '*' + metricCols[1];
            selectCols = metricCols;
        }
        else if (chartParams.chartType === 'funnel') {
            pos = G2.Stat.summary.sum('metric*val');
            selectCols = ['metric'];
        }
        else {
            pos = G2.Stat.summary.sum(dimCols[0] + '*' + metricCols[0]);
            selectCols = [dimCols[0]];
        }
        geom.position(pos);
        if (chartParams.chartType === 'funnel') {
            geom.color('metric', ['#C82B3D', '#EB4456', '#F9815C', '#F8AB60', '#EDCC72'])
                .label('metric', { offset: 10, label: { fontSize: 14 } });
        }
        else if (dimCols.length > 1) {
            geom.color('metric');
        }
        if (this.props.hasOwnProperty('select')) {
            geom.selected(true, {
                selectedMode: 'single',
                style: { fill: '#fe9929' }
            });
            if (dimCols[0] !== 'tm') {
                chart.on('plotclick', function (evt) { _this.selectHandler(evt, selectCols); });
            }
        }
        chart.render();
        this.chart = chart;
        /*
            chart.setMode('select');
            chart.select('rangeX');
            //设置筛选功能,将选区传给GrLoader，其他组件通过context传导filter,
            if (chartParams.chartType === 'line') {
              chart.on('rangeselectend', this.context.selectHandler);
            }
        */
    };
    GrChart.prototype.selectHandler = function (ev, selectCols) {
        var shape = ev.shape;
        if (shape && shape.get('selected')) {
            var item = shape.get('origin');
            //过滤
            this.props.select(lodash_1.pick(item._origin, selectCols));
        }
        else {
            var item = shape.get('origin');
            console.log(item);
        }
    };
    GrChart.prototype.createSourceConfig = function (chartParams) {
        var sourceDef = {};
        //射击
        chartParams.metrics.forEach(function (m, i) {
            sourceDef[m.id] = { alias: chartParams.metricsNames[i] };
        });
        chartParams.dimensions.forEach(function (m, i) {
            sourceDef[m] = { alias: chartParams.dimensionsNames[i], type: 'cat' };
        });
        if (chartParams.dimensions.includes('tm')) {
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
            //chart.coord('rect').transpose();
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
    selected: React.PropTypes.any
};
exports.__esModule = true;
exports["default"] = GrChart;
//# sourceMappingURL=GrChart2.js.map