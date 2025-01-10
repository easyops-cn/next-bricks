// import { act } from "react";
import { showWaterMark } from "./show-watermark.js";
import "jest-canvas-mock";
import { act } from "react";

describe("showWaterMark", () => {
  test("general", async () => {
    act(() => {
      showWaterMark({
        content: ["hello", "world"],
        width: 200,
        height: 100,
      });
    });

    expect(document.body.innerHTML).toBe(
      "<div style=\"z-index: 9; position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; background-repeat: repeat; background-image: url('data:image/png;base64,00'); background-size: 645px;\"></div>"
    );

    const element = document.body.querySelector("div");

    const defaultStyle = element?.getAttribute("style");

    // modify style
    await act(async () => {
      element!.setAttribute("style", "");
      await (global as any).flushPromises();
    });

    expect(element?.getAttribute("style")).toBe(defaultStyle);

    // insert class
    await act(async () => {
      element!.className = "insert";
      await (global as any).flushPromises();
    });

    expect(element?.className).toBe("");

    // delete
    await act(async () => {
      document.body.innerHTML = "";
      await (global as any).flushPromises();
    });

    expect(document.body.innerHTML).toBe(
      "<div style=\"z-index: 9; position: absolute; left: 0; top: 0; width: 100%; height: 100%; pointer-events: none; background-repeat: repeat; background-image: url('data:image/png;base64,00'); background-size: 645px;\"></div>"
    );
  });
});
