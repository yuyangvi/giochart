import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const retentionData: Source = [
  { tm: 1486310400000, a9amn3z9: 0.31365313653136534 },
  { tm: 1486915200000, a9amn3z9: 0.3091528724440117 },
  { tm: 1487520000000, a9amn3z9: 0.3225331369661267 },
  { tm: 1488124800000, a9amn3z9: 0.3044965786901271 },
  { tm: 1488729600000, a9amn3z9: 0.2935533384497314 },
  { tm: 1489334400000, a9amn3z9: 0.2718002812939522 },
  { tm: 1489939200000, a9amn3z9: 0.275931117340809 },
  { tm: 1490544000000, a9amn3z9: 0.2793682132280355 },
  { tm: 1491148800000, a9amn3z9: 0.2717611336032389 },
  { tm: 1491753600000, a9amn3z9: 0.2850168982350732 },
  { tm: 1492358400000, a9amn3z9: 0.2859069453809845 },
  { tm: 1492963200000, a9amn3z9: 0.281767955801105 },
  { tm: 1493568000000, a9amn3z9: 0.2895622895622896 },
  { tm: 1494172800000, a9amn3z9: 0.2318319977894446 },
  { tm: 1494777600000, a9amn3z9: 0.26295244854506744 },
  { tm: 1495382400000, a9amn3z9: 0.2718579234972678 },
  { tm: 1495987200000, a9amn3z9: 0.2485242030696576 },
  { tm: 1496592000000, a9amn3z9: 0.2621199671322925 },
  { tm: 1497196800000, a9amn3z9: 0.25036390101892286 },
  { tm: 1497801600000, a9amn3z9: 0.24836601307189543 },
  { tm: 1498406400000, a9amn3z9: 0.2526847757422615 },
  { tm: 1499011200000, a9amn3z9: 0.25809151785714285 },
  { tm: 1499616000000, a9amn3z9: 0.2807326523423741 },
  { tm: 1500220800000, a9amn3z9: 0.27702702702702703 },
  { tm: 1500825600000, a9amn3z9: 0.2863700564971751 },
  { tm: 1501430400000, a9amn3z9: 0.25229357798165136 }
];

const chartParams: DrawParamsProps = {
  adjust: "stack",
  chartType: "line",
  columns: [
    { id: "tm", name: "时间", isDim: true, isRate: false},
    { id: "a9amn3z9", name: "总体转化率", isDim: false, isRate: true}
  ],
  granularities: [{ id: "tm", interval: 6048e5 }]
};
const WeekChart = (props: any) => (
  <Chart chartParams={chartParams} source={retentionData} />
);
export default WeekChart;
