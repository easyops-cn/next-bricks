import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent, getByText } from "@testing-library/dom";
import "./";
import type { TreeSelectBrick } from "./index.js";

jest.mock("@next-core/theme", () => ({}));
jest.mock("@next-core/react-runtime");

describe("eo-tree-select", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-tree-select") as TreeSelectBrick;

    element.multiple = true;
    element.treeData = [
      {
        title: "parent 1",
        key: "0-0",
        value: "0-0",
        children: [
          {
            title: "intermediate 1-0",
            value: "0-0-0",
            key: "0-0-0",
            children: [
              {
                title: "leaf a",
                value: "0-0-0-0",
                key: "0-0-0-0",
              },
              {
                title: "leaf b",
                value: "0-0-0-1",
                key: "0-0-0-1",
              },
            ],
          },
          {
            title: "intermediate 1-1",
            key: "0-0-1",
            value: "0-0-1",
            children: [{ title: "leaf c", key: "leaf c", value: "leaf c" }],
          },
        ],
      },
    ];
    element.suffixIcon = {
      icon: "calendar",
      lib: "easyops",
    };

    const mockChangeEvent = jest.fn();
    const mockSearchEvent = jest.fn();
    const mockSelectEvent = jest.fn();
    const mockExpandEvent = jest.fn();
    element.addEventListener("change", mockChangeEvent);
    element.addEventListener("search", mockSearchEvent);
    element.addEventListener("select", mockSelectEvent);
    element.addEventListener("expand", mockExpandEvent);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });

    act(() => {
      fireEvent.mouseDown(element.shadowRoot!.querySelector("input")!);
    });

    act(() => {
      fireEvent.click(
        element.shadowRoot!.querySelector(".ant-select-tree-switcher")!
      );
    });

    expect(mockExpandEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        detail: {
          keys: ["0-0"],
        },
      })
    );

    act(() => {
      fireEvent.click(
        element.shadowRoot!.querySelectorAll(".ant-select-tree-switcher")[1]
      );
    });

    expect(mockExpandEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        detail: {
          keys: ["0-0", "0-0-0"],
        },
      })
    );

    act(() => {
      fireEvent.click(
        getByText(
          element.shadowRoot!.querySelector(".ant-select-tree")!,
          "leaf a"
        )
      );
    });

    expect(mockSelectEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        detail: {
          value: "0-0-0-0",
        },
      })
    );

    expect(mockChangeEvent).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        detail: {
          value: ["0-0-0-0"],
        },
      })
    );

    act(() => {
      fireEvent.change(element.shadowRoot!.querySelector("input")!, {
        target: {
          value: "leaf c",
        },
      });
    });

    expect(
      element.shadowRoot!.querySelector(".ant-select-tree-list-holder-inner")
        ?.childNodes.length
    ).toBe(3);

    expect(mockSearchEvent).toBeCalledWith(
      expect.objectContaining({
        detail: "leaf c",
      })
    );

    act(() => {
      fireEvent.click(
        getByText(
          element.shadowRoot!.querySelector(".ant-select-tree")!,
          "leaf c"
        )
      );
    });

    expect(mockSelectEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        detail: {
          value: "leaf c",
        },
      })
    );

    expect(mockChangeEvent).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        detail: {
          value: ["0-0-0-0", "leaf c"],
        },
      })
    );

    expect(element.value).toEqual(["0-0-0-0", "leaf c"]);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
