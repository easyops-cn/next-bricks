import { describe, test, expect } from "@jest/globals";
import { createAsyncQueue } from "./createAsyncQueue";

function createDeferred() {
  let resolve: (value?: unknown) => void;
  let reject: (reason?: unknown) => void;

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
}

const consoleError = jest
  .spyOn(console, "error")
  .mockImplementation(() => void 0);

describe("createAsyncQueue", () => {
  test("should work", async () => {
    // Preparing.
    const fn = jest.fn();
    const deferred1 = createDeferred();
    const deferred2 = createDeferred();
    const deferred3 = createDeferred();

    async function task1(): Promise<void> {
      fn(1);
      await deferred1.promise;
    }

    async function task2(): Promise<void> {
      fn(2);
      await deferred2.promise;
    }

    async function task3(): Promise<void> {
      fn(3);
      await deferred3.promise;
    }

    // Execution.
    const queue = createAsyncQueue();
    queue(task1);
    queue(task2);
    queue(task3);

    // Assertions.
    expect(fn).toBeCalledTimes(1);
    expect(fn).toHaveBeenNthCalledWith(1, 1);

    deferred1.resolve();
    await (global as any).flushPromises();
    expect(fn).toBeCalledTimes(2);
    expect(fn).toHaveBeenNthCalledWith(2, 2);

    const error = new Error("oops");
    deferred2.reject(error);
    await (global as any).flushPromises();
    expect(fn).toBeCalledTimes(3);
    expect(fn).toHaveBeenNthCalledWith(3, 3);
    expect(consoleError).toBeCalledWith(error);
  });
});
