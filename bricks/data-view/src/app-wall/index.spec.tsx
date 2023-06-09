import { fireEvent, render } from "@testing-library/react";
import { describe, test, expect, jest } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { AppWall } from "./index.jsx";
import { dataSource, relations } from "./mockData.js";
import * as Utils from "./utils.js";
import { Ele } from "./interface.js";
import { AppWallElement } from "./app-wall.js";
import React from "react";

jest.useFakeTimers();
const customGlobal = window as any;
const mockedFindElementByEvent = jest.spyOn(Utils, "findElementByEvent");
describe("data-view.app-wall", () => {
  beforeEach(() => {
    customGlobal.innerWidth = 500;
    customGlobal.innerHeight = 800;
  });
  test("createElement data-view.app-wall", () => {
    const element = document.createElement("data-view.app-wall") as AppWall;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.dataSource = dataSource as Utils.AppData[];
      element.relations = relations;
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("render AppWallElement", () => {
    const table = Array.from({
      length: 262,
    }).map((v, i) => ({
      key: `${i}`,
      shortName: `shortName-${i}`,
      status: i % 5 ? "normal" : "warning",
      cardItemProps: {
        cardTitle: "cardTitle",
        description: "description",
      },
      systemCardProps: {
        cardTitle: "cardTitle",
        description: "description",
      },
      trapezoidalProps: {
        leftBtnName: "leftBtnName",
        rightBtnName: "rightBtnName",
        clusters: Array.from({
          length: 3,
        }).map((c, j) => ({
          title: `${j}集群容器`,
          type: j % 2 ? "host" : "k8s",
          data: Array.from({
            length: 100,
          }).map((p) => ({
            type: "physical-machine",
            nodeTitle: "255.255.255",
          })),
        })),
      },
    })) as any as Utils.AppData[];

    const onSystemCardButtonClick = jest.fn();
    const handleCardDbClick = jest.fn();
    const rightBtnOnClick = jest.fn();
    const leftBtnOnClick = jest.fn();
    const index = 0;
    const { container, asFragment } = render(
      <AppWallElement
        dataSource={table}
        relations={[
          {
            source: `${index}`,
            target: "3",
          },
          {
            source: "7",
            target: `${index}`,
          },
        ]}
        useDblclick={false}
        onSystemCardButtonClick={onSystemCardButtonClick}
        handleCardDbClick={handleCardDbClick}
        rightBtnOnClick={rightBtnOnClick}
        leftBtnOnClick={leftBtnOnClick}
      />
    );
    expect(asFragment()).toBeTruthy();
    let appwall: Element = null,
      cardItems: Ele = null;

    act(() => {
      fireEvent.resize(window);
      appwall = container.querySelector(".appwall-container");
      cardItems = container.querySelectorAll(".card-item-container")[
        index
      ] as any as Ele;
      mockedFindElementByEvent.mockReturnValue(cardItems);
    });
    /**
     * handleMouseover
     */
    act(() => {
      jest.advanceTimersByTime(20000); //立即到transform的onComplete执行
      fireEvent.mouseOver(appwall);
      jest.runOnlyPendingTimers(); //执行【handleMouseover】中的定时器,触发的showElementBetweenRelation
      jest.runOnlyPendingTimers(); //执行【showElementBetweenRelation】中的onStart
      jest.advanceTimersByTime(20000); //立即到【showElementBetweenRelation】的onComplete执行

      fireEvent.mouseOver(appwall);
      jest.runOnlyPendingTimers(); //执行【handleMouseover】中的定时器
      jest.runOnlyPendingTimers(); //执行【restoreElementState】中的onStart
      jest.advanceTimersByTime(20000); //立即到【restoreElementState】的onComplete执行
    });

    /**
     * handleClick && mask.click
     */
    act(() => {
      fireEvent.click(appwall);
      jest.runOnlyPendingTimers(); //执行定时器,
      jest.runOnlyPendingTimers(); //执行【showAppInfoAnimate】false中的onStart
      jest.advanceTimersByTime(30000);

      fireEvent.click(container.querySelector(".mask"));
      jest.runOnlyPendingTimers(); //执行定时器,
      jest.runOnlyPendingTimers(); //执行【showAppInfoAnimate】true中的onStart
      jest.advanceTimersByTime(30000);
    });

    /**
     * handleDbClick && closeBtnRef
     */
    act(() => {
      fireEvent.dblClick(appwall);
      jest.runOnlyPendingTimers(); //执行定时器,
      jest.runOnlyPendingTimers(); //执行onStart
      jest.advanceTimersByTime(20000);
      fireEvent.click(container.querySelector(".closeBtn"));
    });
  });
});
