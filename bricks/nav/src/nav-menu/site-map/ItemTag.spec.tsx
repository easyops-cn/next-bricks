import React from "react";
import { describe, expect } from "@jest/globals";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { DRAG_DIRECTION, DragContext } from "./constants.js";
import { collectService } from "./CollectService.js";
import {
  QuickVisitItem,
  RecommendItem,
  ItemTag,
  PlaceholderDropComp,
  StarIcon,
} from "./ItemTag.js";

describe("component test", () => {
  describe("QuickVisitItem", () => {
    it("should work", () => {
      const onFavoriteFn = jest.fn();
      const item = {
        text: "主机",
        to: "/host",
      };
      const { container } = render(
        <QuickVisitItem
          groupId="monitor"
          onFavorite={onFavoriteFn}
          data={item}
        />
      );

      fireEvent.click(container.querySelector("eo-icon") as Element);

      expect(onFavoriteFn).toBeCalled();
    });
  });

  describe("RecommendItem", () => {
    it("should work", () => {
      const item = {
        text: "主机",
        to: "/host",
      };

      const onFavoriteFn = jest.fn();
      const { container, rerender } = render(
        <RecommendItem groupId="monitor" data={item} />
      );

      expect(container.querySelector("eo-icon")).toBeTruthy();

      expect(
        container.querySelector("eo-tooltip")?.getAttribute("content")
      ).toEqual("ADD_ITEM_TO_QUICK_ACCESS");

      rerender(
        <RecommendItem
          groupId="monitor"
          data={item}
          active={true}
          onFavorite={onFavoriteFn}
        />
      );

      expect(
        container.querySelector("eo-tooltip")?.getAttribute("content")
      ).toEqual("REMOVE_ITEM_FROM_QUICK_ACCESS");

      fireEvent.click(container.querySelector("eo-icon") as Element);

      expect(onFavoriteFn).toBeCalled();
    });
  });

  describe("ItemTag", () => {
    it("should work", () => {
      const mockDragStart = jest.fn();

      const mockDragOver = jest.fn();

      const mockDragEnd = jest.fn();

      const div = document.createElement("div");
      div.dataset.text = "cmdb";
      div.dataset.to = "/cmdb";
      const props = {
        data: {
          text: "cmdb",
          to: "/cmdb",
        },
      };
      const { container } = render(
        <DragContext.Provider
          value={{
            groupId: "monitor",
            allowDrag: true,
            direction: DRAG_DIRECTION.Left,
            onDragStart: mockDragStart,
            onDragEnd: mockDragEnd,
            onDragOver: mockDragOver,
            overElement: div,
          }}
        >
          <ItemTag {...props} />
        </DragContext.Provider>
      );

      expect(
        container
          .querySelector(".indicate-wrapper")
          ?.getAttribute("data-direction")
      ).toEqual(DRAG_DIRECTION.Left);

      fireEvent.dragStart(screen.getByText("cmdb"));

      expect(mockDragStart).toBeCalled();

      expect(container.querySelector(".is-drag")).toBeTruthy();

      fireEvent.dragEnd(screen.getByText("cmdb"));

      expect(mockDragEnd).toBeCalled();
    });
  });

  describe("PlaceholderDropComp", () => {
    it("should work", () => {
      const mockDragOver = jest.fn();
      const { container } = render(
        <PlaceholderDropComp
          data={{ text: "/cmdb", to: "/cmdb" }}
          direction={DRAG_DIRECTION.Left}
          onDragOver={mockDragOver}
        />
      );

      fireEvent.dragEnter(
        container.querySelector(".indicate-wrapper") as HTMLElement
      );

      fireEvent.dragOver(
        container.querySelector(".indicate-wrapper") as HTMLElement
      );

      fireEvent.dragLeave(
        container.querySelector(".indicate-wrapper") as HTMLElement
      );

      expect(mockDragOver).toHaveBeenCalled();
    });
  });

  describe("StarIcon", () => {
    jest.spyOn(collectService, "checkMaxCapacity").mockReturnValueOnce(true);

    const mockFavorite = jest.fn();
    const { container } = render(
      <StarIcon
        active={false}
        groupId="monitor"
        onFavorite={mockFavorite}
        data={{ text: "cmdb", to: "/cmdb" }}
      />
    );

    screen.debug();
    expect(
      container.querySelector("eo-tooltip")?.getAttribute("content")
    ).toEqual("MAX_COLLECT_COUNT_TIPS");
  });
});
