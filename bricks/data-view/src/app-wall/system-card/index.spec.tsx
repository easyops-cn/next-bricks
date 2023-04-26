import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.js";
import { fireEvent } from "@testing-library/react";
import { SystemCard } from "./index.js";

describe("data-view.app-wall-system-card", () => {
  test("basic usage", async () => {
    const element = document.createElement("data-view.app-wall-system-card") as SystemCard;
    const mockClickFn = jest.fn();
    const itemList = [{
      key: "name",
      value: "test"
    }];
    element.cardTitle = "优维科技";
    element.itemList = itemList;
    element.buttonName = "测试";
    element.status = "normal";
    element.addEventListener("button-click", mockClickFn);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    // expect(element.shadowRoot.querySelector(".wrapper").classList).toContain("infoWrapper");
    expect(element.shadowRoot.querySelector(".buttonContent").childNodes.length).toBe(2);
    expect(element.shadowRoot.querySelector(".cardName").textContent).toBe("优维科技");

    act(() => {
      fireEvent.click(element.shadowRoot.querySelector(".buttonContent"));
    });
    expect(mockClickFn).lastCalledWith(expect.objectContaining({
      type: "button-click",
      detail: null,
    }));

    await act(async () => {
      element.status = "warning";
      element.buttonName = null;
      element.containerStyle = {
        width: "500px",
        height: "600px"
      };
    });

    expect(element.shadowRoot.querySelector(".buttonContent")).toBeNull();
    // expect(element.shadowRoot.querySelector(".wrapper").classList).toContain("warningWrapper");
    expect((element.shadowRoot.querySelector(".wrapper") as HTMLElement).style).toEqual(expect.objectContaining({
      width: "500px",
      height: "600px"
    }));

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  })
})
