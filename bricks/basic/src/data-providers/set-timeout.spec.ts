import { describe, test, expect } from "@jest/globals";
import { providerSetTimeout } from "./set-timeout.js";

describe("providerSetTimeout", () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test("should work", async () => {
    const promise = providerSetTimeout(100, "done");
    jest.advanceTimersByTime(100);
    expect(promise).resolves.toBe("done");
  });
});
