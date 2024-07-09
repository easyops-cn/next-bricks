import { describe, test, expect } from "@jest/globals";
import { activeElementBlur } from "./active-element-blur.js";

describe("activeElementBlur", () => {
  test("should work", () => {
    const mockBlur = jest.spyOn(document.activeElement as HTMLElement, "blur");
    activeElementBlur();
    expect(mockBlur).toHaveBeenCalled();
  });
});
