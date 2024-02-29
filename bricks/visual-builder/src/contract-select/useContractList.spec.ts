import { useContractList } from "./useContractList";
import { ContractCenterApi_searchContract } from "@next-api-sdk/next-builder-sdk";
import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";

jest.mock("@next-api-sdk/next-builder-sdk");

describe("useContract", () => {
  it("should work", async () => {
    (ContractCenterApi_searchContract as jest.Mock).mockImplementation((data) =>
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
        ].slice(0, data?.pageSize),
      })
    );

    const { result, rerender } = renderHook(
      (initialValue) => useContractList(initialValue),
      {
        initialProps: {},
      }
    );

    await act(() => (global as any).flushPromises());

    expect(result.current).toEqual([
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
    ]);

    rerender({ pageSize: 1 });

    await act(() => (global as any).flushPromises());

    // await waitFor();
    expect(result.current).toEqual([
      {
        fullContractName: "cmdb.instance@postSearch",
        version: ["1.0.0"],
      },
    ]);
    (ContractCenterApi_searchContract as jest.Mock).mockClear();
  });

  it("provider return error", async () => {
    (ContractCenterApi_searchContract as jest.Mock).mockRejectedValue(
      new Error("http error")
    );

    const spyOnConsoleError = jest.spyOn(window.console, "error");

    renderHook(() => useContractList({}));

    await (global as any).flushPromises();
    expect(spyOnConsoleError).toHaveBeenCalled();
    (ContractCenterApi_searchContract as jest.Mock).mockClear();
  });
});
