/*
* 分为 来源\设备\地区\用户广告几种
* */
import * as React from "react";
import SyntheticEvent = React.SyntheticEvent;

const allDimensions = [
  {id: 'p', name: '页面'},
  {id: 'rp', name: '页面来源'},
  {id: 'rd', name: '访问来源'},
  {id: 'rt', name: '一级访问来源'},
  {id: 'kw', name: '搜索词'},
  {id: 'bw', name: '浏览器'},
  {id: 'bwv', name: '浏览器版本'},
  {id: 'os', name: '操作系统'},
  {id: 'osv', name: '操作系统版本'},
  {id: 'city', name: '城市'},
  {id: 'region', name: '地区'},
  {id: 'countryCode', name: '国家代码'},
  {id: 'countryName', name: '国家名称'},
  {id: 'd', name: '域名'},
  {id: 'b', name: '网站/手机应用'},
  {id: 'shw', name: '屏幕大小'},
  {id: 'l', name: '操作系统语言'},
  {id: 'db', name: '设备品牌'},
  {id: 'dm', name: '设备型号'},
  {id: 'ph', name: '设备类型'},
  {id: 'cv', name: 'App 版本'},
  {id: 'o', name: '设备方向'},
  {id: 'utm_source', name: '广告来源'},
  {id: 'utm_campaign', name: '广告名称'},
  {id: 'utm_content', name: '广告内容'},
  {id: 'utm_term', name: '广告关键字'},
  {id: 'utm_medium', name: '广告媒介'},
  {id: 'ch', name: 'App渠道'}
];

class DimensionPanel extends React.Component <any, any> {
  //staticDimension
  addDimension(e: SyntheticEvent<HTMLUListElement>) {
    let key = (e.target as Element).getAttribute('data-key');
    let mode = (e.target as Element).getAttribute('data-mode');

    //modeValue true=替换 false=追加
    let modeValue = (mode == "replace");
    if (key) {
      this.props.addDimension(key.split(','),modeValue);
    }
  }
  render() {
    return (
      <ul className='dimensionPanel' onClick={this.addDimension.bind(this)}>
        <li>来源
          <a href="javascript://" data-key="rt" data-mode="replace">替换</a>
          <a href="javascript://" data-key="rt" data-mode="add">追加</a>
        </li>
        <li>地区
          <a href="javascript://" data-key="region" data-mode="replace">替换</a>
          <a href="javascript://" data-key="region" data-mode="add">追加</a>
        </li>
        <li>设备
          <a href="javascript://" data-key="db" data-mode="replace">替换</a>
          <a href="javascript://" data-key="db" data-mode="add">追加</a>
        </li>
        <li>广告
          <a href="javascript://" data-key="utm_source" data-mode="replace">替换</a>
          <a href="javascript://" data-key="utm_source" data-mode="add">追加</a>
        </li>
      </ul>
    );
  }
}
export default DimensionPanel;