import { fireEvent } from '@testing-library/react';
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { AppWall } from "./index.jsx";
import { dataSource, relations } from './mockData.js';
import TWEEN from "@tweenjs/tween.js";
import { AppData } from './utils.js';

jest.useFakeTimers();

describe("data-view.app-wall-card-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.app-wall"
    ) as AppWall;
    element.dataSource = dataSource as AppData[];
    element.relations = relations

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    const cardItem = element.shadowRoot.querySelector(".card-item");
    document.elementFromPoint = jest.fn().mockReturnValue(element);
    element.shadowRoot.elementFromPoint = jest.fn().mockImplementation((clientX, clientY) => {
      if (clientX === 1 && clientY === 1)
        return cardItem;
    });

    expect(element.shadowRoot.querySelectorAll(".card-item").length).toBe(52);

    // await act(async () => {
    //   // fireEvent.mouseEnter(cardItem);
    // });

    await act(async () => {
      fireEvent.click(cardItem, { clientX: 1, clientY: 1 });
      jest.advanceTimersByTime(200);
    });

    await act(async () => {
      fireEvent.click(cardItem, { clientX: 1, clientY: 1 });
      fireEvent.click(cardItem, { clientX: 1, clientY: 1 });
      jest.advanceTimersByTime(200);
    });

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
