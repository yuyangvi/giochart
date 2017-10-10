import * as G2 from "g2";
import * as moment from "moment";
import { assign, find, filter, flatten, map, reject, transform, pick } from "lodash";
import {Granulariy, Source} from "./chartProps";
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

export const filterValuesByTickCount = (tickCount: number, values: string[]): { indexs: number[], values: string[] } => {
  const indexs = values.map((e: string, i: number) => {
      if (i % tickCount === 0) {
        return i;
      }
    }).filter((e: number) => e !== undefined);

  const fValues = values.filter((e: string, i: number) => indexs.includes(i));

  // 最后一日/周/月
  if (!fValues.includes(values[values.length - 1])) {
    fValues.push(values[values.length - 1]);
    indexs.push(values.length - 1);
  }
  // 次日/周/月
  if (!fValues.includes(values[1])) {
     fValues.splice(1, 0, values[1]);
     indexs.splice(1, 0, 1);
  }
  return { indexs, values: fValues };
};

export const mergeFrame = (frame: any, dim: string, indexs: number[]) => {
  const fr = G2.Frame.filter(frame, (obj: any, index: number) => indexs.includes(obj.turn));
  const dimIndexs = fr.colArray(dim);
  const newIndexs = dimIndexs.map((i: number) => indexs.indexOf(i));
  return fr.colReplace(dim, newIndexs);
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
};
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
};

// 如果是要从倍数里面去取，小时要照顾到天
export const countTickCount = (frame: any, width: number, tmInterval: number) => {
  const range = G2.Frame.range(frame, "tm");
  const tmLength: number = G2.Frame.group(frame, ["tm"]).length;
  // TODO: 计算tickInterval

  const [startTime, endTime] = G2.Frame.range(frame, "tm");
  const interval = (endTime - startTime)  / width * 80;
  if (!interval) { return }
  if (tmInterval > 86400000) {
    return Math.ceil(interval / tmInterval) * tmInterval;
  } else if (endTime - startTime > 86400000) {
    return Math.ceil(interval / 86400000) * 86400000;
  } else {
    const ceilNum =  Math.ceil(interval / 3600000);
    // 取大于divisor的24的约数
    const divisor = [24, 12, 8, 6, 4, 3, 2, 1].reduce((b, n) => (ceilNum > n ? b : n));
    return (divisor * 3600000);
  }
};

export const countTickCountTimeCat = (frame: any, dom: Element, dimCols: string): number => {
  const currentRect: ClientRect = dom.getBoundingClientRect();
  const maxTicks = G2.Frame.group(frame, dimCols).length;
  let step =  Math.ceil(60 * maxTicks / (currentRect.width - 100));
  if (step === 1) {
    return maxTicks;
  }
  while (step <= Math.ceil(maxTicks / 2 )) {
    if ((maxTicks - 1) % step === 0) {
      return (maxTicks - 1) / step + 1;
    }
    step++ ;
  }
  return 2;
};

export const getTmFormat = (tmInterval: number, timeRange: string) => {
  const flattenRange = flattenDateRange(timeRange);
  if (tmInterval > 6048e5) { // 按月
    return (v: number) => (
      `${moment.unix(Math.max(flattenRange.startTime, v) / 1000).format("MM/DD ddd")} ~ ${moment.min(moment.unix(flattenRange.endTime / 1000), moment.unix(v / 1000).endOf("month")).format("MM/DD ddd")}`
    );
  } else if (tmInterval === 6048e5) { // 按周
    return (v: number) => {
      return `${moment.unix(Math.max(flattenRange.startTime, v) / 1000).format("MM/DD ddd")} ~ ${moment.min(moment.unix(flattenRange.endTime / 1000), moment.unix(v / 1000).endOf("week")).format("MM/DD ddd")}`
    };
  } else if (tmInterval === 864e5) { // 按天
    return (v: number) => moment.unix(v / 1000).format("MM/DD ddd");
  } else if (tmInterval === 36e5) { // 按小时
    return (v: number) => moment.unix(v / 1000).format("MM/DD ddd HH:mm");
  }
  return (v: number) => moment.unix(v / 1000).format("MM/DD ddd");
};

