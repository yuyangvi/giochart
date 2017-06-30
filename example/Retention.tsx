import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const retentionData: Source = [
  { tm: 0, retention_rate: 1.0, retention: 1e4 },
  { tm: 1, retention_rate: 0.16, retention: 1600 },
  { tm: 2, retention_rate: 0.09279, retention: 928 },
  { tm: 3, retention_rate: 0.08293, retention: 830 },
  { tm: 4, retention_rate: 0.09262, retention: 926 },
  { tm: 5, retention_rate: 0.08579, retention: 857 },
  { tm: 6, retention_rate: 0.08449, retention: 844 },
  { tm: 7, retention_rate: 0.06176, retention: 617 },
  { tm: 8, retention_rate: 0.03571, retention: 346 },
  { tm: 9, retention_rate: 0.06173, retention: 617 },
  { tm: 10, retention_rate: 0.09349, retention: 934 },
  { tm: 11, retention_rate: 0.09509, retention: 950 },
  { tm: 12, retention_rate: 0.07534, retention: 753 },
];

const chartParams: DrawParamsProps = {
  adjust: "stack",
  chartType: "retention",
  columns: [
    { id: "tm", name: "时间", isDim: true, isRate: false, counter: "day" },
    { id: "retention", name: "留存", isDim: false, isRate: false }
  ],
};

const Retention = (props: any) => (
  <Chart chartParams={chartParams} source={retentionData} />
);
export default Retention;
