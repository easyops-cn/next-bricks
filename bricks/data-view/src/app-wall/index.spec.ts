import { fireEvent, waitFor } from '@testing-library/react';
import { describe, test, expect, beforeEach } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { AppWall } from "./index.jsx";
import TWEEN from "@tweenjs/tween.js";

jest.useFakeTimers();
jest.setSystemTime(new Date('2023-04-01 00:00:00'));

describe("data-view.app-wall-card-item", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.app-wall"
    ) as AppWall;

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
    await act(() => {
      waitFor(() => jest.setSystemTime(new Date('2023-04-01 01:00:05')));
    });


    // await act(async () => {
    //   // fireEvent.mouseEnter(cardItem);
    //   const current = TWEEN.now();
    //   TWEEN.update(current + 10000);
    // });

    await act(async () => {
      fireEvent.click(cardItem, { clientX: 1, clientY: 1 });
      jest.advanceTimersByTime(200);
      // const current = TWEEN.now();
      // TWEEN.update(current + 10000);
    });

    await act(async () => {
      fireEvent.click(cardItem, { clientX: 1, clientY: 1 });
      fireEvent.click(cardItem, { clientX: 1, clientY: 1 });
      jest.advanceTimersByTime(200);
      // const current = TWEEN.now();
      // TWEEN.update(current + 10000);
    });

    // expect(element.shadowRoot.querySelectorAll(".relation-line").length).toBe(2);


    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
