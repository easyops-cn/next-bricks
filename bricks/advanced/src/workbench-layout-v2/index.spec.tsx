import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./";
import type { EoWorkbenchLayoutV2 } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

describe("eo-workbench-layout-v2", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-workbench-layout-v2"
    ) as EoWorkbenchLayoutV2;

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

    element.toolbarBricks = {
      useBrick: [
        {
          brick: "div",
          properties: {
            textContent: "tool-1",
            className: "tool-brick",
          },
        },
        {
          brick: "div",
          properties: {
            textContent: "tool-2",
            className: "tool-brick",
          },
        },
      ],
    };
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

    expect(element).toBeTruthy();

    const mockSaveEvent = jest.fn();
    const mockCancelEvent = jest.fn();
    element.addEventListener("save", mockSaveEvent);
    element.addEventListener("cancel", mockCancelEvent);

    act(() => {
      document.body.appendChild(element);
    });
    expect(element).toBeTruthy();

    expect(
      (element?.querySelector("eo-checkbox") as HTMLElement).getAttribute(
        "value"
      )
    ).toBe("card-1,card-2");
    expect(element?.querySelector(".layout")?.childNodes.length).toBe(2);
    expect(element?.querySelectorAll("eo-icon[icon='delete']").length).toBe(2);

    const clickSaveBtn = () => {
      (
        element?.querySelector("eo-button[type='primary']") as HTMLElement
      )?.click();
    };

    act(() => {
      clickSaveBtn();
    });

    expect(mockSaveEvent).nthCalledWith(
      1,
      expect.objectContaining({
        detail: [
          { w: 2, h: 1, x: 0, y: 0, i: "card-1", moved: false, static: false },
          { w: 1, h: 1, x: 0, y: 1, i: "card-2", moved: false, static: false },
        ],
      })
    );

    // insert element
    await act(async () => {
      await element?.querySelector("eo-checkbox")?.dispatchEvent(
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
                h: 2,
              },
            },
          ],
        })
      );
    });

    expect(element?.querySelector(".layout")?.childNodes.length).toBe(3);

    act(() => {
      clickSaveBtn();
    });

    expect(mockSaveEvent).nthCalledWith(
      2,
      expect.objectContaining({
        detail: [
          { w: 2, h: 1, x: 0, y: 0, i: "card-1", moved: false, static: false },
          {
            w: 1,
            h: 2,
            x: 0,
            y: 1,
            i: "card-2",
            minH: 1,
            moved: false,
            static: false,
          },
          {
            w: 1,
            h: 2,
            x: 1,
            y: 1,
            i: "card-3",
            minH: 2,
            moved: false,
            static: false,
          },
        ],
      })
    );

    expect(element?.querySelector(".layout")?.childNodes.length).toBe(3);

    // delete element
    await act(async () => {
      (
        element?.querySelectorAll("eo-icon[icon='delete']")[1] as HTMLElement
      ).click();
    });

    expect(element?.querySelector(".layout")?.childNodes.length).toBe(2);

    // delete component item
    await act(async () => {
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
      ];
    });

    expect(element?.querySelector(".layout")?.childNodes.length).toBe(1);

    // reset
    await act(async () => {
      (element?.querySelector("eo-button[danger]") as HTMLElement).click();
    });

    expect(element?.querySelector(".layout")?.childNodes.length).toBe(0);
    expect(
      (element?.querySelector("eo-checkbox") as HTMLElement).getAttribute(
        "value"
      )
    ).toBe("");

    expect(element?.querySelectorAll(".tool-brick")).toHaveLength(2);
    act(() => {
      (element?.querySelectorAll("eo-button")[2] as HTMLElement).click();
    });

    expect(mockCancelEvent).toBeCalledTimes(1);

    act(() => {
      document.body.removeChild(element);
    });
    expect(element?.childNodes.length).toBe(0);
  });
});
