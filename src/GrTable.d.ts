/// <reference types="react" />
/***
 * 文档
 */
import { ChartProps } from './ChartProps';
import * as React from "react";
declare class GrTable extends React.Component<ChartProps, any> {
    static formatDate(v: number): string;
    private static getRowKey(r, i);
    render(): JSX.Element;
}
export default GrTable;