export const getTmTableFormat = (tmInterval: number, timeRange: string, isTooltip: boolean = false) => {
  const flattenRange = flattenDateRange(timeRange);
  if (tmInterval > 6048e5) { // 按月
    if (isTooltip) {
      return (v: number) => {
        const b = moment.unix(Math.max(flattenRange.startTime, v) / 1000);
        const c = moment.min(moment.unix(flattenRange.endTime / 1000), moment.unix(v / 1000).endOf("month"));
        return `${b.format("MM/DD")}~${c.format("MM/DD")},${Math.round((c.unix() - b.unix()) / 86400)}天`;
      };
    }
    return (v: number) => {
      const b = moment.unix(Math.max(flattenRange.startTime, v) / 1000);
      const c = moment.min(moment.unix(flattenRange.endTime / 1000), moment.unix(v / 1000).endOf("month"));
      return `${b.format("MM/DD")} - ${c.format("MM/DD")}`
    };
  } else if (tmInterval === 6048e5) { // 按周
    if (isTooltip) {
      return (v: number) => {
        const b = moment.unix(Math.max(flattenRange.startTime, v) / 1000);
        const c = moment.min(moment.unix(flattenRange.endTime / 1000), moment.unix(v / 1000).endOf("week"));
        return `${b.format("MM/DD")}~${c.format("MM/DD")},${b.format("ddd")}~${c.format("ddd")},${Math.round((c.unix() - b.unix()) / 86400)}天`;
      };
    }
    return (v: number) => {
      const b = moment.unix(Math.max(flattenRange.startTime, v) / 1000);
      const c = moment.min(moment.unix(flattenRange.endTime / 1000), moment.unix(v / 1000).endOf("week"));
      return `${b.format("MM/DD")} - ${c.format("MM/DD")}`
    };
  } else if (tmInterval === 864e5) { // 按天
    return (v: number) => moment.unix(v / 1000).format("MM-DD ddd");
  } else if (tmInterval === 36e5) { // 按小时
    return (v: number) => moment.unix(v / 1000).format("MM-DD ddd HH:mm");
  }
  return (v: number) => moment.unix(v / 1000).format("MM-DD ddd");
};
export const getAxisFormat = (tmInterval: number) => {
  const month = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];
  if (tmInterval > 6048e5) {
      return (n: string) => (month[parseInt(n.slice(0, 2), 10) - 1]);
  } else if (tmInterval === 6048e5) { // 按周
    return (n: string) => n.replace(/(\d+\/\d+)\s[^\s]+\s~\s(\d+\/\d+)\s[^\s]+/, ($1, $2, $3) => ($2 + "~" + $3));
  } else if (tmInterval === 36e5) {
    return (n: string) => {
      const matches = n.split(" ");
      return (matches[matches.length - 1] === "00:00") ? matches[0] : matches[matches.length - 1];
    };
  }
  return;
};
// 留存周和月颗粒度下，不完整数据点
export const pickUnfinishRetentionByTime = (frame: any, tmInterval: number) => {
  const duration = tmInterval > 6048e5 ? "months" : "weeks";
  const frameJSON = frame.toJSON();
  const unFinishFrameJSON: any[] = [];
  frameJSON.forEach((obj: any, index: number, array: any) => {
    const endTimeInFrame = moment.unix(obj.tm / 1000).add(parseInt(obj.turn, 10), duration).endOf("week");
    const endTime = moment().subtract(1, "days");
    if (moment(endTimeInFrame.format("YYYY-MM-DD")).isAfter(endTime.format("YYYY-MM-DD"))) {
      // 把上一个放进去
      if (index - 1 >= 0 && obj.turn === array[index - 1].turn) {
        // unFinishFrameJSON.push(array[index - 1]);
        unFinishFrameJSON.splice(unFinishFrameJSON.length - 1, 1, array[index - 1])
      }
      unFinishFrameJSON.push(array[index]);
    } else {
      unFinishFrameJSON.push(assign({}, array[index], {retention: null, retention_rate: null}));
    }
  });
  return new G2.Frame(unFinishFrameJSON);
};

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
};
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
        if (s[`retention_${turn}`] === undefined) {
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
};

