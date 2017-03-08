GrTable
##usage
```
import { GrTable } from 'giochart';

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
React.render(<GrTable chartParams={chartParams} source={source} />, mountNode);
```
##Props
* chartParams: 显示字段
* extraCols在右侧添加的字段，格式参考rc-table的columns里的设置
* source: 数据源，一个固定的JSON数组

####Property

| Property              | Type                | Default |    Description    |
| :-------------------- | :------------------ | :------ | :---------------- |
| chartParams           | `DrawParams`        | `null`  |      绘图必需配置   |
| source                | `JSON[]`            | `null`  |       数据源       |
| extraCols             | `Column` `Column[]` | `null`  |  表格的扩展         |

