import { describe, test, expect } from "@jest/globals";
import { debounceByAnimationFrame } from "./debounceByAnimationFrame.js";

window.requestAnimationFrame = jest.fn((fn) => setTimeout(fn, 17));
window.cancelAnimationFrame = jest.fn((frame) => clearTimeout(frame));

jest.useFakeTimers();

describe("debounceByAnimationFrame", () => {
  test("should work", () => {
    const fn = jest.fn();
    const debounced = debounceByAnimationFrame(fn);

    debounced("hello", "world");
    jest.advanceTimersByTime(10);
    expect(fn).not.toBeCalled();

    debounced("hello", "new world");
    jest.advanceTimersByTime(5);
    expect(fn).not.toBeCalled();

    jest.advanceTimersByTime(50);
    expect(fn).toHaveBeenNthCalledWith(1, "hello", "new world");

    debounced("hello", "new world");
    jest.advanceTimersByTime(10);
    debounced.cancel();
    jest.runAllTimers();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
