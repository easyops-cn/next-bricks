import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import { fireEvent } from "@testing-library/react";
import type {
  getLibs,
  LibInfo,
  IconInfo,
} from "@next-bricks/icons/data-providers/get-libs";
import type { searchIcons } from "@next-bricks/icons/data-providers/search-icons";
import "./";
import { IconSelect } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

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
] as IconInfo[];

const mockGetLibs = jest.fn<typeof getLibs>().mockResolvedValue([
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
] as LibInfo[]);

const mockSearchIcons = jest
  .fn<typeof searchIcons>()
  .mockImplementation((params) => {
    const filteredIcons = icons.filter((icon) => {
      return (
        (params?.lib ? icon.icon.lib === params?.lib : true) &&
        (params?.q ? icon.title.includes(params?.q) : true)
      );
    });
    return Promise.resolve({
      page: 1,
      pageSize: 20,
      total: filteredIcons.length,
      list: filteredIcons,
    });
  });

customElements.define(
  "icons.get-libs",
  class extends HTMLElement {
    resolve = mockGetLibs;
  }
);

customElements.define(
  "icons.search-icons",
  class extends HTMLElement {
    resolve = mockSearchIcons;
  }
);

class ModalElement extends HTMLElement {
  open() {
    this.dispatchEvent(new Event("open"));
  }
  close() {
    this.dispatchEvent(new Event("close"));
  }
  confirm() {
    this.dispatchEvent(new Event("confirm"));
  }
}
customElements.define("eo-modal", ModalElement);

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

    const modal = element.shadowRoot?.querySelector("eo-modal") as ModalElement;

    await act(async () => {
      fireEvent.click(
        element.shadowRoot?.querySelector(".show-icon") as HTMLSpanElement
      );
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
      modal.confirm();
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
      fireEvent(
        element.shadowRoot?.querySelector("eo-search") as HTMLElement,
        new CustomEvent("search", { detail: "query" })
      );
    });
    expect(mockSearchIcons).lastCalledWith({
      lib: "easyops",
      page: 1,
      pageSize: 100,
      q: "query",
    });

    act(() => {
      fireEvent(
        element.shadowRoot?.querySelector("eo-radio") as HTMLElement,
        new CustomEvent("change", { detail: { value: "antd" } })
      );
    });
    expect(mockSearchIcons).lastCalledWith({
      lib: "antd",
      page: 1,
      pageSize: 100,
      q: "query",
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
