import { fireEvent } from '@testing-library/react';
import { describe, test, expect } from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./cabinet-app-layer/index.jsx";
import "./cabinet-button/index.jsx";
import "./cabinet-container/index.jsx";
import "./cabinet-node/index.jsx";
import type { CabinetAppLayer } from "./cabinet-app-layer/index.jsx";
import type { CabinetContainer } from "./cabinet-container/index.jsx";
import "./index.jsx";
import { CabinetGraph } from "./index.jsx";

describe("data-view.cabinet-graph", () => {
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.cabinet-graph"
    ) as CabinetGraph;
    const onCloseBtnClick = jest.fn();

    element.dataSource = {
      "appName": "inventory-api",
      "key": "inventory-api",
      "clusters": [
        {
          "clusterName": "inventory-api##aaaaa",
          "key": "inventory-api##aaaaa",
          "type": "host",
          "nodes": [
            {
              "nodeTitle": "244.244.244.244",
              "key": "244.244.244.244",
              "type": "physical-machine"
            },
            {
              "nodeTitle": "244.244.244.245",
              "key": "244.244.244.245",
              "type": "virtual-machine"
            }
          ]
        },
        {
          "clusterName": "K8S集群",
          "key": "k8s-cluster",
          "type": "k8s",
          "nodes": [
            {
              "nodeTitle": "a容器组",
              "key": "aa",
              "type": "container-group"
            },
            {
              "nodeTitle": "b容器组",
              "key": "bb",
              "type": "container-group"
            },
            {
              "nodeTitle": "c容器组",
              "key": "cc",
              "type": "container-group"
            },
          ]
        },
      ]
    }
    element.addEventListener("close.button.click", onCloseBtnClick);

    expect(element.shadowRoot).toBeFalsy();
    act(() => {
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();

    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelector(".app-layer"));
    });
    expect((element.shadowRoot.querySelector(".app-layer") as CabinetAppLayer).status).toBe("active")

    await act(async () => {
      element.activeKey = null;
    });
    expect((element.shadowRoot.querySelector(".app-layer") as CabinetAppLayer).status).toBe(null);

    await act(async () => {
      const cluster = element.shadowRoot.querySelector(".cluster-container").children[0].shadowRoot.querySelector(".wrapper");
      fireEvent.click(cluster);
    });
    expect((element.shadowRoot.querySelector(".cluster-container").children[0] as CabinetContainer).status).toBe("active");
    expect((element.shadowRoot.querySelector(".cluster-container").children[1] as CabinetContainer).status).toBe("faded");

    await act(async () => {
      const node = element.shadowRoot.querySelector(".cluster-container").children[0].shadowRoot.querySelector(".item");
      fireEvent.click(node);
    });

    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelector(".close-button"));
    });
    expect(onCloseBtnClick).lastCalledWith(expect.objectContaining({
      type: "close.button.click",
      detail: null,
    }));

    await act(async () => {
      fireEvent.click(element.shadowRoot.querySelector(".wrapper"));
    });
    expect((element.shadowRoot.querySelector(".app-layer") as CabinetAppLayer).status).toBe(null);

    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
});
