import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/dom";
import "./";
import type { DropdownSelect } from "./index.js";
import "../popover";
import "../menu";
import "../menu-item";
import "../loading-container";

jest.mock("@next-core/theme", () => ({}));

describe("eo-dropdown-select", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-dropdown-select"
    ) as DropdownSelect;
    element.options = [
      {
        label: "A",
        value: "a",
      },
      {
        label: "B",
        value: "b",
      },
    ];
    element.defaultValue = "b";

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <eo-popover
          distance="5"
          placement="bottom-start"
          trigger="click"
        >
          <span
            class="trigger"
            slot="anchor"
          >
            <span
              class="label"
            >
              B
            </span>
            <eo-icon
              icon="caret-down"
              lib="antd"
            />
          </span>
          <div
            class="dropdown"
          >
            <slot
              name="prefix"
            />
            <eo-loading-container
              delay="500"
              style="width: 100%;"
            >
              <eo-menu>
                <eo-menu-item>
                  A
                </eo-menu-item>
                <eo-menu-item
                  class="active"
                >
                  B
                </eo-menu-item>
              </eo-menu>
            </eo-loading-container>
          </div>
        </eo-popover>,
      ]
    `);

    act(() => {
      fireEvent(
        element.shadowRoot!.querySelector("eo-popover")!,
        new CustomEvent("before.visible.change", {
          detail: true,
        })
      );
    });

    expect(element.shadowRoot?.querySelector("eo-icon")).toMatchInlineSnapshot(`
      <eo-icon
        icon="caret-up"
        lib="antd"
      />
    `);

    act(() => {
      fireEvent.click(element.shadowRoot!.querySelector("eo-menu-item")!);
    });

    expect(element.shadowRoot?.querySelector("eo-menu")).toMatchInlineSnapshot(`
      <eo-menu>
        <eo-menu-item
          class="active"
        >
          A
        </eo-menu-item>
        <eo-menu-item
          class="undefined"
        >
          B
        </eo-menu-item>
      </eo-menu>
    `);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });

  test("setDefaultOption", async () => {
    const element = document.createElement(
      "eo-dropdown-select"
    ) as DropdownSelect;
    element.defaultValue = "c";

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes).toMatchInlineSnapshot(`
      NodeList [
        <style>
          styles.shadow.css
        </style>,
        <eo-popover
          distance="5"
          placement="bottom-start"
          trigger="click"
        >
          <span
            class="trigger"
            slot="anchor"
          >
            <span
              class="label"
            >
              PLEASE_SELECT
            </span>
            <eo-icon
              icon="caret-down"
              lib="antd"
            />
          </span>
          <div
            class="dropdown"
          >
            <slot
              name="prefix"
            />
            <eo-loading-container
              delay="500"
              style="width: 100%;"
            >
              <eo-menu />
            </eo-loading-container>
          </div>
        </eo-popover>,
      ]
    `);

    act(() => {
      element.setDefaultOption({
        label: "C",
        value: "c",
      });
    });

    expect(element.shadowRoot?.querySelector(".label")).toMatchInlineSnapshot(`
      <span
        class="label"
      >
        C
      </span>
    `);

    element.options = [
      {
        label: "A",
        value: "a",
      },
      {
        label: "B",
        value: "b",
      },
    ];
    await act(async () => {
      await (global as any).flushPromises();
    });

    expect(element.shadowRoot?.querySelector(".label")).toMatchInlineSnapshot(`
      <span
        class="label"
      >
        C
      </span>
    `);

    expect(element.shadowRoot?.querySelector("eo-menu")).toMatchInlineSnapshot(`
      <eo-menu
        mode="vertical"
      >
        <eo-menu-item>
          A
        </eo-menu-item>
        <eo-menu-item>
          B
        </eo-menu-item>
      </eo-menu>
    `);

    act(() => {
      document.body.removeChild(element);
    });
  });
});
