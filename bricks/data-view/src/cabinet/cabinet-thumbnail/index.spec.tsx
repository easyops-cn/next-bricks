import {
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { act } from "react-dom/test-utils";
import "./index.jsx";
import { CabinetThumbnail, CabinetThumbnailComponent } from "./index.jsx";
import { render } from "@testing-library/react";
import React from "react";
describe("data-view.cabinet-thumbnail", () => {
  beforeEach(() => {
    Element.prototype.getBoundingClientRect = jest.fn(() => ({
      width: 300,
      height: 400,
    })) as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  test("basic usage", async () => {
    const element = document.createElement(
      "data-view.cabinet-thumbnail"
    ) as CabinetThumbnail;
    expect(element.shadowRoot).toBeFalsy();
    await act(() => {
      element.clusters = [
        {
          title: "k8s容器",
          type: "k8s",
          data: [
            {
              nodeTitle: "1.1.0",
              type: "container-group",
            },
          ],
        },
        {
          title: "集群容器",
          type: "host",
          data: [
            {
              nodeTitle: "1.1.0",
              type: "virtual-machine",
            },
          ],
        },
        {
          title: "集群容器",
          type: "k8s-blue",
          data: [
            {
              nodeTitle: "1.1.0",
              type: "virtual-machine",
            },
          ],
        },
      ];
      element.appName = "xxx应用";
      document.body.appendChild(element);
    });
    expect(element.shadowRoot).toBeTruthy();
    expect(
      element.shadowRoot
        .querySelector(".clusterContainer")
        .classList.contains("clusterHostContainer")
    );
    expect(
      element.shadowRoot.querySelector(".appLayer").getAttribute("appTitle")
    ).toBe("xxx应用");
    act(() => {
      document.body.removeChild(element);
    });
    expect(document.body.contains(element)).toBeFalsy();
  });
  test("should work and columns", () => {
    const { container } = render(
      <CabinetThumbnailComponent
        clusters={[
          {
            title: "主机容器",
            type: "host",
            data: [
              {
                nodeTitle: "255.255.0",
                type: "virtual-machine",
              },
            ],
          },
        ]}
        columns={5}
        appName="应用名称"
      />
    );
    expect(
      container.querySelector(".clusterContentLayout").getAttribute("style")
    ).toBe("grid-template-columns: repeat(5,1fr);");
    expect(container.querySelector(".clusterTitle").textContent).toBe(
      "主机容器"
    );
    expect(
      container.querySelector(".thumbnailLayout").getAttribute("style")
    ).toBe("transform: scale(1);");
  });
  test("should work and  columns is  0", () => {
    const { container } = render(
      <CabinetThumbnailComponent clusters={[]} columns={0} appName="应用名称" />
    );
    expect(
      container.contains(container.querySelector(".clusterTitle"))
    ).toBeFalsy();
    expect(
      container.querySelector(".thumbnailLayout").getAttribute("style")
    ).toBeNull();
  });
});