export const getRetentionParams = (chartType: string, columns: any[], params: any, isCOT: boolean) => {
  let compareCol = filter(columns, (n: any) => (n.id !== "tm" && n.isDim)).reverse();
  const isCompare = !!compareCol.length;
  // 处理 turn的问题
  if (isCOT && !isCompare) {
    const grua: Granulariy[] = params.granularities;
    const interval = find(grua, { id: "tm" }).interval;
    const timeRange = params.timeRange;
    const filterArray = retentionIntervalColumns(parseInt(interval, 10), timeRange);
    const filteredColumns = filter(columns, (n: any) => {
      const matches = n.id.match(/^retention(?:_rate)_(\d+)$/);
      return (matches && filterArray.includes(matches[1]));
    });

    compareCol = [{ id: "turn", name: "留存周期", isDim: true, isRate: false, values: map(filteredColumns, "name") }];
  }
  const cotCols = isCOT ?
    { id: "tm", name: "起始时间", isDim: true, isRate: false } :
    { id: "turn", name: "留存", isDim: true, isRate: false, values: getLabels(columns) };
  let matricCols = [
    { id: "retention_rate", name: "留存率", isDim: false, isRate: true },
    { id: "retention", name: "留存人数", isDim: false, isRate: false }
  ];
  if (chartType === "count") {
    matricCols = matricCols.reverse();
  }
  return {
    adjust: "stack",
    chartType: chartType === "count" ? "retentionColumn" : "retention",
    columns: [cotCols, ...compareCol, ...matricCols]
  };
};
const getLabels = (columns: any) => {
  return map(filter(columns, (n: any) => (/^retention_\d+$/.test(n.id))), "name");
};

const componentToHex = (c: number) => {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
};

export const rgbToHex = (rgb: string) => {
    const reg = /\d+/g;
    const ragValue = rgb.match(reg);
    return "#" + componentToHex(parseInt(ragValue[0], 10)) + componentToHex(parseInt(ragValue[1], 10)) + componentToHex(parseInt(ragValue[2], 10));
};

export const hexToRgb = (hex: string)  => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

/**
 * 将formatted格式的时间范围数据转化为flat格式的时间范围数据
 * @param range 时间范围
 * @returns {*}
 */
export const flattenDateRange = (range: any = "day:7,1") => {
  const dateRange = {};
  if (typeof range === "object") {
    range.type = "absolute";
    return range;
  }

  // 这里对解析本月、本周和今年,暴力一点
  range = range.trim();
  const matches = range.match(/(day|week|month|year)\:(1\,0|prev)/);
  if (matches) {
    const startKw = matches[1] === "week" ? "isoWeek" : matches[1];
    const endKw = matches[2] === "prev" ? startKw : "day";
    const intervalKw = matches[2] === "prev" ? matches[1] : "day";
    return {
      type: "relative",
      startTime: moment().subtract(1, intervalKw).startOf(startKw).valueOf(),
      endTime: moment().subtract(1, intervalKw).endOf(endKw).valueOf()
    }
  }
  const absMatches = range.match(/(\w+)\:(\d+),(\d+)/);
  if (absMatches[1] === "abs") {
    return {
      type: "absolute",
      startTime: parseInt(absMatches[2], 10),
      endTime: parseInt(absMatches[3], 10),
    }
  } else if (absMatches) {
    return {
      type: "relative",
      startTime: moment().subtract(parseInt(absMatches[2], 10) - 1, "days").startOf("day").valueOf(),
      endTime: moment().subtract(parseInt(absMatches[3], 10), "days").endOf("day").valueOf()
    };
  }
  return;
};
