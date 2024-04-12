import React from "react";
import type {
  NodeCell,
  NodeConnectPoint,
  SmartConnectLineState,
} from "./interfaces";
import type { NodePosition } from "../diagram/interfaces";

export interface HoverState {
  // Currently only support node cell
  cell: NodeCell;
  relativePoints: ReadonlyArray<NodeConnectPoint>;
  points: ReadonlyArray<NodePosition>;
  activePointIndex?: number;
}

export const HoverStateContext = React.createContext<{
  rootRef: React.RefObject<SVGSVGElement>;
  smartConnectLineState: SmartConnectLineState | null;
  unsetHoverStateTimeoutRef: React.MutableRefObject<number | null>;
  hoverState: HoverState | null;
  setHoverState: React.Dispatch<React.SetStateAction<HoverState | null>>;
  setSmartConnectLineState: React.Dispatch<
    React.SetStateAction<SmartConnectLineState | null>
  >;
  onConnect?: (
    source: NodeCell,
    target: NodeCell,
    exitPosition: NodePosition,
    entryPosition: NodePosition
  ) => void;
}>({
  rootRef: { current: null },
  smartConnectLineState: null,
  unsetHoverStateTimeoutRef: { current: null },
  hoverState: null,
  setHoverState: () => {},
  setSmartConnectLineState: () => {},
});

export function useHoverStateContext() {
  return React.useContext(HoverStateContext);
}
