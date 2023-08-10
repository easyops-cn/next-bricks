import { describe, test, expect, jest } from "@jest/globals";
import { render, act, createEvent, fireEvent } from "@testing-library/react";
import "./";
import { EoInfoCardItem, EoInfoCardItemComponent } from "./index.js";

jest.mock("@next-core/theme", () => ({}));

const mockHistoryPush = jest.fn();
jest.mock("@next-core/runtime", () => ({
  getHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe("eo-info-card-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "eo-info-card-item"
    ) as EoInfoCardItem;

    Object.assign(element, {
      title: "item1",
      description: "description",
      url: "/test",
      cardIcon: {
        shape: "circle",
        color: "blue",
        icon: {
          icon: "chart-pie",
          lib: "fa",
        },
      },
      detailList: [
        {
          title: "detail1",
          desc: "desc1",
        },
        {
          title: "detail2",
          desc: "desc2",
        },
      ],
    });

    expect(element.shadowRoot).toBeFalsy();

    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBeGreaterThan(1);

    expect(element.shadowRoot?.querySelector(".card-wrapper")).toBeTruthy();

    expect(
      element.shadowRoot?.querySelector(".card-detail-list-wrapper").childNodes
        .length
    ).toBe(2);
    expect(
      (
        element.shadowRoot?.querySelector(
          ".card-detail-list-wrapper"
        ) as HTMLElement
      ).style.display
    ).toBe("flex");

    fireEvent.click(
      element.shadowRoot?.querySelector(".card-wrapper") as HTMLElement
    );

    expect(mockHistoryPush).toBeCalledWith("/test");

    expect(element.hasIcon).toBeTruthy();

    await act(async () => {
      element.cardIcon = null;
    });

    expect(element.hasIcon).toBeFalsy();

    const div = document.createElement("div");
    div.setAttribute("slot", "icon");

    await act(async () => {
      element.appendChild(div);
    });

    expect(element.hasIcon).toBeTruthy();

    const action = document.createElement("div");
    action.setAttribute("slot", "action");

    const stopImmediatePropagation = jest.fn();
    const mockEvent = createEvent.click(
      element.shadowRoot?.querySelector(
        "slot[name='action']"
      ) as HTMLSlotElement
    );
    mockEvent.stopImmediatePropagation = stopImmediatePropagation;

    await act(async () => {
      element.appendChild(action);
    });

    fireEvent(action as HTMLElement, mockEvent);

    expect(stopImmediatePropagation).toBeCalled();

    act(() => {
      element.removeChild(div);
      element.removeChild(action);
      document.body.removeChild(element);
    });
    expect(element.shadowRoot?.childNodes.length).toBe(0);
    expect(element?.childNodes.length).toBe(0);
  });
});
