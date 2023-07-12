import { describe, test, expect, jest } from "@jest/globals";
import { fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { EoMiniActions } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

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
    ];
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
      2
    );
    expect(
      element.shadowRoot?.querySelectorAll(".button-dropdown-item")
    ).toHaveLength(1);
    expect(element.shadowRoot?.querySelectorAll(".dropdown-item")).toHaveLength(
      2
    );

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".button-item") as Element
      );
    });
    expect(collectClick).toHaveBeenCalled();

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(".dropdown-item")[0] as Element
      );
    });
    expect(copyClick).toHaveBeenCalled();

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelectorAll(".dropdown-item")[1] as Element
      );
    });
    expect(downloadClick).not.toHaveBeenCalled();

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
