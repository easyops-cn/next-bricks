import { fireEvent, getByText } from "@testing-library/react";
import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { CascaderBrick } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-cascader", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-cascader") as CascaderBrick;
    const onChange = jest.fn();

    element.options = [
      {
        value: "zhejiang",
        label: "Zhejiang",
        children: [
          {
            value: "hangzhou",
            label: "Hangzhou",
            children: [
              {
                value: "xihu",
                label: "West Lake",
              },
            ],
          },
        ],
      },
      {
        value: "jiangsu",
        label: "Jiangsu",
        children: [
          {
            value: "nanjing",
            label: "Nanjing",
            children: [
              {
                value: "zhonghuamen",
                label: "Zhong Hua Men",
              },
            ],
          },
        ],
      },
    ];
    element.suffixIcon = {
      lib: "antd",
      icon: "setting",
      theme: "outlined",
    };
    element.showSearch = true;
    element.addEventListener("cascader.change", onChange);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    expect(element.shadowRoot?.querySelector("eo-icon")).toBeTruthy();
    act(() => {
      fireEvent.mouseDown(
        element.shadowRoot?.querySelector(".ant-select-selector") as HTMLElement
      );
    });
    expect(
      element.shadowRoot?.querySelector(".ant-select-dropdown")
    ).toBeTruthy();

    act(() => {
      fireEvent.click(
        getByText(
          element.shadowRoot?.querySelector(
            ".ant-select-dropdown"
          ) as HTMLElement,
          "Zhejiang"
        )
      );
    });
    act(() => {
      fireEvent.click(
        getByText(
          element.shadowRoot?.querySelector(
            ".ant-select-dropdown"
          ) as HTMLElement,
          "Hangzhou"
        )
      );
    });
    act(() => {
      fireEvent.click(
        getByText(
          element.shadowRoot?.querySelector(
            ".ant-select-dropdown"
          ) as HTMLElement,
          "West Lake"
        )
      );
    });
    await act(async () => {
      await (global as any).flushPromises();
    });
    expect(onChange).lastCalledWith(
      expect.objectContaining({
        type: "cascader.change",
        detail: {
          value: ["zhejiang", "hangzhou", "xihu"],
          selectedOptions: [
            {
              value: "zhejiang",
              label: "Zhejiang",
              children: [
                {
                  value: "hangzhou",
                  label: "Hangzhou",
                  children: [
                    {
                      value: "xihu",
                      label: "West Lake",
                    },
                  ],
                },
              ],
            },
            {
              value: "hangzhou",
              label: "Hangzhou",
              children: [
                {
                  value: "xihu",
                  label: "West Lake",
                },
              ],
            },
            {
              value: "xihu",
              label: "West Lake",
            },
          ],
        },
      })
    );

    act(() => {
      fireEvent.change(
        element.shadowRoot?.querySelector(
          ".ant-select-selector input"
        ) as HTMLElement,
        { target: { value: "lake" } }
      );
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
