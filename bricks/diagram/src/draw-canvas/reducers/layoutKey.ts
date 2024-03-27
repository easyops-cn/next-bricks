import type { Reducer } from "react";
import type { DrawCanvasAction } from "./interfaces";

export const layoutKey: Reducer<number, DrawCanvasAction> = (state, action) => {
  switch (action.type) {
    case "update-node-size":
      return action.layoutKey;
    default:
      return state;
  }
};
