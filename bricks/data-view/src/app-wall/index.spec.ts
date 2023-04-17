import { fireEvent } from '@testing-library/react';
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { AppWall } from "./index.jsx";

jest.useFakeTimers();

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

    expect(element.shadowRoot.querySelectorAll(".card-item").length).toBe(52);
    const cardItem = element.shadowRoot.querySelector(".card-item");
    await act(async () => {
      await fireEvent.mouseEnter(cardItem);
    await jest.advanceTimersByTimeAsync(10000);
      expect(element.shadowRoot.querySelectorAll(".relation-line").length).toBe(2);
    });


    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
