import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoContractSelect } from "./index.js";
import { ContractCenterApi_searchContract } from "@next-api-sdk/next-builder-sdk";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-api-sdk/next-builder-sdk");

describe("eo-contract-select", () => {
  test("basic usage", async () => {
    (ContractCenterApi_searchContract as jest.Mock).mockImplementation(() =>
      Promise.resolve({
        list: [
          {
            fullContractName: "cmdb.instance@postSearch",
            version: ["1.0.0"],
          },
          {
            name: "cmdb.instance@postSearchV2",
            version: ["1.1.0"],
          },
          {
            name: "cmdb.instance@postSearchV3",
            version: ["1.2.0"],
          },
        ],
      })
    );
    const element = document.createElement(
      "eo-contract-select"
    ) as EoContractSelect;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
