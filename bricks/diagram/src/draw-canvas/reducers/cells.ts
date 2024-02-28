import type { Reducer } from "react";
import type { DrawCanvasAction } from "./interfaces";
import type { Cell } from "../interfaces";

export const cells: Reducer<Cell[], DrawCanvasAction> = (state, action) => {
  switch (action.type) {
    case "drop-node":
      return [...state, action.payload];
    case "add-nodes":
      return [...state, ...action.payload];
    case "add-edge": {
      // Add the edge to just next to the previous last edge.
      // If no previous edge, add to the start.
      const index = state.findLastIndex((cell) => cell.type === "edge") + 1;
      return [...state.slice(0, index), action.payload, ...state.slice(index)];
    }
  }
  return state;
};
