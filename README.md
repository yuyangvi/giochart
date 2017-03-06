GrowingIO Chart component
## Resources
* API Reference
   * [chartParams](API.md#chartParams)
   * [chartData](API.md#chartData)
* Examples
  * [x] Simple Chart
  * [x] Async DataSource Charts
  * [x] Interactive Data Filter
  * [ ] Realtime Chart
  * [x] Aggregate Chart
  * [ ] Output Image
  * [ ] ETL Plugin
  * [ ] Analysic Panel
* License

## Install
在package.json中的dependenc ies里添加
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
import GioChart, { Chart, DataSource, GrTable } from 'giochart';

const dataParams = {...};
const chartData = {...};
const drawParams ={...};
const jsonArray=[{...}, {...}];
// 独立数据源绘图，drawParams根据数据源返回的meta.columns计算
const  Section1 = (props) => <GioChart chartType='line' params={dataParams} />;

// 手工提供数据源
const  Section2 = (props) => <Chart drawChart source={jsonArray} />;

// 一对多图形,手工控制
const Section3 = (props) => (
  <div>
    <h1>simple Demo</h1>
    <DataSource params={dataParams}>
    {/*inside GrLoader it could be any JSX node*/}
        <Chart drawParams />
        <div>
            <GrTable drawParams />
        </div>
    </DataSource>
  </div>);
React.render(<div>
  <Section1 />
  <Section2 />
  <Section3 />
</div>, document.getElementById('__react-content'));
```

## API
DataSource
params输入
数据统计必备字段，中端需要以下字段提供数据
```
export interface DataRequestProps {
  type?: string; // Enum: funnel, retention
  metrics: Metric[]; // 指标
  dimensions: string[]; // 维度
  granularities: Granulariy[]; // 粒度
  filter?: Filter[]; // 过滤
  timeRange: string; // 时间区域 day:8,1
  userTag?: string; // 用户分群ID
  limit?: number; // 数据行限制 10
  orders?: Order[]; // 排序
  aggregateType?: string; // 聚合类型: sum, avg
  attrs?: Object; // 属性
  interval?: number; // 时间粒度 deperated
}
```

Chart
chartParams输入格式
```
export interface DrawParamsProps {
  adjust?: string;
  chartType: string;
  columns: Metric[];// 指标和维度的数组，为了保证绘图的准确，请将xy轴的字段分别放在维度序列和指标序列最前面
  granularities?: Granulariy[];
}
```
