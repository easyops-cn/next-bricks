import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { EasyViewElement } from "./index.js";

describe("containers.grid-layout", () => {
  test("should work with gridAreas", () => {
    const element = document.createElement(
      "containers.easy-view"
    ) as EasyViewElement;

    element.gridAreas = {
      a: [1, 1, 2, 13],
      c: [2, 1, 3, 5],
      d: [2, 5, 3, 13],
    };
    element.gridTemplateColumns = "repeat(12, 1fr)";
    element.gridTemplateRows = "100px 200px";
    element.containerStyle = {
      height: "100%",
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>easy-view.shadow.css</style><div style="display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: 100px 200px; height: 100%;"><div style="grid-area: 1 / 1 / 2 / 13;"><slot name="a"></slot></div><div style="grid-area: 2 / 1 / 3 / 5;"><slot name="c"></slot></div><div style="grid-area: 2 / 5 / 3 / 13;"><slot name="d"></slot></div></div>"`
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("should work with gridTemplateAreas", () => {
    const element = document.createElement(
      "containers.easy-view"
    ) as EasyViewElement;

    element.gridTemplateAreas = [
      ["a", "a", "a"],
      ["c", ".", "d"],
    ];
    element.gridTemplateColumns = ["4fr", "2fr", "6fr"];
    element.gridTemplateRows = ["100px", "200px"];
    element.styleByAreas = {
      a: {
        justifySelf: "center",
      },
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>easy-view.shadow.css</style><div style="display: grid; grid-template-areas: &quot;a a a&quot; &quot;c . d&quot;; grid-template-columns: 4fr 2fr 6fr; grid-template-rows: 100px 200px;"><div style="grid-area: a; justify-self: center;"><slot name="a"></slot></div><div style="grid-area: c;"><slot name="c"></slot></div><div style="grid-area: d;"><slot name="d"></slot></div></div>"`
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });

  test("should work with gridAreas", () => {
    const element = document.createElement(
      "containers.easy-view"
    ) as EasyViewElement;

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot?.innerHTML).toMatchInlineSnapshot(
      `"<style>easy-view.shadow.css</style><div style="display: grid;"></div>"`
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
