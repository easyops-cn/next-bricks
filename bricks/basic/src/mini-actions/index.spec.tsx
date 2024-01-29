import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { ActionType, EoMiniActions } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

customElements.define(
  "eo-actions",
  class extends HTMLElement {
    actions: unknown[] | undefined;
  }
);

describe("eo-mini-actions", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-mini-actions") as EoMiniActions;
    element.actions = [
      {
        icon: {
          lib: "antd",
          theme: "outlined",
          icon: "star",
        },
        isDropdown: false,
        event: "collect",
      },
      {
        icon: {
          lib: "antd",
          theme: "outlined",
          icon: "edit",
        },
        isDropdown: false,
        event: "edit",
        tooltip: "edit",
      },
      {
        icon: {
          lib: "antd",
          icon: "copy",
          theme: "outlined",
        },
        text: "复制链接",
        isDropdown: true,
        event: "copy",
      },
      {
        icon: {
          lib: "antd",
          icon: "download",
          theme: "outlined",
        },
        text: "下载",
        isDropdown: true,
        disabled: true,
        event: "download",
      },
    ] as ActionType[];
    const collectClick = jest.fn();
    const copyClick = jest.fn();
    const downloadClick = jest.fn();
    element.addEventListener("collect", collectClick);
    element.addEventListener("copy", copyClick);
    element.addEventListener("download", downloadClick);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);
    expect(element.shadowRoot?.querySelectorAll(".button-item")).toHaveLength(
      3
    );
    expect(
      element.shadowRoot?.querySelectorAll(".button-dropdown-item")
    ).toHaveLength(1);
    expect(element.shadowRoot?.querySelectorAll("eo-actions")).toHaveLength(1);

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".button-item") as Element
      );
    });
    expect(collectClick).toHaveBeenCalled();

    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-actions")!,
        new CustomEvent("action.click", { detail: { event: "copy" } })
      );
    });
    expect(copyClick).toHaveBeenCalled();

    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-actions")!,
        new CustomEvent("action.click", {
          detail: { event: "download", disabled: true },
        })
      );
    });
    expect(downloadClick).not.toHaveBeenCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
