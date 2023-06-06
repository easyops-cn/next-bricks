import React from "react";
import { render, fireEvent, createEvent } from "@testing-library/react";
import { SiteMapProps, SiteMap } from "./SiteMap.js";
import { launchpadService } from "../LaunchpadService.js";

jest.mock("../LaunchpadService", () => {
  return {
    launchpadService: {
      pushVisitor: jest.fn(),
    },
  };
});

describe("SiteMap", () => {
  it("should work", () => {
    const props: SiteMapProps = {
      categoryList: [
        {
          name: "资源管理",
          id: "resource",
          order: "",
          apps: [
            { name: "cmdb模型管理", homepage: "/cmdb-mode", id: "cmdb-mode" },
          ],
        },
      ],
    };

    const { container } = render(<SiteMap {...props} />);
    expect(container.querySelectorAll(".groupWrapper").length).toEqual(1);
    expect(container.querySelector(".groupWrapper")?.innerHTML).toEqual(
      expect.stringContaining("资源管理")
    );

    const stopPropagationFn = jest.fn();
    const mockEvent = createEvent.wheel(
      container.querySelector(".scrollContainer") as HTMLElement
    );
    mockEvent.stopPropagation = stopPropagationFn;

    fireEvent(
      container.querySelector(".scrollContainer") as HTMLElement,
      mockEvent
    );
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it("should work with onload callback", () => {
    const categoryList = [
      {
        name: "资源管理",
        id: "resource",
        order: "",
        apps: [
          { name: "cmdb模型管理", homepage: "/cmdb-mode", id: "cmdb-mode" },
        ],
      },
    ];
    const onLoadFn = jest.fn();
    const { container } = render(
      <SiteMap categoryList={categoryList} onLoad={onLoadFn} />
    );

    expect(onLoadFn).toHaveBeenCalled();

    fireEvent.click(
      container.querySelector("basic\\.general-link") as HTMLElement
    );

    expect(launchpadService.pushVisitor).toHaveBeenCalledWith("app", {
      id: "cmdb-mode",
      name: "cmdb模型管理",
      homepage: "/cmdb-mode",
    });
  });
});
