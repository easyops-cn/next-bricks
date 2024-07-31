import { describe, test, expect } from "@jest/globals";
import { InstanceApi_createInstance } from "@next-api-sdk/cmdb-sdk";
import { batchUpdateRawDataGeneratedView } from "./batch-update-raw-data-generated-view.js";

jest.mock("@next-api-sdk/cmdb-sdk");

describe("batchUpdateRawDataGeneratedView", () => {
  test("should work", async () => {
    const result = await batchUpdateRawDataGeneratedView([
      {
        attrInstanceId: "i-1",
        input: "input-1",
        output: "output-1",
        list: [],
      },
      {
        attrInstanceId: "i-2",
        input: "input-2",
        output: "output-2",
        list: [],
      },
    ]);

    expect(result).toMatchInlineSnapshot(`
      [
        {
          "status": "fulfilled",
          "value": undefined,
        },
        {
          "status": "fulfilled",
          "value": undefined,
        },
      ]
    `);
    expect(InstanceApi_createInstance).toBeCalledTimes(2);
    expect(InstanceApi_createInstance).toHaveBeenNthCalledWith(
      1,
      "RAW_DATA_GENERATED_VIEW@EASYOPS",
      {
        input: "input-1",
        output: "output-1",
        list: [],
        attr: ["i-1"],
      }
    );
    expect(InstanceApi_createInstance).toHaveBeenNthCalledWith(
      2,
      "RAW_DATA_GENERATED_VIEW@EASYOPS",
      {
        input: "input-2",
        output: "output-2",
        list: [],
        attr: ["i-2"],
      }
    );
  });
});
