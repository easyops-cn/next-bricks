import { fireEvent } from "@testing-library/react";
import { describe, test, expect } from "@jest/globals";
import { act } from "react";
import "./cabinet-app-layer/index.jsx";
import "./cabinet-button/index.jsx";
import "./cabinet-container/index.jsx";
import "./cabinet-node/index.jsx";
import type { CabinetAppLayer } from "./cabinet-app-layer/index.jsx";
import type { CabinetContainer } from "./cabinet-container/index.jsx";
import "./index.jsx";
import { CabinetGraph, AppData } from "./index.jsx";
jest.useFakeTimers();
const dataSource: AppData = {
  appName: "inventory-api",
  key: "inventory-api",
  clusters: [
    {
      clusterName: "inventory-api##aaaaa",
      key: "inventory-api##aaaaa",
      type: "host",
      nodes: [
        {
          nodeTitle: "244.244.244.244",
          key: "244.244.244.244",
          type: "physical-machine",
        },
        {
          nodeTitle: "244.244.244.245",
          key: "244.244.244.245",
          type: "virtual-machine",
        },
      ],
    },
    {
      clusterName: "K8S集群",
      key: "k8s-cluster",
      type: "k8s",
      nodes: [
        {
          nodeTitle: "a容器组",
          key: "aa",
          type: "container-group",
        },
        {
          nodeTitle: "b容器组",
          key: "bb",
          type: "container-group",
        },
        {
          nodeTitle: "c容器组",
          key: "cc",
          type: "container-group",
        },
      ],
    },
    {
      clusterName: "test",
      key: "test-cluster",
      type: "host",
      nodes: [
        {
          nodeTitle: "host1",
          key: "host1",
          type: "physical-machine",
        },
        {
          nodeTitle: "host2",
          key: "host2",
          type: "physical-machine",
        },
        {
          nodeTitle: "host3",
          key: "host3",
          type: "physical-machine",
        },
      ],
    },
  ],
};
describe("data-view.cabinet-graph", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.cabinet-graph"
    ) as CabinetGraph;
    const onCloseBtnClick = jest.fn();

    element.dataSource = dataSource;
    element.addEventListener("close.button.click", onCloseBtnClick);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelector(".app-layer"));
    });
    expect(
      (element.shadowRoot.querySelector(".app-layer") as CabinetAppLayer).status
    ).toBe("active");

    await act(async () => {
      element.activeKey = null;
    });
    expect(
      (element.shadowRoot.querySelector(".app-layer") as CabinetAppLayer).status
    ).toBe(null);
    const clusterContainerEle =
      element.shadowRoot.querySelector(".cluster-container");
    await act(async () => {
      const cluster =
        clusterContainerEle.children[0].shadowRoot.querySelector(".wrapper");
      fireEvent.click(cluster);
      jest.advanceTimersByTime(400);
      fireEvent.doubleClick(cluster);
    });
    expect((clusterContainerEle.children[0] as CabinetContainer).status).toBe(
      "active"
    );
    expect((clusterContainerEle.children[1] as CabinetContainer).status).toBe(
      "faded"
    );
    await act(async () => {
      const node =
        clusterContainerEle.children[0].shadowRoot.querySelector(".item");
      fireEvent.click(node);
      jest.advanceTimersByTime(400);
      fireEvent.doubleClick(node);
    });

    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelector(".close-button"));
    });
    expect(onCloseBtnClick).lastCalledWith(
      expect.objectContaining({
        type: "close.button.click",
        detail: null,
      })
    );

    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelector(".wrapper"));
    });
    expect(
      (element.shadowRoot.querySelector(".app-layer") as CabinetAppLayer).status
    ).toBe(null);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("activeKey is array", async () => {
    const element = document.createElement(
      "data-view.cabinet-graph"
    ) as CabinetGraph;
    element.dataSource = dataSource;
    element.activeKey = ["inventory-api##aaaaa", "k8s-cluster", "test-11111"];
    expect(element.shadowRoot).toBeFalsy();
    element.hiddenCloseBtn = true;
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(element.shadowRoot.querySelector(".close-button")).toBeFalsy();
    const clusterContainerEle =
      element.shadowRoot.querySelector(".cluster-container");
    expect(element.shadowRoot.querySelectorAll(".cluster-content").length).toBe(
      3
    );
    expect((clusterContainerEle.children[0] as CabinetContainer).status).toBe(
      "active"
    );
    expect((clusterContainerEle.children[1] as CabinetContainer).status).toBe(
      "active"
    );
    expect((clusterContainerEle.children[2] as CabinetContainer).status).toBe(
      "faded"
    );
    await act(async () => {
      const node =
        clusterContainerEle.children[2].shadowRoot.querySelector(".item");
      fireEvent.click(node);
      jest.advanceTimersByTime(400);
    });
    expect((clusterContainerEle.children[1] as CabinetContainer).status).toBe(
      "faded"
    );
    expect((clusterContainerEle.children[0] as CabinetContainer).status).toBe(
      "faded"
    );

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
