import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";
// import ContextListener from "../src/ContextListener";
const chartParams: DrawParamsProps = {"aggregator":[0.07692307692307693],"chartType":"funnel","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"conversion","name":"转化人数","isDim":false,"isRate":false},{"id":"conversion_rate","name":"转化率","isDim":false,"isRate":true}]};
const source: Source = [{"tm":1504195200000,"metric_name":"总转化率","conversion":4,"conversion_rate":0.012903225806451613},{"tm":1504281600000,"metric_name":"总转化率","conversion":0,"conversion_rate":0},{"tm":1504368000000,"metric_name":"总转化率","conversion":0,"conversion_rate":0},{"tm":1504454400000,"metric_name":"总转化率","conversion":1,"conversion_rate":0.027777777777777776},{"tm":1504540800000,"metric_name":"总转化率","conversion":2,"conversion_rate":0.004878048780487805},{"tm":1504627200000,"metric_name":"总转化率","conversion":1,"conversion_rate":0.029411764705882353},{"tm":1504713600000,"metric_name":"总转化率","conversion":5,"conversion_rate":0.010638297872340426},{"tm":1504800000000,"metric_name":"总转化率","conversion":2,"conversion_rate":0.007692307692307693},{"tm":1504886400000,"metric_name":"总转化率","conversion":1,"conversion_rate":0.007142857142857142},{"tm":1504972800000,"metric_name":"总转化率","conversion":0,"conversion_rate":0},{"tm":1505059200000,"metric_name":"总转化率","conversion":6,"conversion_rate":0.010909090909090909},{"tm":1505145600000,"metric_name":"总转化率","conversion":6,"conversion_rate":0.01111111111111111},{"tm":1505232000000,"metric_name":"总转化率","conversion":4,"conversion_rate":0.010526315789473684},{"tm":1505318400000,"metric_name":"总转化率","conversion":4,"conversion_rate":0.008888888888888889}];
const Funnel = (props: any) => (
    <Chart chartParams={chartParams} source={source} />
);
export default Funnel;
