/***
 * 文档
 */
import * as React from "react";
import { formatNumber, formatPercent } from "./utils";

const Aggregate = (props: any) => {
  const { data, period }  = props;
  return props.data ? (
    <div className="gr-chart-aggregate-info">
      <div className="gr-chart-aggregate-inner">
        <div className="gr-chart-aggregate-num">{props.isRate ? formatPercent(props.data[0]) : formatNumber(props.data[0])}<span className="suffix" /></div>
        {data[1] ? <AggregatePercent percent={props.data[0] / props.data[1] - 1} period={props.period} /> : null}
      </div>
    </div>
  ) : null;
};

const AggregatePercent = (props: any) => (
  <div className="gr-chart-aggregate-percent">
    <div className={`gr-chart-trend-${props.percent > 0 ? "up" : "down"}`}>
      <svg className="svg-icon">
        <use href={`#icon-${props.percent > 0 ? "up" : "down"}-trend`} />
      </svg>
      <span>{formatPercent(Math.abs(props.percent)).slice(0, -1)}</span>
      <span style={{ fontSize: 12 }}>%</span>
    </div>
    <span className="gr-chart-trend-desc">{props.period ? "在最近7天" : "相比7天前"}</span>
  </div>
);

export default Aggregate;
