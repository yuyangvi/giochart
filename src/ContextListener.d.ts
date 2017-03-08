/// <reference types="react" />
import * as React from "react";
import { SingleChartProps } from "./ChartProps";
declare class ContextListener extends React.Component<SingleChartProps, any> {
    private static contextTypes;
    render(): JSX.Element;
    private generateChartParams();
}
export default ContextListener;
