import { renderHook } from "@testing-library/react";
import { describe, test, expect } from "@jest/globals";
import {
  InstanceApi_postSearchV3,
  InstanceApi_updateInstanceV2,
  InstanceApi_createInstance,
} from "@next-api-sdk/cmdb-sdk";
import { handleHttpError } from "@next-core/runtime";
import type { UserViewQuery } from "../interfaces";
import { useUserView } from "./useUserView";

const consoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => void 0);

jest.mock("@next-core/runtime");
jest.mock("@next-api-sdk/cmdb-sdk");
const spyOnPostSearch = InstanceApi_postSearchV3 as jest.Mock;
const spyOnUpdateInstance = InstanceApi_updateInstanceV2 as jest.Mock;
const spyOnCreateInstance = InstanceApi_createInstance as jest.Mock;

describe("useUserView", () => {
  test("should mark ready if query is undefined", async () => {
    const { result } = renderHook(() => useUserView(undefined));
    expect(result.current.userViewReady).toBe(true);
    expect(result.current.userViewNodesMap).toBe(null);
  });

  test("should warn if no namespace and key", () => {
    const { result } = renderHook(() => useUserView({} as UserViewQuery));
    expect(consoleError).toBeCalled();
    expect(result.current.userViewReady).toBe(true);
    expect(result.current.userViewNodesMap).toBe(null);
  });

  test("should show error message if fetch failed", async () => {
    spyOnPostSearch.mockRejectedValueOnce({
      message: "oops",
    });
    const query = {
      namespace: "foo",
      key: "bar",
    };
    const { result, rerender } = renderHook(() => useUserView(query));
    expect(result.current.userViewReady).toBe(false);

    await (global as any).flushPromises();
    rerender(query);
    expect(result.current.userViewReady).toBe(true);
    expect(result.current.userViewNodesMap).toBe(null);
    expect(handleHttpError).toBeCalledWith({
      message: "oops",
    });
  });

  test("should work when user view is empty", async () => {
    spyOnPostSearch.mockResolvedValueOnce({
      list: [],
    });
    const query = {
      namespace: "foo",
      key: "bar",
    };
    const { result, rerender } = renderHook(() => useUserView(query));
    expect(result.current.userViewReady).toBe(false);

    await (global as any).flushPromises();
    rerender(query);
    expect(result.current.userViewReady).toBe(true);
    expect(result.current.userViewNodesMap).toEqual(null);

    result.current.saveUserView([{ id: "b", x: 3, y: 4 }]);
    await (global as any).flushPromises();
    expect(spyOnCreateInstance).toBeCalledWith(
      "GRAPH_USER_VIEW@EASYOPS",
      { key: "bar", namespace: "foo", nodes: [{ id: "b", x: 3, y: 4 }] },
      { interceptorParams: { ignoreLoadingBar: true } }
    );
  });

  test("should update user view nodes map", async () => {
    spyOnPostSearch.mockResolvedValueOnce({
      list: [
        {
          instanceId: "m",
          nodes: [
            {
              id: "a",
              x: 1,
              y: 2,
            },
          ],
        },
      ],
    });
    const query = {
      namespace: "foo",
      key: "bar",
    };
    const { result, rerender } = renderHook(() => useUserView(query));
    expect(result.current.userViewReady).toBe(false);

    await (global as any).flushPromises();
    rerender(query);
    expect(result.current.userViewReady).toBe(true);
    expect(result.current.userViewNodesMap).toEqual(
      new Map([["a", { id: "a", x: 1, y: 2 }]])
    );

    result.current.saveUserView([{ id: "b", x: 3, y: 4 }]);
    expect(spyOnUpdateInstance).toBeCalledWith(
      "GRAPH_USER_VIEW@EASYOPS",
      "m",
      { key: "bar", namespace: "foo", nodes: [{ id: "b", x: 3, y: 4 }] },
      { interceptorParams: { ignoreLoadingBar: true } }
    );
  });
});
