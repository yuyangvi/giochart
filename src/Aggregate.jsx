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
G2.track(false);
var Aggregate = (function (_super) {
    __extends(Aggregate, _super);
    function Aggregate() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Aggregate.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        if (nextContext.chartData) {
            this.chart && this.chart.destroy();
            this.drawComparison(nextProps.chartParams, nextContext.chartData);
        }
    };
    Aggregate.prototype.render = function () {
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
    Aggregate.prototype.componentDidMount = function () {
        var _a = this.props, chartParams = _a.chartParams, chartData = _a.chartData;
        if (this.props.hasOwnProperty('chartData')) {
            this.chart && this.chart.destroy();
            this.drawComparison(chartParams, chartData);
        }
    };
    Aggregate.prototype.drawNumber = function (chartParams, chartData) {
        var dom = document.createElement('div');
        ReactDOM.findDOMNode(this).appendChild(dom);
        var Frame = G2.Frame;
        var jsonData = lodash_1.map(chartData.data, function (n) { return lodash_1.zipObject(['tm', 'val'], n); });
        var frame = new G2.Frame(jsonData);
        var rect = dom.getBoundingClientRect();
        var chart = new G2.Chart({
            container: dom,
            width: rect.width,
            height: 54,
            plotCfg: {
                margin: [1, 0, 1, 0],
            }
        });
        chart.source(frame, {
            tm: { type: 'time' }
        });
        chart.axis(false);
        chart.tooltip(false);
        chartParams.attrs.colorTheme = chartParams.attrs && chartParams.attrs.colorTheme || '125, 128, 243';
        chart.area().color("l(90) 0:rgba(" + chartParams.attrs.colorTheme + ", 0.3) 1:rgba(" + chartParams.attrs.colorTheme + ", 0.1)").shape('smooth').position('tm*val');
        chart.line().shape('smooth').color("rgb(" + chartParams.attrs.colorTheme + ")").position('tm*val').size(2);
        chart.render();
        this.chart = chart;
        return chart;
    };
    Aggregate.prototype.drawComparison = function (chartParams, chartData) {
        var dom = document.createElement('div');
        ReactDOM.findDOMNode(this).appendChild(dom);
        var chart = new G2.Chart({
            container: dom,
            height: dom.getBoundingClientRect().height || 250,
            forceFit: true,
            plotCfg: { margin: [40, 10, 40, 60] }
        });
        var sourceDef = this.createSourceConfig(chartParams, chartData.meta);
        var colIds = ['tm', 'val', 'tm_', 'val_'];
        var jsonData = lodash_1.map(chartData.data, function (n) { return lodash_1.zipObject(colIds, n); });
        var frame = new G2.Frame(jsonData);
        sourceDef['val'] = sourceDef['val_'] = {
            min: 0,
            max: Math.max(G2.Frame.max(frame, 'val'), G2.Frame.max(frame, 'val_'))
        };
        chart.source(frame, sourceDef);
        //做分组
        chart.axis('tm', { title: false });
        chart.axis('val', { title: false });
        chart.axis('val_', false);
        //TODO: scale
        //第一条线
        chart.area().position('tm*val').color("rgba(" + chartParams.attrs.colorTheme + ", .5)");
        chart.line().position('tm*val').color("rgb(" + chartParams.attrs.colorTheme + ")");
        chart.line().position('tm*val_').color('gray');
        chart.legend(false);
        //chart drawGuild
        var bCanvas = chart.get('backCanvas');
        bCanvas.addShape('text', {
            attrs: {
                x: 586,
                y: 0,
                text: chartData.desc.data[0],
                fontSize: 24,
                textAlign: 'right',
                textBaseline: 'top',
                fill: '#666'
            }
        });
        var ratio = 100 * (chartData.desc.data[0] / chartData.desc.data[1] - 1);
        bCanvas.addShape('text', {
            attrs: {
                x: 656,
                y: 0,
                text: ratio.toPrecision(3) + '%',
                fontSize: 14,
                textAlign: 'right',
                textBaseline: 'top',
                fill: '#28c29b'
            }
        });
        bCanvas.addShape('text', {
            attrs: {
                x: 656,
                y: 20,
                text: '相比7天前',
                fontSize: 12,
                textAlign: 'right',
                textBaseline: 'top',
                fill: '#666'
            }
        });
        bCanvas.draw();
        chart.render();
        this.chart = chart;
    };
    Aggregate.prototype.createSourceConfig = function (chartParams, metas) {
        var sourceDef = {};
        metas.forEach(function (m) { return sourceDef[m.id] = { alias: m.name }; });
        if (lodash_1.find(metas, { id: 'tm' })) {
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
    return Aggregate;
}(React.Component));
Aggregate.contextTypes = {
    chartData: React.PropTypes.any
};
Aggregate.contextTypes = {
    chartData: React.PropTypes.any
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Aggregate;
