import * as React from "react";
import { DrawParamsProps, Source} from "../src/ChartProps";
import Chart from "../src/Chart";

const month = JSON.parse('{"adjust":"dodge","aggregator":null,"chartType":"area","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"PDjgVV6l","name":"登录用户量","isDim":false,"metricId":{"id":"PDjgVV6l","level":"complex"},"isRate":false}],"granularities":[{"id":"tm","interval":2592000000}],"timeRange":"abs:1504022400000,1504367999999","attrs":{"metricType":"none"}}');
const months = JSON.parse('[{"tm":1501516800000,"PDjgVV6l":2755},{"tm":1504195200000,"PDjgVV6l":1968}]');

const week = JSON.parse('{"adjust":"dodge","aggregator":null,"chartType":"area","columns":[{"id":"tm","name":"时间","isDim":true,"isRate":false},{"id":"PDjgVV6l","name":"登录用户量","isDim":false,"metricId":{"id":"PDjgVV6l","level":"complex"},"isRate":false}],"granularities":[{"id":"tm","interval":604800000}],"timeRange":"abs:1504022400000,1504886399999","attrs":{"metricType":"none"}}');
const weeks = JSON.parse('[{"tm":1503849600000,"PDjgVV6l":3453},{"tm":1504454400000,"PDjgVV6l":4254}]');

const EasyChart = (props: any) => (
  <Chart chartParams={week} source={weeks} />
);
export default EasyChart;
