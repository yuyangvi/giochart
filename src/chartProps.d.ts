// 拉取数据的请求配置
export interface DataRequestProps {
  id?: string; // 打点必备
  name?: string; // 打点必备
  type?: string; // Enum: funnel, retention
  metrics?: Metric[]; // 指标
  dimensions?: string[]; // 维度
  granularities: Granulariy[]; // 粒度
  filter?: Filter; // 过滤
  timeRange: string; // 时间区域 day:8,1
  userTag?: string; // 用户分群ID
  limit?: number; // 数据行限制 10
  orders?: Order[]; // 排序
  aggregation?: boolean; // -- 是否需要返回聚合值
  aggregator?: string; // sum | avg | NULL -- 按照那种聚合函数做聚合
  attrs?: any; // 属性
  interval?: number; // 时间粒度 deperated
  expanded?: boolean; //
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
  orderType: "asc" | "desc"; // Enum
  action?: any;

}
interface Granulariy {
  id: string;
  interval?: string;
  period?: string;
  top?: number;
  values?: string[];
}

// 绘制接口  adjust?: string|string[]
export interface DrawParamsProps {
  aggregator?: any;
  adjust?: string;
  chartType: string;
  colorTheme?: string;
  columns: Metric[];
  granularities?: Granulariy[];
  groupCol?: string;
  attrs?: Additional;
  timeRange?: string;
}
export interface Metric {
  id: string;
  name?: string;
  action?: string;
  isDim?: boolean;
  interval?: number;
  isRate?: boolean;
  counter?: string;
  formatterMap?: any;
  values?: string[];
  metricId?: any;
}

export interface Additional {
  selection?: number[];
  userType?: string;
  range?: string;
  metricType?: string;
  comment?: string;
  period?: number;
  timeRange?: string;
  metrics?: any;
}

// ResponseParams
export interface ResponseParams {
  meta: {
    aggregator?: any;
    offset?: number;
    columns: Metric[];
  };
  data: number[][];
}

export type Source = Array<{[column: string]: number|string}>;

export interface DataLoaderProps {
  hashKeys?: string;
  params: DataRequestProps;
  source?: Source;
  sourceHook?: (source: Source) => Source;
  sourceUrl?: string;
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
  startTime?: number;
  trackWords?: any;
  isThumb?: boolean;
  sortHandler?: any;
  onFiltered?: (dim: string, filterNames: string[]) => void;
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
  sortHandler?: (evt: any) => any;
  isThumb?: boolean;
  timeRange?: string;
  attrs?: any;
}

interface LinearScale {
  nice?: boolean; // 默认为 true，用于优化数值范围，使绘制的坐标轴刻度线均匀分布。例如原始数据的范围为 [3, 97]，如果 nice 为 true，那么就会将数值范围调整为 [0, 100]
  min?: number; // 定义数值范围的最小值
  max?: number; // 定义数值范围的最大值
  tickCount?: number; // 定义坐标轴刻度线的条数，默认为 5
  tickInterval?: number; // 用于指定坐标轴各个刻度点的间距，为原始数据值的差值，tickCount 和 tickInterval 不可以同时声明
}
interface TimeScale {
  mask: string;
}
interface CatScale {
  values: string[];
}

export interface GioProps {
  adjust?: string;
  chartType: string;
  colorTheme?: string;
  params: DataRequestProps;
  extraColumns?: any;
  groupCol?: string;
  sourceUrl?: string;
  cacheOptions?: any;
  isThumb?: boolean;
}

export interface G2Scale {
  type: string;
  formatter?: (n: string|number) => string;
  range?: [number, number];
  alias?: string;
  tickCount?: number;
  tickInterval?: number;
  ticks?: string[];
  mask?: string;
  nice?: boolean;
  min?: number;
  max?: number;
  values?: string[];
  mapValues?: string[];
}
export interface SourceConfig {
  [colName: string]: G2Scale;
}

export interface ChartDimValues {
  id: string;
  dimValues: string[];
}
