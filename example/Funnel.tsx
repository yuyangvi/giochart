import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
// import ContextListener from "../src/ContextListener";
const chartParams: DrawParamsProps = {
  aggregator: { values: [0.10658520027155464, 0.10658520027155464], offset: 2 },
  chartType: "funnel",
  columns: [
    { id: "tm", name: "时间", isDim: true, isRate: false },
    { id: "metric_name", name: "指标", isDim: true, isRate: false },
    { id: "conversion_rate", name: "转化率", isDim: false, isRate: true },
    { id: "conversion", name: "转化人数", isDim: false, isRate: false }

  ]
};
const source: Source = [
  { tm: 1498665600000, metric_name: "总转化率", conversion: 35, conversion_rate: 0.059726962457337884 },
  { tm: 1498665600000, metric_name: "第 1 步转化率", conversion: 35, conversion_rate: 0.059726962457337884 },
  { tm: 1498752000000, metric_name: "总转化率", conversion: 31, conversion_rate: 0.05961538461538462 },
  { tm: 1498752000000, metric_name: "第 1 步转化率", conversion: 31, conversion_rate: 0.05961538461538462 },
  { tm: 1498838400000, metric_name: "总转化率", conversion: 7, conversion_rate: 0.04827586206896552 },
  { tm: 1498838400000, metric_name: "第 1 步转化率", conversion: 7, conversion_rate: 0.04827586206896552 },
  { tm: 1498924800000, metric_name: "总转化率", conversion: 1, conversion_rate: 0.008771929824561403 },
  { tm: 1498924800000, metric_name: "第 1 步转化率", conversion: 1, conversion_rate: 0.008771929824561403 },
  { tm: 1499011200000, metric_name: "总转化率", conversion: 32, conversion_rate: 0.05324459234608985 },
  { tm: 1499011200000, metric_name: "第 1 步转化率", conversion: 32, conversion_rate: 0.05324459234608985 },
  { tm: 1499097600000, metric_name: "总转化率", conversion: 33, conversion_rate: 0.0616822429906542 },
  { tm: 1499097600000, metric_name: "第 1 步转化率", conversion: 33, conversion_rate: 0.0616822429906542 },
  { tm: 1499184000000, metric_name: "总转化率", conversion: 28, conversion_rate: 0.052336448598130844 },
  { tm: 1499184000000, metric_name: "第 1 步转化率", conversion: 28, conversion_rate: 0.052336448598130844 },
  { tm: 1499270400000, metric_name: "总转化率", conversion: 31, conversion_rate: 0.05565529622980251 },
  { tm: 1499270400000, metric_name: "第 1 步转化率", conversion: 31, conversion_rate: 0.05565529622980251 },
  { tm: 1499356800000, metric_name: "总转化率", conversion: 23, conversion_rate: 0.04220183486238532 },
  { tm: 1499356800000, metric_name: "第 1 步转化率", conversion: 23, conversion_rate: 0.04220183486238532 },
  { tm: 1499443200000, metric_name: "总转化率", conversion: 3, conversion_rate: 0.025423728813559324 },
  { tm: 1499443200000, metric_name: "第 1 步转化率", conversion: 3, conversion_rate: 0.025423728813559324 },
  { tm: 1499529600000, metric_name: "总转化率", conversion: 1, conversion_rate: 0.009345794392523364 },
  { tm: 1499529600000, metric_name: "第 1 步转化率", conversion: 1, conversion_rate: 0.009345794392523364 },
  { tm: 1499616000000, metric_name: "总转化率", conversion: 38, conversion_rate: 0.06354515050167224 },
  { tm: 1499616000000, metric_name: "第 1 步转化率", conversion: 38, conversion_rate: 0.06354515050167224 },
  { tm: 1499702400000, metric_name: "总转化率", conversion: 35, conversion_rate: 0.0641025641025641 },
  { tm: 1499702400000, metric_name: "第 1 步转化率", conversion: 35, conversion_rate: 0.0641025641025641 },
  { tm: 1499788800000, metric_name: "总转化率", conversion: 31, conversion_rate: 0.05938697318007663 },
  { tm: 1499788800000, metric_name: "第 1 步转化率", conversion: 31, conversion_rate: 0.05938697318007663 }
];
const Funnel = (props: any) => (
    <Chart chartParams={chartParams} source={source} />
);
export default Funnel;
