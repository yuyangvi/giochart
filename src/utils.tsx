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
    return parseFloat(n.toPrecision(3));
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
  } else if (0 > n && n > 0.001){
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
