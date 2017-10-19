import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const c = JSON.parse('{"adjust":"dodge","aggregator":null,"chartType":"line","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"P2N0EE6Z","name":"跳出率","isDim":false,"metricId":{"id":"P2N0EE6Z","level":"complex"},"isRate":true},{"id":"PWq7nnvv","name":"新访问用户量","isDim":false,"metricId":{"id":"PWq7nnvv","level":"complex"},"isRate":false}],"granularities":[{"id":"tm","interval":86400000}],"timeRange":"day:8,1","attrs":{"metricType":"none"}}');
const s = JSON.parse('[{"tm":1507219200000,"P2N0EE6Z":0.4446601941747573,"PWq7nnvv":1017},{"tm":1507305600000,"P2N0EE6Z":0.468384074941452,"PWq7nnvv":1120},{"tm":1507392000000,"P2N0EE6Z":0.4359908883826879,"PWq7nnvv":1348},{"tm":1507478400000,"P2N0EE6Z":0.3606280193236715,"PWq7nnvv":2820},{"tm":1507564800000,"P2N0EE6Z":0.35736318976350967,"PWq7nnvv":3036},{"tm":1507651200000,"P2N0EE6Z":0.35590745732255163,"PWq7nnvv":2933},{"tm":1507737600000,"P2N0EE6Z":0.36173543553617354,"PWq7nnvv":2946}]');

const c1 = JSON.parse('{"adjust":"dodge","aggregator":null,"chartType":"line","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"oVxvKK6d","name":"访问量","isDim":false,"metricId":{"id":"oVxvKK6d","level":"complex"},"isRate":false},{"id":"PWq7nnvv","name":"新访问用户量","isDim":false,"metricId":{"id":"PWq7nnvv","level":"complex"},"isRate":false}],"granularities":[{"id":"tm","interval":86400000}],"timeRange":"day:8,1","attrs":{"metricType":"none"}}');
const s1 = JSON.parse('[{"tm":1507219200000,"oVxvKK6d":1545,"PWq7nnvv":1017},{"tm":1507305600000,"oVxvKK6d":1708,"PWq7nnvv":1120},{"tm":1507392000000,"oVxvKK6d":2195,"PWq7nnvv":1348},{"tm":1507478400000,"oVxvKK6d":8280,"PWq7nnvv":2820},{"tm":1507564800000,"oVxvKK6d":8753,"PWq7nnvv":3036},{"tm":1507651200000,"oVxvKK6d":8904,"PWq7nnvv":2933},{"tm":1507737600000,"oVxvKK6d":8943,"PWq7nnvv":2946}]');

const EasyChart = (props: any) => (
  <Chart chartParams={c} source={s} />
);
export default EasyChart;
