DataSource
##usage
```
import { DataSource,ContextListener } from 'giochart';

const chartParams = {
  chartType: "table",
  columns: [
    {id: "tm", name: "time", isDim: true},
    {id: "visited", name: "visited", isDim: false}
  ],
  granularities: [{id: "tm", interval: 86400 }]
};


React.render(
  <DataSource params={requestParams}>
     <ContextListener chartParams={chartParams} />
     <p>work in DataSource, just as other JSXs.</p>
     <div>
       <ContextListener chartType='line' />
     </div>
   </DataSource>
, mountNode);
```
##Props
####DataSource Property
| Property              | Type                | Default |      Description      |
| :-------------------- | :------------------ | :------ | :-------------------- |
| params                | `DataRequestParams` | `null`  | 请求内容，参考 [Server Request & Response](docs/GQL.md) |


#### ContextListener Property

方式一，写明图形需要的字段

| Property              | Type                | Default |    Description    |
| :-------------------- | :------------------ | :------ | :---------------- |
| chartParams           | `DrawParams`        | `null`  |     绘图必需配置   |

方式二，图形需要的字段是由DataSource提供，所有字段都用

| Property              | Type                | Default |    Description    |
| :-------------------- | :------------------ | :------ | :---------------- |
| chartType             | `string`            | `null`  |      绘图类型      |

