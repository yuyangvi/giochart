import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
import { retentionSourceSelector } from "../src/utils";
const retentionData: Source = [
  { tm: 0,
    retention_rate_0: 1.0, retention_0: 1e4,
    retention_rate_1: 0.16, retention_1: 1600,
    retention_rate_2: 0.09279, retention_2: 928,
    retention_rate_3: 0.08293, retention_3: 830,
    retention_rate_4: 0.09262, retention_4: 926,
    retention_rate_5: 0.08579, retention_5: 857,
    retention_rate_6: 0.08449, retention_6: 844,
    retention_rate_7: 0.06176, retention_7: 617,
    retention_rate_8: 0.03571, retention_8: 346,
    retention_rate_9: 0.06173, retention_9: 617,
    retention_rate_10: 0.09349, retention_10: 934,
    retention_rate_11: 0.09509, retention_11: 950,
    retention_rate_12: 0.07534, retention_12: 753
  },
  { tm: 149,
    retention_rate_0: 1.0, retention_0: 1e4,
    retention_rate_1: 0.16, retention_1: 1600,
    retention_rate_2: 0.09279, retention_2: 928,
    retention_rate_3: 0.08293, retention_3: 830,
    retention_rate_4: 0.09262, retention_4: 926,
    retention_rate_5: 0.08579, retention_5: 857,
    retention_rate_6: 0.08449, retention_6: 844,
    retention_rate_7: 0.06176, retention_7: 617,
    retention_rate_8: 0.03571, retention_8: 346,
    retention_rate_9: 0.06173, retention_9: 617,
    retention_rate_10: 0.09349, retention_10: 934,
    retention_rate_11: 0.09509, retention_11: 950,
    retention_rate_12: 0.07534, retention_12: 753
  },
];

const chartParams: DrawParamsProps = {
  adjust: "stack",
  chartType: "retention",
  columns: [
    { id: "tm", name: "时间", isDim: true, isRate: false, counter: "day" },
    { id: "retention", name: "留存", isDim: false, isRate: false }
  ],
};
const a = retentionSourceSelector(retentionData, ["tm"], true);
const Retention = (props: any) => (
  <Chart chartParams={chartParams} source={a} />
);
export default Retention;
