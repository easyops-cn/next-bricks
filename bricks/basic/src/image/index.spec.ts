import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { Image } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

// Todo(nlicro): fix test fail
describe("eo-image", () => {
  test("basic usage", () => {
    const onVisibleChange = jest.fn();
    const element = document.createElement("eo-image") as Image;
    element.addEventListener("visibleChange", onVisibleChange);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    act(() => {
      element.open();
    });
    expect(onVisibleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: "visibleChange",
        detail: true,
      })
    );

    act(() => {
      element.close();
    });
    expect(onVisibleChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        type: "visibleChange",
        detail: false,
      })
    );

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
