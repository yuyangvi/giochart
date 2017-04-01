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
    return  n.toPrecision(3);
  }
  return (n * Math.pow(0.1, 4 * suffixIndex)).toPrecision(3) + suffixArray[suffixIndex];
};
