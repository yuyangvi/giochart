GrowingIO Chart component
## Resources
* API Reference
   * [chartParams](API.md#chartParams)
   * [chartData](API.md#chartData)
* Examples
  * [x] Simple Chart
  * [x] Async DataSource Charts
  * [ ] Interactive Data Filter
  * [ ] Realtime Chart
  * [x] Aggregate Chart
  * [ ] ETL Plugin
  * [ ] Analysic Panel
* License

## Install
在package.json中的dependencies里添加
```
"giochart": "git+https://github.com/yuyangvi/giochart.git#master",
```
在package.json所在目录执行
```
npm install giochart
```
## Development
```
npm install
npm start
```

## Example
http://localhost:8000/examples/

online example: http://yuyangvi.github.io/giochart/examples/

## Usage

```js
import React from 'react';
import { GrLoader, GrChart, GrTable } from 'giochart';

const chartParams = {...};
const chartData = {...};

const  Demo1 = (props) => <div><GrChart chartParams chartData />;
const Demo2 = (props) => <div>
  <h1>simple Demo</h1>
  <GrLoader chartParams={chartParams}>
  {/*inside GrLoader it could be any JSX node*/}
      <GrChart chartParams />
      <div>
          <GrTable chartParams />
      </div>
  </GrLoader>
</div>;
React.render(<div>
  <Demo1 />
  <Demo2 />
</div>, document.getElementById('__react-content'));
```

## API
property
输入

数据统计必备字段，中端需要以下字段提供数据
<table class="table table-bordered table-striped">
<tbody><tr><td>aggregateType</td><td>数据统计的规则 求和／平均等</td></tr>
<tr><td>metrics</td><td>指标</td></tr>
<tr><td>dimensions</td><td>维度</td></tr>
<tr><td>period</td><td>咱不知道是啥,好像没用</td></tr>
<tr><td>filter</td><td>筛选条件</td></tr>
<tr><td>timeRange</td><td>周期</td></tr>
<tr><td>interval</td><td>粒度</td></tr>
<tr><td>order</td><td>排序</td></tr>
<tr><td>top</td><td>前xx条</td></tr>
</tbody></table>

留供前端识别的数据，中端只帮着保存，不参考它取数据

<table class="table table-bordered table-striped">
<tbody><tr><td>id</td><td>图表ID</td></tr>
<tr><td>chartType</td><td>图表类型</td></tr>
<tr><td>status</td><td>不知道做啥的</td></tr>
<tr><td>attrs</td><td>包含颜色信息等配置信息</td></tr>
<tr><td>createdAt、creator、creatorId</td><td>创建者信息</td></tr>
<tr><td>updatedAt、updater、updaterId</td><td>修改者信息</td></tr>
<tr><td>subscribed、subscriptionId</td><td>新版没有订阅,应该是没用了</td></tr>
<tr><td>userTag</td><td></td></tr>
<tr><td>versionNumber</td><td></td></tr>
<tr><td>visibleTo</td><td></td></tr>
</tbody></table>

chartData的数据结构
<table class="table table-bordered table-striped">
<tbody><tr><td>meta</td><td>数据表头，数组由包含时间在内的维度结构体或指标结构体的元素组成</td></tr>
<tr><td>data</td><td>二维数组</td></tr>
<tr><td>desc</td><td>？如果前端可以通过数组计算出来，建议不要让后端算了</td></tr>
</tbody></table>
