import { DeferredService } from "./DeferredService.js";

const consoleError = jest.spyOn(console, "error");

describe("DeferredService", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("schedule and fetch after schedule performed", async () => {
    let a = 0;
    const task = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(++a);
          }, 10);
        })
    );
    const deferred = new DeferredService(task);
    deferred.schedulePrefetch();
    // Schedule twice
    deferred.schedulePrefetch();
    expect(task).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(task).toBeCalledTimes(1);

    const promise = deferred.fetch() as Promise<number>;
    let resolved = -1;
    promise.then((value) => {
      resolved = value;
    });

    jest.advanceTimersByTime(10);
    await (global as any).flushPromises();
    expect(task).toBeCalledTimes(1);
    expect(resolved).toBe(1);
  });

  test("schedule and fetch before schedule performed", async () => {
    let a = 0;
    const task = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(++a);
          }, 10);
        })
    );
    const deferred = new DeferredService(task);
    deferred.schedulePrefetch();
    expect(task).not.toBeCalled();

    const promise = deferred.fetch() as Promise<number>;
    let resolved = -1;
    promise.then((value) => {
      resolved = value;
    });

    jest.advanceTimersByTime(10);
    await (global as any).flushPromises();
    expect(task).toBeCalledTimes(1);
    expect(resolved).toBe(1);
  });

  test("schedule and fetch eager", async () => {
    let a = 0;
    const task = jest.fn(
      () =>
        new Promise((resolve) => {
          setTimeout(() => {
            resolve(++a);
          }, 10);
        })
    );
    const deferred = new DeferredService(task);
    deferred.schedulePrefetch();
    expect(task).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(task).toBeCalledTimes(1);

    const promise = deferred.fetch(true) as Promise<number>;
    let resolved = -1;
    promise.then((value) => {
      resolved = value;
    });

    jest.advanceTimersByTime(10);
    await (global as any).flushPromises();
    expect(task).toBeCalledTimes(2);
    expect(resolved).toBe(2);
  });

  test("schedule failed", async () => {
    consoleError.mockReturnValueOnce();
    let a = 0;
    const error = new Error("oops");
    const task = jest.fn(
      () =>
        new Promise((resolve, reject) => {
          const value = a++;
          if (value === 0) {
            setTimeout(() => {
              reject(error);
            }, 10);
          } else {
            setTimeout(() => {
              resolve(value);
            }, 10);
          }
        })
    );
    const deferred = new DeferredService(task);
    deferred.schedulePrefetch();
    expect(task).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(task).toBeCalledTimes(1);

    expect(() => deferred.fetch()).rejects.toBe(error);

    jest.advanceTimersByTime(10);
    await (global as any).flushPromises();
    expect(task).toBeCalledTimes(1);
    expect(consoleError).toBeCalledTimes(1);
  });
});
