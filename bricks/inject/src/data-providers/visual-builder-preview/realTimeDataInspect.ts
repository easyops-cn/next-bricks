export function getRealTimeDataAnnotation(value: unknown) {
  const type = typeof value;
  switch (type) {
    case "string":
    case "boolean":
    case "number":
      return {
        type,
        value,
      };
    case "undefined":
      return { type };
  }
  if (value === null) {
    return { type: "null" };
  }
  if (Array.isArray(value)) {
    return { type: "array", length: value.length };
  }
  return { type: "object" };
}
