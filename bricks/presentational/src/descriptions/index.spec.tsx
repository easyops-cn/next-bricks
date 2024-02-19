import React from "react";
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { Descriptions } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

jest.mock("@next-core/react-runtime", () => ({
  ReactUseMultipleBricks: () => {
    return <div>mock element</div>;
  },
}));

describe("eo-descriptions", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-descriptions") as Descriptions;

    element.descriptionTitle = "hello world";
    element.list = [
      {
        label: "姓名",
        text: "Tom",
      },
      {
        label: "年龄",
        text: 18,
      },
      {
        label: "身高",
        text: "180",
        group: "hiddenHight",
      },
      {
        label: "爱好",
        text: "篮球",
      },
      {
        label: "标签",
        useBrick: {
          brick: "eo-tag-list",
          properties: {
            list: [
              {
                text: "a",
                key: "a",
                color: "red",
              },
              {
                text: "b",
                key: "b",
                color: "blue",
              },
              {
                text: "c",
                key: "c",
                color: "green",
              },
            ],
          },
        },
      },
    ];
    element.column = 3;
    element.bordered = true;
    element.hideGroups = ["hiddenHight"];

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(
      element.shadowRoot?.querySelectorAll(".description-item")?.length
    ).toBe(4);
    expect(
      element.shadowRoot?.querySelector(".description-item")?.className
    ).toBe("description-item horizontal bordered");

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
