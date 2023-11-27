import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoWorkbenchLayout } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-workbench-layout", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-workbench-layout"
    ) as EoWorkbenchLayout;

    element.isEdit = true;
    element.layouts = [
      {
        i: "card-1",
        x: 0,
        y: 0,
        w: 2,
        h: 1,
      },
      {
        i: "card-2",
        x: 0,
        y: 1,
        w: 1,
        h: 1,
      },
    ];
    element.componentList = [
      {
        title: "card-1",
        useBrick: {
          brick: "div",
          properties: {
            textContent: "card-1",
          },
        },
        position: {
          i: "card-1",
          x: 0,
          y: 0,
          w: 2,
          h: 1,
        },
        key: "card-1",
      },
      {
        title: "card-2",
        useBrick: {
          brick: "div",
          properties: {
            textContent: "card-2",
          },
        },
        position: {
          i: "card-2",
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        },
        key: "card-2",
      },
      {
        title: "card-3",
        useBrick: {
          brick: "div",
          properties: {
            textContent: "card-3",
          },
        },
        position: {
          i: "card-3",
          x: 0,
          y: 0,
          w: 1,
          h: 1,
        },
        key: "card-3",
      },
    ];

    expect(element.shadowRoot).toBeFalsy();

    const mockSaveEvent = jest.fn();
    const mockCancelEvent = jest.fn();
    element.addEventListener("save", mockSaveEvent);
    element.addEventListener("cancel", mockCancelEvent);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(
      (
        element.shadowRoot?.querySelector("eo-checkbox") as HTMLElement
      ).getAttribute("value")
    ).toBe("card-1,card-2");
    expect(
      element.shadowRoot?.querySelector(".layout")?.childNodes.length
    ).toBe(2);
    expect(
      element.shadowRoot?.querySelectorAll("eo-icon[icon='delete']").length
    ).toBe(2);

    const clickSaveBtn = () => {
      (
        element.shadowRoot?.querySelector(
          "eo-button[type='primary']"
        ) as HTMLElement
      )?.click();
    };

    act(() => {
      clickSaveBtn();
    });

    expect(mockSaveEvent).nthCalledWith(
      1,
      expect.objectContaining({
        detail: [
          {
            i: "card-1",
            x: 0,
            y: 0,
            w: 2,
            h: 1,
          },
          {
            i: "card-2",
            x: 0,
            y: 1,
            w: 1,
            h: 1,
          },
        ],
      })
    );

    // insert element
    await act(async () => {
      await element.shadowRoot?.querySelector("eo-checkbox")?.dispatchEvent(
        new CustomEvent("change", {
          detail: [
            {
              label: "card-1",
              value: "card-1",
              key: "card-1",
            },
            {
              label: "card-2",
              value: "card-2",
              key: "card-2",
            },
            {
              label: "card-3",
              value: "card-3",
              key: "card-3",
              position: {
                i: "card-3",
                x: 0,
                y: 0,
                w: 1,
                h: 1,
              },
            },
          ],
        })
      );
    });

    expect(
      element.shadowRoot?.querySelector(".layout")?.childNodes.length
    ).toBe(3);

    act(() => {
      clickSaveBtn();
    });

    expect(mockSaveEvent).nthCalledWith(
      2,
      expect.objectContaining({
        detail: [
          {
            i: "card-1",
            x: 0,
            y: 0,
            w: 2,
            h: 1,
          },
          {
            i: "card-2",
            x: 0,
            y: 1,
            w: 1,
            h: 1,
          },
          {
            i: "card-3",
            x: 1,
            y: Infinity,
            w: 1,
            h: 1,
          },
        ],
      })
    );

    expect(
      element.shadowRoot?.querySelector(".layout")?.childNodes.length
    ).toBe(3);

    // delete element
    await act(async () => {
      (
        element.shadowRoot?.querySelectorAll(
          "eo-icon[icon='delete']"
        )[1] as HTMLElement
      ).click();
    });

    expect(
      element.shadowRoot?.querySelector(".layout")?.childNodes.length
    ).toBe(2);

    // reset
    await act(async () => {
      (
        element.shadowRoot?.querySelector("eo-button[danger]") as HTMLElement
      ).click();
    });

    expect(
      element.shadowRoot?.querySelector(".layout")?.childNodes.length
    ).toBe(0);
    expect(
      (
        element.shadowRoot?.querySelector("eo-checkbox") as HTMLElement
      ).getAttribute("value")
    ).toBe("");

    act(() => {
      (
        element.shadowRoot?.querySelectorAll("eo-button")[2] as HTMLElement
      ).click();
    });

    expect(mockCancelEvent).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
  });
});
