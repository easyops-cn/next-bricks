const numberFormatter = new Intl.NumberFormat("zh-CN", {
  useGrouping: true,
});

export function formatValue(value: string | number): string {
  return typeof value === "number" ? numberFormatter.format(value) : value;
}
