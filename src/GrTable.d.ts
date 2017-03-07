/// <reference types="react" />
/***
 * 文档
 */
import { ChartProps } from './ChartProps';
import * as React from "react";
declare class GrTable extends React.Component<ChartProps, any> {
    static contextTypes: React.ValidationMap<any>;
    static formatDate(v: number): string;
    private generateChartParams(columns);
    render(): JSX.Element;
}
export default GrTable;
