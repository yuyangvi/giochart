/**
 * Created by yuyang on 2017/2/3.
 */
//数据统计必备字段，中端需要以下字段提供数据
interface Filter {
  op: string;
  key: string;
  value: string;
  name: string;
}
interface Filters {
  exprs: Filter[];
  op: string;
}
//数据统计必备字段，中端需要以下字段提供数据
export interface ChartParamsProps {
  /* 数据统计的规则 'sum' or 'avg' */
  aggregateType:string;
  /* 指标 */
  metrics: Metric[];
  /* 维度 */
  dimensions: Meta[];
  /* 咱不知道是啥,好像没用 */
  period: number;
  /* 筛选条件 */
  filter: Filters[] | Filter | {};
  /* 周期,如day:8,1 */
  timeRange: string;
  /* 粒度 */
  interval: number;
  //排序 */
  orders?: string | null;
  /* 前xx条 */
  top?: number
//}
//interface ChartParams {//留供前端识别的数据，中端只帮着保存，不参考它取数据
  /* 图表ID */
  id: string;
  name: string;
  /* 图表类型 */
  chartType: string;
  /* 不知道做啥的 */
  status: string;
  /* 包含颜色信息等配置信息杂项 */
  attrs: any;
  /* 创建者信息 */
  createdAt: number;
  creator: string;
  creatorId: string;
  /* 修改者信息 */
  updatedAt: number;
  updater: string;
  updaterId: string;
  //subscribed、subscriptionId	新版没有订阅,应该是没用了
  userTag?: string;
  versionNumber?: number;
  visibleTo?: any;
}
interface Metric {
  id: string;
  level: string;
  action?: string;
}
export interface Meta {
  id: string;
  isDim: boolean;
  name: string;
  metricId?: Metric;
  isStatic?: boolean;
}
export interface ChartDataProps {
  data: number[][];
  meta: Meta[];
  desc: any;
}
export interface GrChartProps {
  chartParams: ChartParamsProps;
  chartData?: ChartDataProps;
}