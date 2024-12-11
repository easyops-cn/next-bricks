const numberFormatter = new Intl.NumberFormat("zh-CN", {
  useGrouping: true,
});

export function formatValue(value: string | number): string {
  return isMeaningfulNumber(value) ? numberFormatter.format(+value) : value;
}

/**
 * 判断一个值是否是有意义的数字，包括数字和可以转换为数字的字符串。
 *
 * 但不包括 NaN、Infinity、-Infinity 等。
 *
 * Ref https://github.com/jonschlinkert/is-number/blob/master/index.js
 */
export function isMeaningfulNumber(value: unknown): value is number | string {
  if (typeof value === "number") {
    return value - value === 0;
  }
  if (typeof value === "string" && value.trim() !== "") {
    return /* istanbul ignore next */ (Number.isFinite ?? isFinite)(+value);
  }
  return false;
}
