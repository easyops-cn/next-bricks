import { describe, test, expect } from "@jest/globals";
import { lockBodyScroll } from "./lock-body-scroll.js";

describe("enableBodyScroll", () => {
  test("should work", async () => {
    const divEle = document.createElement("div");
    expect(await lockBodyScroll(divEle, true)).toBe(undefined);
    expect(document.body.classList.value).toBe("disable-scroll");
    expect(await lockBodyScroll(divEle, false)).toBe(undefined);
    expect(document.body.classList.value).toBeFalsy();
  });
});
