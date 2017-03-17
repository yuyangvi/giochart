/***
 * 文档
 */
import * as React from "react";
const siPrefix = (n: number): string => {
  // Math.对数相除
  const suffixArray = ["", "万", "亿", "万亿"];
  const suffixIndex = Math.max(0, Math.min(3, Math.floor(Math.log10(Math.abs(n)) / 4)));
  if (suffixIndex === 0 && Number.isInteger(n)) {
      return n.toString();
  }
  return (n * Math.pow(0.1, 4 * suffixIndex)).toPrecision(3) + suffixArray[suffixIndex];
}
const Aggregate = (props: any) => {
  const { data, period }  = props;
  return props.data ? (
    <div className="gr-chart-aggregate-info">
      <div className="gr-chart-aggregate-inner">
        <div className="gr-chart-aggregate-num">{siPrefix(props.data[0])}<span className="suffix" /></div>
        {data[1] ? <AggregatePercent percent={props.data[0] / props.data[1] - 1} period={props.period} /> : null}
      </div>
    </div>
  ) : null;
}

const AggregatePercent = (props: any) => (
  <div className="gr-chart-aggregate-percent">
    <div className={`gr-chart-trend-${props.percent > 0 ? "up" : "down"}`}>
      <t>{Math.abs(props.percent * 100).toPrecision(3)}</t>
      <t style={{ fontSize: 12 }}>%</t>
    </div>
    <span>{props.period ? "在最近7天" : "相比7天前"}</span>
  </div>
)

export default Aggregate;
