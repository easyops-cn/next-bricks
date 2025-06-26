import { jest, describe, test, expect } from "@jest/globals";
import { makeThrottledAggregation } from "./makeThrottledAggregation.js";

jest.useFakeTimers();

const fakeUsers = [
  {
    name: "a",
    instanceId: "1",
  },
  {
    name: "b",
    instanceId: "2",
  },
  {
    name: "c",
    instanceId: "3",
  },
  {
    name: "d",
    instanceId: "4",
  },
];

const request = jest.fn(({ query }: { query: any }) => {
  // Fake matching.
  return Promise.resolve({
    list: fakeUsers
      .filter(
        (user) =>
          query.$or[0].name.$in.some((name: string) => name === user.name) ||
          query.$or[1].instanceId.$in.some(
            (instanceId: string) => instanceId === user.instanceId
          )
      )
      .map((item) => ({ ...item })),
  });
});

const getUserInfoByNameOrInstanceId = makeThrottledAggregation(
  "getUserInfoByNameOrInstanceId",
  (ids: string[]) =>
    request({
      query: {
        state: "valid",
        $or: [
          {
            name: {
              $in: ids,
            },
          },
          {
            instanceId: {
              $in: ids,
            },
          },
        ],
      },
    }),
  ({ list }: { list: { name: string; instanceId: string }[] }, id: string) => {
    return list.find((item) => item.instanceId === id || item.name === id);
  }
);

describe("makeThrottledAggregation", () => {
  test("should work", async () => {
    const promises: Promise<any>[] = [];
    promises.push(getUserInfoByNameOrInstanceId("a"));
    jest.advanceTimersByTime(60);
    expect(request).toHaveBeenCalledTimes(0);
    promises.push(getUserInfoByNameOrInstanceId("2"));
    expect(request).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(40);
    expect(request).toHaveBeenCalledTimes(1);
    expect(request).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        query: {
          state: "valid",
          $or: [
            {
              name: {
                $in: ["a", "2"],
              },
            },
            {
              instanceId: {
                $in: ["a", "2"],
              },
            },
          ],
        },
      })
    );
    const results = await Promise.all(promises);
    expect(results).toEqual(fakeUsers.slice(0, 2));

    promises.length = 0;
    // This should be cached
    promises.push(getUserInfoByNameOrInstanceId("2"));
    jest.advanceTimersByTime(50);
    promises.push(getUserInfoByNameOrInstanceId("c"));
    jest.advanceTimersByTime(50);
    expect(request).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(50);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        query: {
          state: "valid",
          $or: [
            {
              name: {
                $in: ["c"],
              },
            },
            {
              instanceId: {
                $in: ["c"],
              },
            },
          ],
        },
      })
    );
    const results2 = await Promise.all(promises);
    // [b, c]
    expect(results2).toEqual(fakeUsers.slice(1, 3));
  });
});
