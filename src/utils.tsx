import * as G2 from "g2";
import * as moment from "moment";
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

export const getRowIndex = (tickCount: number, rows: number): number[] => {

};

export const filterValuesByTickCount = (tickCount: number, values: string[]): string[] => {
  const step = Math.floor((values.length - 1) / (tickCount - 1));

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
    return (parseInt(start, 10) - parseInt(end, 10)) * 864e5;
  } else if (cate === "abs") {
    return parseInt(end, 10) - parseInt(start, 10);
  } else if (cate === "week") {
    return (parseInt(start, 10) - parseInt(end, 10)) * 6048e5;
  } else if  (cate === "month") {
    return (parseInt(start, 10) - parseInt(end, 10)) * 25920e5;
  }
}

// 如果是要从倍数里面去取，小时要照顾到天
export const countTickCount = (frame: any, width: number, tmInterval: number) => {
  const range = G2.Frame.range(frame, "tm");
  const tmLength: number = G2.Frame.group(frame, ["tm"]).length;
  // TODO: 计算tickInterval

  const [startTime, endTime] = G2.Frame.range(frame, "tm");
  const interval = (endTime - startTime)  / width * 80;
  if (endTime - startTime > tmInterval) {
    return Math.ceil(interval / tmInterval) * tmInterval;
  } else if (endTime - startTime > 86400000) {
    return Math.ceil(interval / 86400000) * 86400000;
  } else {
    const ceilNum =  Math.ceil(interval / 3600000);
    // 取大于divisor的24的约数
    const divisor = [24, 12, 8, 6, 4, 3, 2, 1].reduce((b, n) => (ceilNum > n ? b : n));
    return (divisor * 3600000);
  }
}

export const getTmFormat = (tmInterval: number) => {
  if (tmInterval > 6048e5) { // 按月
    return (v: number) => moment.unix(v / 1000).format("MMMM");
  } else if (tmInterval === 6048e5) { // 按周
    return (v: number) => (
      `${moment.unix(v / 1000).format("MM-DD ddd")} 到 ${moment.unix(v / 1000).endOf("week").format("MM-DD ddd")}`
    );
  } else if (tmInterval === 864e5) { // 按天
    return (v: number) => moment.unix(v / 1000).format("MM-DD ddd");
  } else if (tmInterval === 36e5) { // 按小时
    return (v: number) => moment.unix(v / 1000).format("MM-DD ddd HH:mm");
  }
  return (v: number) => moment.unix(v / 1000).format("MM-DD ddd");
}
export const getAxisFormat = (tmInterval: number) => {
  if (tmInterval === 6048e5) { // 按周
    return (n: string) => n.slice(0, 8);
  } else if (tmInterval === 36e5) {
    return (n: string) => {
      const matches = n.split(" ");
      return (matches[1] === "00:00") ? matches[0] : matches[1];
    };
  }
  return;
}
// 根据调整
export const retentionIntervalColumns = (interval: number, timeRange: string): string[] => {
  const mx = Math.floor(calculateTimeRange(timeRange) / interval);
  let result: number[] = [];
  if (interval === 6048e5) {
    result = [1, 2, 3, 4];
  } else if (interval === 25920e5) {
    result = [1, 2, 3];
  } else if (interval === 864e5) {
    result = [1, 7, 14, 30];
  }
  return map(filter(result, (n) => (n <= mx)), (n) => n.toString()) as string[];
}
// 根据留存的数据源图形进行处理
export const retentionSourceSelector = (source: Source, dimCols: string[], overTime: boolean, interval: number, timeRange: string): Source => {
  const filterSource = (overTime ? reject : filter)(source, { tm: 0 });
  // 记录需要保留的字段
  if (overTime) {
    // 挑选里面的字段第1，7，14天
    const fetchedTurns = retentionIntervalColumns(interval, timeRange);

    const results: Source = filter(flatten(map(fetchedTurns, (turn) =>  map(
      filterSource, (s) => {
        const v =  pick(s, dimCols);
        if (!s[`retention_${turn}`]) {
          return null;
        }
        assign(v, {
          turn,
          retention: s[`retention_${turn}`],
          retention_rate: s[`retention_rate_${turn}`]
        });
        return v;
      }
    ) as Source)));
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
