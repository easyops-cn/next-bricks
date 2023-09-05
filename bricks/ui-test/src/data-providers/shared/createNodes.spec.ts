import { describe, test, expect } from "@jest/globals";
import { InstanceApi_createInstance } from "@next-api-sdk/cmdb-sdk";
import { createNodes } from "./createNodes.js";
import { NodeType } from "../../interface.js";

jest.mock("@next-api-sdk/cmdb-sdk");

let counter = 1;
(InstanceApi_createInstance as jest.Mock).mockImplementation(() => ({
  instanceId: `n_${counter++}`,
}));

describe("createNodes", () => {
  test("should work", async () => {
    await createNodes(
      [
        {
          type: NodeType.Command,
          name: "get",
          params: ["#my-button"],
          children: [
            {
              type: NodeType.Command,
              name: "click",
            },
          ],
        },
        {
          type: NodeType.Command,
          name: "findByTestId",
          params: ["my-input"],
          children: [
            {
              type: NodeType.Command,
              name: "dblclick",
            },
            {
              type: NodeType.Command,
              name: "type",
              params: ["ok{enter}"],
            },
          ],
        },
      ],
      "p_0"
    );
    expect(InstanceApi_createInstance).toBeCalledTimes(5);

    expect(InstanceApi_createInstance).toHaveBeenNthCalledWith(
      1,
      "UI_TEST_NODE@EASYOPS",
      expect.objectContaining({
        name: "get",
        parent: "p_0",
        sort: 0,
      })
    );
    expect(InstanceApi_createInstance).toHaveBeenNthCalledWith(
      2,
      "UI_TEST_NODE@EASYOPS",
      expect.objectContaining({
        name: "click",
        parent: "n_1",
        sort: 0,
      })
    );
    expect(InstanceApi_createInstance).toHaveBeenNthCalledWith(
      3,
      "UI_TEST_NODE@EASYOPS",
      expect.objectContaining({
        name: "findByTestId",
        parent: "p_0",
        sort: 1,
      })
    );
    expect(InstanceApi_createInstance).toHaveBeenNthCalledWith(
      4,
      "UI_TEST_NODE@EASYOPS",
      expect.objectContaining({
        name: "dblclick",
        parent: "n_3",
        sort: 0,
      })
    );
    expect(InstanceApi_createInstance).toHaveBeenNthCalledWith(
      5,
      "UI_TEST_NODE@EASYOPS",
      expect.objectContaining({
        name: "type",
        parent: "n_3",
        sort: 1,
      })
    );
  });
});
