import { fireEvent } from '@testing-library/react';
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { AppWall } from "./index.jsx";
import { dataSource, relations } from './mockData.js';
import TWEEN from "@tweenjs/tween.js";
import * as Utils from "./utils.js";
import { Ele } from './interface.js';

jest.useFakeTimers();

const mockedFindElementByEvent = jest.spyOn(Utils, "findElementByEvent");
const customGlobal = window as any;
describe("data-view.app-wall", () => {
  customGlobal.innerWidth = 500;
  customGlobal.innerHeight = 800;
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.app-wall"
    ) as AppWall;
    element.dataSource = dataSource as Utils.AppData[];
    element.relations = relations;

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    await act(async () => {
      TWEEN.update(5000);
    })
    const cardItems = element.shadowRoot.querySelectorAll(".card-item-container") as any as Ele[];
    // expect(cardItems).toHaveLength(52);

    mockedFindElementByEvent.mockReturnValue(cardItems[0]);
    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelector(".appwall-container"));
      jest.advanceTimersByTime(300);
      TWEEN.update(3000);
    })
    // expect(element.shadowRoot.querySelector(".mask").hasAttribute("hidden")).toBeTruthy();
    // expect(element.shadowRoot.querySelector(".infoWrapper")).toBeFalsy();

    // await act(async () => {
    //   TWEEN.update(3000);
    // })
    fireEvent.click(element.shadowRoot.querySelector(".mask"));
    fireEvent.click(element.shadowRoot.querySelector(".closeBtn"));
    fireEvent.click(element.shadowRoot.querySelector(".appwall-container"));
    fireEvent.resize(window);
    // expect(element.shadowRoot.querySelector(".mask").hasAttribute("hidden")).toBeTruthy();

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});