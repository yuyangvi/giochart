#GrowingIO Chart component

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
http://localhost:9090

## Usage

```js
import React from 'react';
import GioChart, { Chart, ContextListener, DataSource, GrTable } from 'giochart';

const dataParams = {...};
const chartData = {...};
const drawParams ={...};
const jsonArray=[{...}, {...}];
// 独立数据源绘图，drawParams根据数据源返回的meta.columns计算
const  Section1 = (props) => <GioChart chartType='line' params={dataParams} />;

// 手工提供数据源
const  Section2 = (props) => <Chart chartParams={drawParams} source={jsonArray} />;

// 一对多图形,手工控制
const Section3 = (props) => (
  <div>
    <h1>simple Demo</h1>
    <DataSource params={dataParams}>
    {/*inside GrLoader it could be any JSX node*/}
        <ContextListener chartParams={drawParams} />
        <div>
            <ContextListener chartParams={otherParams} />
        </div>
    </DataSource>
  </div>);
React.render(<div>
  <Section1 />
  <Section2 />
  <Section3 />
</div>, document.getElementById('__react-content'));
```
## API Reference
   * [Server Request & Response](docs/GQL.md) 服务器请求数据格式文档
   * [Chart](docs/Chart.md) 基本图形文档
   * [GrTable](docs/GrTable.md) 表格文档
   * [DataSource](docs/DataSource.md) 通用数据源加载
   * [Interactive](docs/Interactive.md) 关于可视化交互