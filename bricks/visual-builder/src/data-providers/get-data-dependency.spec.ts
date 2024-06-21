import { describe, test, expect } from "@jest/globals";
import { getDataDependency } from "./get-data-dependency.js";

describe("dependency", () => {
  test.each([
    [
      [
        {
          name: "test",
          value: "<% CTX.hostData %>",
        },
      ],
      "CTX",
      new Map([
        [
          expect.objectContaining({ name: "test" }),
          {
            usedProperties: new Set(["hostData"]),
            hasNonStaticUsage: false,
          },
        ],
      ]),
    ],
    [
      [
        {
          name: "test",
          value: '<% CTX["hostData"] %>',
        },
      ],
      "CTX",
      new Map([
        [
          expect.objectContaining({ name: "test" }),
          {
            usedProperties: new Set(["hostData"]),
            hasNonStaticUsage: false,
          },
        ],
      ]),
    ],
    [
      [
        {
          name: "name",
          value: "<% STATE.name %>",
        },
        {
          name: "list",
          if: "<% STATE.flag %>",
          resolve: {
            useProvider: "cmdb.instance.cmdb@search:1.0.0",
            args: ["abc", "<% STATE.args %>"],
            transform: {
              value: "<% FN.getValue() %>",
            },
          },
        },
      ],
      "STATE",
      new Map([
        [
          expect.objectContaining({ name: "name" }),
          {
            usedProperties: new Set(["name"]),
            hasNonStaticUsage: false,
          },
        ],
        [
          expect.objectContaining({ name: "list" }),
          {
            usedProperties: new Set(["flag", "args"]),
            hasNonStaticUsage: false,
          },
        ],
      ]),
    ],
  ])("should work", (data, keyword, result) => {
    expect(getDataDependency(data, keyword)).toEqual(result);
  });
});
