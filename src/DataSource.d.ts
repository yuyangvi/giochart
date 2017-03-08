/// <reference types="react" />
/***
 * 文档
 */
import { DataRequestProps, ResponseParams, DataLoaderProps } from './ChartProps';
import * as React from "react";
export declare const HttpStatus: {
    Ok: number;
    Created: number;
    NoContent: number;
    MovedPermanently: number;
    SeeOther: number;
    NotModified: number;
    BadRequest: number;
    Unauthorized: number;
    Forbidden: number;
    NotFound: number;
    MethodNotAllowed: number;
    NotAcceptable: number;
    RequestTimeout: number;
    UnsupportedEntity: number;
    Locked: number;
    TooManyRequests: number;
    InternalServerError: number;
    NotImplemented: number;
};
declare class DataSource extends React.Component<DataLoaderProps, any> {
    static childContextTypes: React.ValidationMap<any>;
    constructor(props: DataLoaderProps);
    getChildContext(): {
        columns: any;
        source: any;
        selected: any;
    };
    componentWillReceiveProps(nextProps: DataLoaderProps): void;
    render(): JSX.Element;
    defaultRequest(chartParams: DataRequestProps, callback: Function): void;
    componentDidMount(): void;
    afterFetch(chartData: ResponseParams): void;
}
export default DataSource;
