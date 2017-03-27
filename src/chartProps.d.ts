// 拉取数据的请求配置
export interface DataRequestProps {
  id?: string;
  type?: string; // Enum: funnel, retention
  metrics: Metric[]; // 指标
  dimensions: string[]; // 维度
  granularities: Granulariy[]; // 粒度
  filter?: Filter[]; // 过滤
  timeRange: string; // 时间区域 day:8,1
  userTag?: string; // 用户分群ID
  limit?: number; // 数据行限制 10
  orders?: Order[]; // 排序
  aggregation?: boolean; // -- 是否需要返回聚合值
  aggregator?: string; // sum | avg | NULL -- 按照那种聚合函数做聚合
  attrs?: any; // 属性
  interval?: number; // 时间粒度 deperated
}
interface Filter {
  op: string;
  key: string;
  value: string;
  name?: string;
}

interface Order {
  id: string;
  isDim: boolean;
  orderType: string; // Enum
}
interface Granulariy {
  id: string;
  interval?: number;
  period?: string;
  top?: number;
  values?: string[];
}

// 绘制接口
export interface DrawParamsProps {
  adjust?: string;
  chartType: string;
  columns: Metric[];
  granularities?: Granulariy[];
  groupCol?: string;
}
export interface Metric {
  id: string;
  name?: string;
  action?: string;
  isDim?: boolean;
  interval?: number;
  isRate?: boolean;
}

// ResponseParams
export interface ResponseParams {
  meta: {
    aggregates?: any;
    offset?: number;
    columns: Metric[];
  };
  data: number[][];
}

export type Source = Array<{[column: string]: number}>;

export interface DataLoaderProps {
  hashKeys?: string;
  style?: any;
  params: DataRequestProps;
  sourceUrl?: string;
  source?: Source;
  onLoad?: (state: any) => void;
  cacheOptions?: {
    ttl: number;
  };
}

// 标准Chart
export interface ChartProps {
  chartParams: DrawParamsProps;
  colorTheme?: string;
  source: Source;
  select?: (evt: any, unselect: any) => any;
  selected?: any;
  extraColumns?: any;
  style?: any;
}
// 字段是从数据源取得的Chart的格式
export interface SingleChartProps {
  adjust?: string;
  chartType?: string;
  colorTheme?: string;
  chartParams?: DrawParamsProps;
  extraColumns?: any;
  granularities?: Granulariy[];
  select?: (evt: any, unselect: any) => any;
  groupCol?: string;
  range?: boolean;
}
