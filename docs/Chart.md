#Chart
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

#### Chart Step #####
画图分为几个步骤，不同的步骤配置决定了图表的区别

| Property | Value | Desc |
| :------- | :---- | :-------- |
| geom     | line / area / interval | 描述视觉映射 |
| shape    | `string` | 描述视觉形状 |
| size     | `number` | 描述视觉的大小，主要是线的宽度 |
| combineMetrics | `boolean` | 合并指标为一个新的指标维度 |
| label    | `boolean` | 显示标签 |
| skipMetric | `boolean` | 不可以画出来但是要在tooltip里出现 |
| legendPosition | top / bottom | 描述Legend位置 |
| axis | `boolean` | 显示轴 |
| tooltip | `boolean` | 显示提示 |
| hideAxis | `boolean` | 隐藏轴 |
| tooltipchange | custom | 自定义的提示信息 |
| colorTheme | `r,g,b` | 主题色 |
| pos | MM/MD/MMD | MM：XY轴指标乘指标，MD:指标乘维度 MMD: 双指标乘维度 |

#### License ####
