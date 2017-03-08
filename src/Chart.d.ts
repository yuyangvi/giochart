/// <reference types="react" />
import * as React from "react";
import { ChartProps } from "./ChartProps";
declare class Chart extends React.Component<ChartProps, any> {
    private chart;
    private lastSelectedShape;
    private constructor(props);
    render(): JSX.Element;
    private componentWillReceiveProps(nextProps);
    private changeData(source);
    private componentDidMount();
    private componentWillUnmount();
    private drawChart(chartParams, source);
    private selectHandler(ev, selectCols);
    private buildSourceConfig(chartParams);
}
export default Chart;
