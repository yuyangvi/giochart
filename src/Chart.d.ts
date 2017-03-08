/// <reference types="react" />
import * as React from "react";
import { ChartProps } from "./ChartProps";
declare class Chart extends React.Component<ChartProps, any> {
    private static contextTypes;
    private chart;
    private selectMode;
    private lastSelectedShape;
    private constructor(props);
    private componentWillReceiveProps(nextProps, nextContext);
    private generateChartParams(columns);
    render(): JSX.Element;
    private componentDidMount();
    private componentWillUnmount();
    private drawChart(chartParams, source);
    private selectHandler(ev, selectCols);
    private buildSourceConfig(chartParams);
}
export default Chart;
