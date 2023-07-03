import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent, createEvent } from "@testing-library/react";
import "./";
import { IconSelect } from "./index.js";

const icons = [
  {
    title: "account",
    icon: {
      lib: "easyops",
      category: "default",
      icon: "account",
    },
  },
  {
    title: "account-book",
    icon: {
      lib: "antd",
      icon: "account-book",
      theme: "outlined",
    },
  },
  {
    title: "address-card",
    icon: {
      lib: "fa",
      icon: "address-card",
      // "prefix": "fas",
    },
  },
];

jest.mock("@next-core/utils/general", () => {
  return {
    unwrapProvider: jest.fn().mockImplementation((providerName) => {
      switch (providerName) {
        case "icons.get-libs": {
          return () =>
            Promise.resolve([
              {
                title: "easyops",
                lib: "easyops",
              },
              {
                title: "antd design",
                lib: "antd",
              },
              {
                title: "font awesome",
                lib: "fa",
              },
            ]);
        }
        case "icons.search-icons": {
          return (params: { lib?: string; q?: string }) => {
            const filteredIcons = icons.filter((icon) => {
              return (
                (params.lib ? icon.icon.lib === params.lib : true) &&
                (params.q ? icon.title.includes(params.q) : true)
              );
            });
            return Promise.resolve({
              page: 1,
              pageSize: 20,
              total: filteredIcons.length,
              list: filteredIcons,
            });
          };
        }
      }
    }),
  };
});

jest.mock("@next-core/theme", () => ({}));

describe("eo-icon-select", () => {
  test("basic usage", async () => {
    const onChange = jest.fn();
    const element = document.createElement("eo-icon-select") as IconSelect;
    element.addEventListener("change", onChange);

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    const modal = element.shadowRoot?.querySelector("eo-modal") as HTMLElement;
    (modal as any).open = jest.fn();
    (modal as any).close = jest.fn();

    await act(async () => {
      fireEvent(modal, createEvent("open", modal));
      await (global as any).flushPromises();
    });

    expect(
      element.shadowRoot?.querySelectorAll(".icon-container")
    ).toHaveLength(3);

    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".icon-container") as HTMLElement
      );
    });
    act(() => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".color-box") as HTMLElement
      );
    });
    act(() => {
      fireEvent(modal, createEvent("confirm", modal));
    });

    expect(onChange).toBeCalledWith(
      expect.objectContaining({
        detail: {
          lib: "easyops",
          category: "default",
          icon: "account",
          color: "green",
        },
      })
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
