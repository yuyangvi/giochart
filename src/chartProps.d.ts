// 拉取数据的请求配置
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
  attrs?: any; // 属性
  interval?: number; // 时间粒度 deperated
}
interface Filter {
  op: string;
  key: string;
  value: string;
}

interface Order {
  id: string;
  isDim: boolean;
  orderType: string;//Enum
}
interface Granulariy {
  id: string;
  interval?: number;
  period?: number;
  top?: number;
  values?: string[];
}

// 绘制接口
export interface DrawParamsProps {
  adjust?: string;
  chartType: string;
  columns: Metric[];
  granularities?: Granulariy[];
}
export interface Metric {
  id: string;
  name?: string;
  action?: string;
  isDim?: boolean;
  isRate?: boolean;
}

// ResponseParams
export interface ResponseParams {
  meta: {
    columns: Metric[];
  },
  data: {
    [k: number]: number[];
  }
}

export type Source = Array<{[column: string]: number}>;

export interface DataLoaderProps {
  style?: any;
  params: DataRequestProps;
  sourceUrl?: string;
  source?: Source;
  onLoad?: (state: any) => void
}

// 标准Chart
export interface ChartProps {
  chartParams: DrawParamsProps;
  source: Source;
  select?: (evt: any, unselect: any) => any;
  selected?: any;
  extraColumns?: any;
}
// 字段是从数据源取得的Chart的格式
export interface SingleChartProps {
  adjust?: string;
  chartType?: string;
  chartParams?: DrawParamsProps;
  granularities?: Granulariy[];
  select?: (evt: any, unselect: any) => any;
}