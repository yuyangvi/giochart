import * as G2 from "g2";
import { assign, filter, flatten, map, reject, transform, pick } from "lodash";
import { Source } from "./chartProps";
/**
 * 数字格式
 * @param n
 * @returns {string}
 */

export const formatNumber = (n: number): string => {
  if (typeof n !== "number") {
    return n;
  }
  // Math.对数相除
  const suffixArray = ["", "万", "亿", "万亿"];
  const suffixIndex = Math.max(0, Math.min(3, Math.floor(Math.log10(Math.abs(n)) / 4)));
  if (suffixIndex < 1) {
    if (Number.isInteger(n)) {
      return `${n}`;
    }
    return parseFloat(n.toPrecision(3)).toString();
  }
  return parseFloat((n * Math.pow(0.1, 4 * suffixIndex)).toPrecision(3)) + suffixArray[suffixIndex];
};
export const formatPercent = (n: number): string => {
  if (typeof n !== "number") {
    return n;
  }
  if (!n) { // 如果n是0
    return "0%";
  }
  if (0 < n && n < 0.001) {
    return "< 0.1%";
  } else if (0 > n && n > 0.001) {
    return "> -0.1%";
  }
  return `${parseFloat((100 * n).toPrecision(3))}%`;
}
// 计量时间区间
export const calculateTimeRange = (timeRange: string) => {
  if (!timeRange) {
    timeRange = "day:8,1";
  }
  const [cate, v] = timeRange.split(":");
  const [start, end] = v.split(",");
  if (cate === "day") {
    return parseInt(start, 10) * 864e5;
  } else if (cate === "abs") {
    return parseInt(end, 10) - parseInt(start, 10);
  }
}

// countTimeCount
export const countTickCount = (frame: any, width: number) => {
  const range = G2.Frame.range(frame, "tm");
  const tmLength: number = G2.Frame.group(frame, ["tm"]).length;
  // TODO: 计算tickInterval
  const [startTime, endTime] = G2.Frame.range(frame, "tm");
  const interval = (endTime - startTime)  / width * 80;
  if (endTime - startTime > 86400000) {
    return Math.ceil(interval / 86400000) * 86400000;
  } else {
    return Math.ceil(interval / 3600000) * 3600000;
  }
}

// 根据留存的数据源图形进行处理
export const retentionSourceSelector = (source: Source, dimCols: string[], overTime: boolean): Source => {
  const filterSource = (overTime ? reject : filter)(source, { tm: 0 });
  // 记录需要保留的字段
  if (overTime) {
    // 挑选里面的字段第1，7，14天
    const results = map(filterSource, (n) => pick(n, dimCols.concat(
      [
        "retention_1", "retention_rate_1",
        "retention_7", "retention_rate_7",
        "retention_14", "retention_rate_14"
      ]
    ))) as Source;
    return results;
  }
  const lastResult = map(filterSource, (s) => {
    const reservedObj = pick(s, dimCols);

    const combinedResults = transform(s, (result: any[], value, key: string) => {
      const matches: string[] = key.match(/^(retention(?:_rate)?)_(\d+)$/);
      if (matches) {
        const retention = parseInt(matches[2], 10);
        if (!result[retention]) {
          result[retention] = {};
        }
        result[retention][matches[1]] = value;
      }
    }, []);
    return map(combinedResults, (n, i) => assign(n, reservedObj, { turn: i }));
  });
  return flatten(lastResult);
}

