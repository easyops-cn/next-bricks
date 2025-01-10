import { jest, describe, afterEach, test, expect } from "@jest/globals";
import { act } from "react";
import { renderHook } from "@testing-library/react";
import { UserAdminApi_searchAllUsersInfo } from "@next-api-sdk/user-service-sdk";
import { useUserInfoByNameOrInstanceId } from "./useUserInfoByNameOrInstanceId.js";

jest.mock("@next-api-sdk/user-service-sdk");
jest.useFakeTimers();

const consoleError = jest.spyOn(console, "error").mockReturnValue();

const fakeUsers = [
  {
    name: "a",
    instanceId: "1",
  },
  {
    name: "b",
    instanceId: "2",
  },
];

(UserAdminApi_searchAllUsersInfo as jest.Mock).mockImplementation(
  ({ query }: any) => {
    // Fake matching.
    const list = fakeUsers
      .filter(
        (user) =>
          query.$or[0].name.$in.some((name: string) => name === user.name) ||
          query.$or[1].instanceId.$in.some(
            (instanceId: string) => instanceId === user.instanceId
          )
      )
      .map((item) => ({ ...item }));
    return list.length > 0
      ? Promise.resolve({
          list,
        })
      : Promise.reject(new Error("oops"));
  }
);

describe("useUserInfoByNameOrInstanceId", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should work", async () => {
    const { result, rerender, unmount } = renderHook(
      (nameOrInstanceId: string) =>
        useUserInfoByNameOrInstanceId(nameOrInstanceId),
      {
        initialProps: "a",
      }
    );
    await jest.advanceTimersByTime(100);
    expect(result.current).toEqual({ loading: true, user: null });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(result.current).toEqual({
      user: {
        name: "a",
        instanceId: "1",
      },
      loading: false,
    });

    rerender("b");
    expect(result.current).toEqual({ loading: true, user: null });
    await jest.advanceTimersByTime(100);
    expect(result.current).toEqual({ loading: true, user: null });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(result.current).toEqual({
      user: {
        name: "b",
        instanceId: "2",
      },
      loading: false,
    });
    unmount();
    expect(consoleError).not.toBeCalled();
  });

  test("should work concurrently", async () => {
    const { result: result1, unmount: unmount1 } = renderHook(
      (nameOrInstanceId: string) =>
        useUserInfoByNameOrInstanceId(nameOrInstanceId),
      {
        initialProps: "a",
      }
    );
    const { result: result2, unmount: unmount2 } = renderHook(
      (nameOrInstanceId: string) =>
        useUserInfoByNameOrInstanceId(nameOrInstanceId),
      {
        initialProps: "b",
      }
    );
    await jest.advanceTimersByTime(100);
    expect(result1.current).toEqual({ loading: true, user: null });
    expect(result2.current).toEqual({ loading: true, user: null });
    await act(async () => {
      await (global as any).flushPromises();
    });

    expect(result1.current).toEqual({
      user: {
        name: "a",
        instanceId: "1",
      },
      loading: false,
    });
    expect(result2.current).toEqual({
      user: {
        name: "b",
        instanceId: "2",
      },
      loading: false,
    });
    unmount1();
    unmount2();
    expect(consoleError).not.toBeCalled();
  });

  test("should handle unsubscribed", async () => {
    const { result, unmount } = renderHook(
      (nameOrInstanceId: string) =>
        useUserInfoByNameOrInstanceId(nameOrInstanceId),
      {
        initialProps: "a",
      }
    );
    await jest.advanceTimersByTime(50);
    expect(result.current).toEqual({ loading: true, user: null });
    // Unmount early.
    unmount();
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(result.current).toEqual({ loading: true, user: null });
  });

  test("should work when input is null", async () => {
    const { result, unmount } = renderHook(
      (nameOrInstanceId: string) =>
        useUserInfoByNameOrInstanceId(nameOrInstanceId),
      {
        initialProps: undefined,
      }
    );
    await jest.advanceTimersByTime(100);
    expect(result.current).toEqual({ loading: false, user: null });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(result.current).toEqual({ loading: false, user: null });
    unmount();
    expect(consoleError).not.toBeCalled();
  });

  test("should work when error occurred", async () => {
    const { result, unmount } = renderHook(
      (nameOrInstanceId: string) =>
        useUserInfoByNameOrInstanceId(nameOrInstanceId),
      {
        initialProps: "c",
      }
    );
    await jest.advanceTimersByTime(100);
    expect(result.current).toEqual({ loading: true, user: null });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(consoleError).toBeCalledWith(
      "Load user info failed:",
      new Error("oops")
    );
    expect(result.current).toEqual({ loading: false, user: null });
    unmount();
  });
});
