import { getRealTimeDataAnnotation } from "./realTimeDataInspect";

describe("realTimeDataInspect", () => {
  test.each([
    ["yes", { type: "string", value: "yes" }],
    [true, { type: "boolean", value: true }],
    [42, { type: "number", value: 42 }],
    [undefined, { type: "undefined" }],
    [null, { type: "null" }],
    [[2], { type: "array", length: 1 }],
    [{ a: "b" }, { type: "object" }],
  ])("getRealTimeDataAnnotation(%j) should return %j", (input, output) => {
    expect(getRealTimeDataAnnotation(input)).toEqual(output);
  });
});
