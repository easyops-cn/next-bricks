import type { Reducer } from "react";
import type { DrawCanvasAction } from "./interfaces";
import type { Cell } from "../interfaces";

export const cells: Reducer<Cell[], DrawCanvasAction> = (state, action) => {
  switch (action.type) {
    case "drop-node":
      return [...state, action.payload];
    case "add-nodes":
      return [...state, ...action.payload];
  }
  return state;
};
