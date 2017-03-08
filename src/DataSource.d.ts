/// <reference types="react" />
import * as React from "react";
import { DataLoaderProps } from "./ChartProps";
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
    private static childContextTypes;
    private constructor(props);
    render(): JSX.Element;
    private getChildContext();
    private componentWillReceiveProps(nextProps);
    private defaultRequest(chartParams, callback);
    private componentDidMount();
    private afterFetch(chartData);
}
export default DataSource;
