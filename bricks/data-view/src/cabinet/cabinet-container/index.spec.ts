import { describe, test, expect, jest, afterEach } from "@jest/globals";
import { act } from "react-dom/test-utils";
import { fireEvent } from "@testing-library/react";
import "./index.jsx";

import { CabinetContainer } from "./index.jsx";
import { CabinetNodeProps } from "../cabinet-node/index.js";

const data: CabinetNodeProps[] = [
  {
    type: "physical-machine",
    nodeTitle: "255.255.255.255",
  },
  {
    type: "physical-machine",
    nodeTitle: "255.255.200.255",
  },
];
jest.mock("../../hooks/index.js", () => {
  return {
    useResizeObserver: jest
      .fn()
      .mockReturnValueOnce([
        { current: null },
        { clientWidth: 462, clientHeight: 500 },
      ])
      .mockReturnValueOnce([
        { current: null },
        { clientWidth: 462, clientHeight: 500 },
      ])
      .mockReturnValueOnce([
        { current: null },
        { clientWidth: 462, clientHeight: 500 },
      ])
      .mockReturnValueOnce([
        { current: null },
        { clientWidth: 462, clientHeight: 500 },
      ])
      .mockReturnValueOnce([
        { current: null },
        { clientWidth: 462, clientHeight: 500 },
      ])
      .mockReturnValueOnce([
        { current: null },
        { clientWidth: 100, clientHeight: 280 },
      ])
      .mockReturnValueOnce([
        { current: null },
        { clientWidth: 20, clientHeight: 80 },
      ]),

    // 最大 12 ，最小42;
  };
});

describe("data-view.cabinet-container", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("basic usage and maxSize", async () => {
    const element = document.createElement(
      "data-view.cabinet-container"
    ) as CabinetContainer;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.data = data;
      element.customTitle = "集群容器";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    const nodeElement = element.shadowRoot.querySelector(".item");
    expect(element.shadowRoot.querySelector(".footer").textContent).toBe(
      "集群容器"
    );
    expect(
      element.shadowRoot.querySelector(".itemContent").getAttribute("style")
    ).toBe("width: 145px;");
    expect(nodeElement.getAttribute("style")).toBe("width: 118px;");
    const wrapperElement = element.shadowRoot.querySelector(".wrapper");
    jest.useFakeTimers();
    fireEvent.click(wrapperElement);
    fireEvent.click(nodeElement);
    jest.advanceTimersByTime(400);
    fireEvent.doubleClick(nodeElement);
    fireEvent.doubleClick(wrapperElement);
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("render minSize", async () => {
    const element = document.createElement(
      "data-view.cabinet-container"
    ) as CabinetContainer;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.data = new Array(42).fill(data[0]);
      element.customTitle = "k8s容器";
      element.type = "k8s";
      element.status = "active";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot.querySelector(".footer").textContent).toBe(
      "k8s容器"
    );
    expect(
      element.shadowRoot
        .querySelector(".container")
        .classList.contains("container-active")
    );
    expect(
      element.shadowRoot
        .querySelector(".wrapper")
        .classList.contains("wrapper-active")
    );
    expect(
      element.shadowRoot.querySelector(".itemContent").getAttribute("style")
    ).toBe("width: 62px;");
    expect(
      element.shadowRoot.querySelector(".item").getAttribute("style")
    ).toBe("width: 56px;");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("render data is empty", async () => {
    const element = document.createElement(
      "data-view.cabinet-container"
    ) as CabinetContainer;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.data = [];
      element.customTitle = "淡化";
      element.type = "k8s";
      element.status = "faded";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot.querySelector(".footer").textContent).toBe(
      "淡化"
    );
    expect(
      element.shadowRoot
        .querySelector(".container")
        .classList.contains("container-faded")
    );
    expect(
      element.shadowRoot
        .querySelector(".wrapper")
        .classList.contains("wrapper-faded")
    );
    expect(
      element.shadowRoot.querySelector(".contentLayout").innerHTML
    ).toBeFalsy();
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("render middleSize and middleSize gt centerSize", async () => {
    const element = document.createElement(
      "data-view.cabinet-container"
    ) as CabinetContainer;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.data = new Array(30).fill(data[0]);
      element.type = "k8s-blue";
      element.status = "faded";
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot.querySelector(".itemContent").getAttribute("style")
    ).toBe("width: 72px;");
    expect(
      element.shadowRoot.querySelector(".item").getAttribute("style")
    ).toBe("width: 62.5px;");
    expect(element.shadowRoot).toBeTruthy();
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("render middleSize and middleSize lt centerSize", async () => {
    const element = document.createElement(
      "data-view.cabinet-container"
    ) as CabinetContainer;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.data = new Array(20).fill(data[0]);
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot.querySelector(".itemContent").getAttribute("style")
    ).toBe("width: 108px;");
    expect(
      element.shadowRoot.querySelector(".item").getAttribute("style")
    ).toBe("width: 98.75px;");
    expect(element.shadowRoot).toBeTruthy();
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("render middleSize and middleSize eq 1", async () => {
    const element = document.createElement(
      "data-view.cabinet-container"
    ) as CabinetContainer;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.data = data;
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot.querySelector(".itemContent").getAttribute("style")
    ).toBe("width: 73px;");
    expect(
      element.shadowRoot.querySelector(".item").getAttribute("style")
    ).toBe("width: 63px;");
    expect(element.shadowRoot).toBeTruthy();
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("render clientWidth", async () => {
    const element = document.createElement(
      "data-view.cabinet-container"
    ) as CabinetContainer;
    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      element.data = data;
      document.body.appendChild(element);
    });
    expect(
      element.shadowRoot.querySelector(".itemContent").getAttribute("style")
    ).toBeNull();
    expect(
      element.shadowRoot.querySelector(".item").getAttribute("style")
    ).toBeNull();
    expect(element.shadowRoot).toBeTruthy();
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
