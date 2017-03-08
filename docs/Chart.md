Chart

##Usage
```
import { Chart } from 'giochart';

const chartParams = {
  chartType: "table",
  columns: [
    {id: "tm", name: "time", isDim: true},
    {id: "visited", name: "visited", isDim: false}
  ],
  granularities: [{id: "tm", interval: 86400 }]
};
const source = [
  {tm: 1482940800000, visited: 816},
  {tm: 1483027200000, visited: 677},
  {tm: 1483113600000, visited: 139},
  ...
];
React.render(<Chart chartParams={chartParams} source={source} />, mountNode);
```
##API

####Property

| Property              | Type                | Default |    Description    |
| :-------------------- | :------------------ | :------ | :---------------- |
| chartParams           | `DrawParams`        | `null`  |      绘图必需配置   |
| source                | `JSON[]`            | `null`  |       数据源       |
| select *[Optional]*   | `Function`          | `null`  |  选中图形的交互回调 |
| selected *[Optional]* | `Object`            | `null`  |  对数据的筛选条件   |

#### DrawParams Property

| Property              | Type                | Default |    Description    |
| :-------------------- | :------------------ | :------ | :---------------- |
| chartType             | `string`            | `line`  |  图形类型,可以是 `line`/`bar`/`vbar`/`bubble`/`funnel`.       |
| columns               | `Metric[]`          | `null`  |  字段描述          |
| granularities *[Optional]*| `Granularity[]` | `null`  |  粒度描述          |
| adjust *[Optional]*   | `string`            | `null`  |  层叠`stack`/扰动`jitter`/分组`dodge`/对称`symmatic` |

#### Metric Property
| Property       | Type                | Default |    Description    |
| :------------- | :------------------ | :------ | :---------------- |
| id             | `string`            | `null`  |  字段ID.       |
| name           | `string`            | `null`  |  显示的名称.       |
| isDim          | `boolean`            | `false` |  false是指标字段，true是维度字段.       |
| action *[Optional]* | `string`            | `null`  |  有些指标自带了动作类型 |
| isRate *[Optional]* | `boolean`            | `false`  |  是否以百分比显示 |

#### Granularity Property ###
| Property              | Type                | Default |    Description                            |
| :-------------------- | :------------------ | :------ | :---------------------------------------- |
| id                    | `string`            | `null`  |  字段ID.                                   |
| interval *[Optional]* | `number`            | `null`  |  表示时间的步长.                            |
| values  *[Optional]*  | `string[]`          | `false` |  用于分群等的条件.                          |
| counter *[Optional]*  | `string`            | `null`  | 时间的表示方式,counter=day,tick显示为"X天后" |

##License
