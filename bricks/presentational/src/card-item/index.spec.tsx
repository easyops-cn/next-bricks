import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react";
import "./index.jsx";
import { EoCardItem } from "./index.jsx";

jest.mock("@next-core/theme", () => ({}));

class MockEoMiniActions extends HTMLElement {
  triggerEvent(event: string) {
    this.dispatchEvent(new CustomEvent("action.click", { detail: { event } }));
  }
}
customElements.define("eo-mini-actions", MockEoMiniActions);

describe("eo-card-item", () => {
  test("basic usage", async () => {
    const element = document.createElement("eo-card-item") as EoCardItem;
    const onActionClick = jest.fn();
    const onTagClick = jest.fn();
    element.hasHeader = true;
    element.avatar = {
      icon: {
        lib: "easyops",
        category: "default",
        icon: "monitor",
      },
    };

    element.tagConfig = {
      text: "蓝色",
      bgColor: "blue",
      icon: {
        lib: "antd",
        icon: "edit",
      },
    };

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".card-header")).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".card-avatar eo-icon")
    ).toBeTruthy();

    await act(async () => {
      element.hasHeader = false;
      element.avatar = {
        imgSrc: "./test.jpg",
      };
    });
    expect(element.shadowRoot?.querySelector(".card-header")).toBeFalsy();
    expect(element.shadowRoot?.querySelector(".card-avatar img")).toBeTruthy();

    await act(async () => {
      element.avatar = null;
    });
    expect(element.shadowRoot?.querySelector(".card-avatar")).toBeFalsy();

    await act(async () => {
      element.addEventListener("download", onActionClick);
      (
        element.shadowRoot?.querySelector(
          "eo-mini-actions"
        ) as MockEoMiniActions
      ).triggerEvent("download");
    });
    expect(onActionClick).toBeCalled();

    await act(async () => {
      element.hasCover = true;
      element.coverColor = "#d6d6ff";
    });
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper")
    ).toBeTruthy();

    await act(async () => {
      element.coverColor = null;
      element.coverImage = "./test.jpg";
      element.avatarPosition = "cover";
      element.avatar = {
        imgSrc: "./test.jpg",
      };
      element.coverImageSize = "cover";
    });
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper")
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper .card-avatar img")
    ).toBeTruthy();

    await act(async () => {
      element.avatar = {
        icon: {
          lib: "easyops",
          category: "default",
          icon: "monitor",
        },
      };
    });
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper")
    ).toBeTruthy();
    expect(
      element.shadowRoot?.querySelector(".card-cover-wrapper .card-avatar")
    ).toBeTruthy();

    expect(element.shadowRoot?.querySelector(".card-tag").className).toBe(
      "card-tag color-blue text-tag"
    );
    expect(
      element.shadowRoot.querySelector(".card-tag").querySelector("eo-icon")
    ).toBeFalsy();

    act(() => {
      element.addEventListener("tag.click", onTagClick);
      (element.shadowRoot.querySelector(".card-tag") as HTMLElement).click();
    });

    expect(onTagClick).toBeCalledTimes(1);

    await act(async () => {
      element.tagConfig = {
        color: "rgb(209, 210, 211)",
        bgColor: "rgb(123,123,123)",
        icon: {
          lib: "antd",
          icon: "edit",
        },
      };
    });

    expect(element.shadowRoot?.querySelector(".card-tag").className).toBe(
      "card-tag icon-tag"
    );
    expect(
      (element.shadowRoot?.querySelector(".card-tag") as HTMLElement).style
        .color
    ).toBe("rgb(209, 210, 211)");
    expect(
      (element.shadowRoot?.querySelector(".card-tag") as HTMLElement).style
        .background
    ).toBe("rgb(123, 123, 123)");
    expect(
      element.shadowRoot.querySelector(".card-tag").querySelector("eo-icon")
    ).toBeTruthy();

    // selected
    expect(
      element.shadowRoot
        ?.querySelector(".card-wrapper")
        .classList.contains("selected")
    ).toBeFalsy();
    await act(async () => {
      element.selected = true;
    });
    expect(
      element.shadowRoot
        ?.querySelector(".card-wrapper")
        .classList.contains("selected")
    ).toBeTruthy();

    await act(async () => {
      element.styleType = "grayish";
    });
    expect(
      element.shadowRoot
        ?.querySelector(".card-wrapper")
        ?.classList.contains("grayish")
    ).toBe(true);

    await act(async () => {
      element.styleType = "oops" as "grayish";
    });
    expect(
      element.shadowRoot
        ?.querySelector(".card-wrapper")
        ?.classList.contains("oops")
    ).toBe(false);

    await act(async () => {
      element.styleType = "oops" as "grayish";
    });
    expect(
      element.shadowRoot
        ?.querySelector(".card-wrapper")
        ?.classList.contains("oops")
    ).toBe(false);

    expect(
      element.shadowRoot
        ?.querySelector(".card-wrapper")
        ?.classList.contains("show-actions-always")
    ).toBe(true);
    await act(async () => {
      element.showActions = "hover";
    });
    expect(
      element.shadowRoot
        ?.querySelector(".card-wrapper")
        ?.classList.contains("show-actions-hover")
    ).toBe(true);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
