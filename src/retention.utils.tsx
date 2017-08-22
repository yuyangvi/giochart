import { assign, find, filter, forEach, flatten, includes, map, reduce, reject, pick } from "lodash";
import { Source, Metric, DataRequestProps } from "./chartProps";

// 计算timeRange的时间长度
const calculateTimeRange = (timeRange: string) => {
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

/**
 * 根据interval和timeRange筛选Turn的条件;
 * @param interval
 * @param timeRange
 * @returns {string[]}
 */

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

export const getRetention = (columns: Metric[], source: Source, params: DataRequestProps, isCOT: boolean, isTrend: boolean) => {
  // 这里服务器返回的实际是string
  const interval = find(params.granularities, {id: "tm"}).interval as any as string;
  const timeRange = params.timeRange;
  const filterArray = (isCOT || !isTrend) ?
      retentionIntervalColumns(parseInt(interval, 10), timeRange) :
      reduce(columns, (result: string[], n: any) => {
        const matches = n.id.match(/^retention(?:_rate)_(\d+)$/);
        if (matches) {
          result.push(matches[1]);
        }
        return result;
      }, []);
  const compareCol = filter(columns, (n: any) => (n.id !== "tm" && n.isDim)).reverse();
  const isCompare = !!compareCol.length;
  const retentionDimCols = getRetentionDimCols(columns, isCOT, isTrend, isCompare, filterArray);
  const dimColumnIds = map(retentionDimCols, "id") as string[];
  const retentionSource = getRetentionSource(source, isCOT, dimColumnIds, filterArray);
  // 取得source
  let matricCols = [
    { id: "retention_rate", name: "留存率", isDim: false, isRate: true },
    { id: "retention", name: "用户数", isDim: false, isRate: false }
  ];
  if (!isTrend) {
    matricCols = matricCols.reverse();
  }

  return {
    params: {
      adjust: "stack",
      chartType: isTrend ? "retention" : "retentionColumn",
      columns: [...retentionDimCols, ...matricCols]
    },
    source: retentionSource
  };
}
const getRetentionSource = (
  source: Source,
  isCOT: boolean,
  dimColumnIds: string[],
  filterArray: string[]
) => {
  const j = (isCOT ? reject : filter)(source, { tm: 0 });
  return reduce(
    j,
    (result: any[], s: any, key: string) => {
      const dimObj = pick(s, dimColumnIds);
      forEach(filterArray, (turn) => {
        if (s[`retention_${turn}`]) {
          result.push(assign({
            turn,
            retention: s[`retention_${turn}`],
            retention_rate: s[`retention_rate_${turn}`]
          }, dimObj));
        }
      });
      return result;
    },
    []
  );
}
/**
 * 取得retentionParams
 */
const getRetentionDimCols = (columns: Metric[], isCOT: boolean, isTrend: boolean, isCompare: boolean, filterArray: string[]) => {
  let compareCol = isCompare ?
    filter(columns, (n: any) => (n.id !== "tm" && n.isDim)).reverse() :
    [];
  // 处理 turn的问题
  if (isCOT && !isCompare) {
    const filteredColumns = filter(columns, (n: any) => {
      const matches = n.id.match(/^retention(?:_rate)_(\d+)$/);
      return (matches && includes(filterArray, matches[1]));
    });

    compareCol = [{
      id: "turn",
      name: "留存周期",
      isDim: true,
      isRate: false,
      values: map(filteredColumns, "name")
    }];
  }
  const cotCols = isCOT ?
    { id: "tm", name: "起始时间", isDim: true, isRate: false } :
    { id: "turn", name: "留存", isDim: true, isRate: false, values: getLabels(columns) };
  let matricCols = [
    { id: "retention_rate", name: "留存率", isDim: false, isRate: true },
    { id: "retention", name: "用户数", isDim: false, isRate: false }
  ];
  if (!isTrend) {
    matricCols = matricCols.reverse();
  }
  return [cotCols, ...compareCol];
}
const getLabels = (columns: Metric[]): string[] => {
  return map(filter(columns, (n: Metric) => (/^retention_\d+$/.test(n.id))), "name") as string[];
}
