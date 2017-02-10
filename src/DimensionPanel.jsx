"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
* 分为 来源\设备\地区\用户广告几种
* */
var React = require("react");
var lodash_1 = require("lodash");
var allDimensions = [
    { id: 'p', name: '页面' },
    { id: 'rp', name: '页面来源' },
    { id: 'rd', name: '访问来源' },
    { id: 'rt', name: '一级访问来源' },
    { id: 'kw', name: '搜索词' },
    { id: 'bw', name: '浏览器' },
    { id: 'bwv', name: '浏览器版本' },
    { id: 'os', name: '操作系统' },
    { id: 'osv', name: '操作系统版本' },
    { id: 'city', name: '城市' },
    { id: 'region', name: '地区' },
    { id: 'countryCode', name: '国家代码' },
    { id: 'countryName', name: '国家名称' },
    { id: 'd', name: '域名' },
    { id: 'b', name: '网站/手机应用' },
    { id: 'shw', name: '屏幕大小' },
    { id: 'l', name: '操作系统语言' },
    { id: 'db', name: '设备品牌' },
    { id: 'dm', name: '设备型号' },
    { id: 'ph', name: '设备类型' },
    { id: 'cv', name: 'App 版本' },
    { id: 'o', name: '设备方向' },
    { id: 'utm_source', name: '广告来源' },
    { id: 'utm_campaign', name: '广告名称' },
    { id: 'utm_content', name: '广告内容' },
    { id: 'utm_term', name: '广告关键字' },
    { id: 'utm_medium', name: '广告媒介' },
    { id: 'ch', name: 'App渠道' }
];
var DimensionPanel = (function (_super) {
    __extends(DimensionPanel, _super);
    function DimensionPanel() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //staticDimension
    DimensionPanel.prototype.addDimension = function (e) {
        var key = e.currentTarget.getAttribute('key');
        if (key) {
            this.props.addDimension(lodash_1.filter(allDimensions, { id: key }));
        }
    };
    DimensionPanel.prototype.render = function () {
        return (<ul onClick={this.addDimension.bind(this)}>
        <li><a href="javascript://" key="rt">来源</a></li>
        <li><a href="javascript://" key="region">地区</a></li>
        <li><a href="javascript://" key="db">设备</a></li>
        <li><a href="javascript://" key="utm_source">广告</a></li>
      </ul>);
    };
    return DimensionPanel;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DimensionPanel;
