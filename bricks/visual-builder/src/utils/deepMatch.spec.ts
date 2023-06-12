import { deepMatch, deepFilter } from "./deepMatch.js";

describe("deepMatch", () => {
  it.each<[unknown, string, boolean]>([
    ["Some Goods", "good", true],
    ["Some Goods", "bad", false],
    [false, "false", true],
    [1, "1", true],
    [null, "null", true],
    [undefined, "undefined", false],
    [{ payload: "Some Goods" }, "good", true],
    [{ payload: "Some Goods" }, "bad", false],
    [{ payload: ["Some Goods"] }, "good", true],
    [{ payload: ["Some Goods"] }, "bad", false],
  ])("should work", (data, lowerTrimmedQuery, matched) => {
    expect(deepMatch(data, lowerTrimmedQuery)).toBe(matched);
  });
});

describe("deepFilter", () => {
  const list = [
    {
      bool: true,
      number: 1,
      string: "Some Goods",
      nilA: null,
      nilB: undefined,
      array: ["Better Goods"],
    } as any,
    {
      bool: false,
      number: 2,
      string: "",
      array: ["NULL | UNDEFINED"],
    },
  ];
  it.each<[string, unknown[]]>([
    ["GOOD", [{ number: 1 }]],
    ["nil", [{ number: 1 }]],
    ["string", [{ number: 1 }, { number: 2 }]],
    [" ", [{ number: 1 }, { number: 2 }]],
    ["2", [{ number: 2 }]],
    ["true", [{ number: 1 }]],
    ["false", [{ number: 2 }]],
    ["Null", [{ number: 1 }, { number: 2 }]],
    ["Undefined", [{ number: 2 }]],
  ])("should work", (q, result) => {
    expect(deepFilter(list, q)).toEqual(
      result.map((item) => expect.objectContaining(item))
    );
  });
});
