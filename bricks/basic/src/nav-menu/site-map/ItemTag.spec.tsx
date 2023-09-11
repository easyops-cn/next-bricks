import React from "react";
import { describe, expect } from "@jest/globals";
import { act, render, screen, fireEvent } from "@testing-library/react";
import { QuickVisitItem, RecommendItem } from "./ItemTag.js";

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
        />,
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
        <RecommendItem groupId="monitor" data={item} />,
      );

      expect(container.querySelector("eo-icon")).toBeTruthy();

      expect(
        container.querySelector("eo-tooltip")?.getAttribute("content"),
      ).toEqual("ADD_ITEM_TO_QUICK_ACCESS");

      rerender(
        <RecommendItem
          groupId="monitor"
          data={item}
          active={true}
          onFavorite={onFavoriteFn}
        />,
      );

      expect(
        container.querySelector("eo-tooltip")?.getAttribute("content"),
      ).toEqual("REMOVE_ITEM_FROM_QUICK_ACCESS");

      fireEvent.click(container.querySelector("eo-icon") as Element);

      expect(onFavoriteFn).toBeCalled();
    });
  });
});
