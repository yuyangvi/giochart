Retension/// <reference types="react" />
import * as React from 'react';
import { DataRequestProps } from '../src/ChartProps';
declare class Demo extends React.Component<any, any> {
    dataSource: React.Component<any, any>;
    params: DataRequestProps;
    selected: Object[];
    constructor();
    addDimension(dim: string[], modeValue: boolean): void;
    select(metaSelected: any, metaUnselected: any): void;
    render(): JSX.Element;
}
export default Demo;
