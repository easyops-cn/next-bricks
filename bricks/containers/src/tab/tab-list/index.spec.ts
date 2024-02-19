import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./index.jsx";
import "../tab-group/index.jsx";
import "../tab-item/index.jsx";
import type { TabList } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

describe("eo-tab-list", () => {
  test("basic usage", async () => {
    const onTabSelect = jest.fn();
    const element = document.createElement("eo-tab-list") as TabList;
    element.tabs = [
      "新增",
      {
        text: "编辑",
        panel: "编辑",
      },
      "删除",
    ];

    element.activePanel = "编辑";
    element.addEventListener("tab.select", onTabSelect);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot?.childNodes.length).toBe(2);

    expect(element.shadowRoot.innerHTML).toMatchInlineSnapshot(
      `"<style>tab-list.shadow.css</style><eo-tab-group active-panel="编辑"><div class="tabs-wrapper" slot="nav"><eo-tab-item text="新增" panel="新增">新增</eo-tab-item><eo-tab-item active="" text="编辑" panel="编辑">编辑</eo-tab-item><eo-tab-item text="删除" panel="删除">删除</eo-tab-item></div><slot name="extra" slot="extra"></slot><slot name="新增" slot="新增"></slot><slot name="编辑" slot="编辑"></slot><slot name="删除" slot="删除"></slot></eo-tab-group>"`
    );

    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelectorAll("eo-tab-item")[0]);
    });
    expect(onTabSelect).lastCalledWith(
      expect.objectContaining({
        detail: "新增",
      })
    );
    expect(element.activePanel).toBe("新增");

    act(() => {
      document.body.removeChild(element);
    });

    expect(document.body.contains(element)).toBeFalsy();
  });
});
