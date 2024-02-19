import React from "react";
import type { Cell } from "./interfaces";
import type { NodePosition } from "../diagram/interfaces";

export interface HoverState {
  cell: Cell;
  points: ReadonlyArray<NodePosition>;
  activePointIndex?: number;
}

export const HoverStateContext = React.createContext<{
  setHoverState: React.Dispatch<React.SetStateAction<HoverState | null>>;
}>({ setHoverState: () => {} });

export function useHoverStateContext() {
  return React.useContext(HoverStateContext);
}
