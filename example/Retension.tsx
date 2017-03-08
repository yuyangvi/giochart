import * as React from 'react';
import {DataRequestProps, DrawParamsProps} from '../src/ChartProps';
import SyntheticEvent = React.SyntheticEvent;
import Chart from '../src/Chart';
import DataSource from "../src/DataSource";
import GioChart from '../src/index';
interface EventSeletorTarget extends EventTarget {
    value: string
}

const retensionRequestParams: DataRequestProps = {
  "type": "retention",
  "metrics": [{"id": "woV73y92", "level": "simple", "action": "page"}, {"id": "9yGbpp8x", "level": "complex"}],
  "dimensions": ["rt"],
  "granularities": [{"id": "rt", "values": ["外部链接"]}],
  "timeRange": "day:8,1",
  "attrs": {"userType": "nuv"}
}

const retensionDrawParams: DrawParamsProps = {
  chartType: 'line',
  columns:[
      {"id":"tm","name":"时间", isDim: true},
      {"id":"0gw432","name":"访问用户量", isDim: false}
  ],
  granularities: [{"id": "tm", "interval": 86400 }]
};
class Retension extends React.Component<any, any> {
    public render() {
        return (
            <DataSource params={retensionRequestParams} sourceUrl="/assets/demo.json">
                <Chart chartParams={retensionDrawParams} />
            </DataSource>
        );
    }
}
export default Retension;
