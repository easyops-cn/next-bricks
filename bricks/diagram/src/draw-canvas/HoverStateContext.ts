// istanbul ignore file: nothing logical to test
import React from "react";
import type {
  DecoratorCell,
  EdgeView,
  EditableLineInfo,
  LineEditorState,
  NodeCell,
  SmartConnectLineState,
} from "./interfaces";
import type { NodePosition } from "../diagram/interfaces";

export interface HoverState {
  // Currently only support node cell
  cell: NodeCell | DecoratorCell;
  relativePoints: ReadonlyArray<NodePosition>;
  points: ReadonlyArray<NodePosition>;
  activePointIndex?: number;
}

export const HoverStateContext = React.createContext<{
  rootRef: React.RefObject<SVGSVGElement>;
  smartConnectLineState: SmartConnectLineState | null;
  unsetHoverStateTimeoutRef: React.MutableRefObject<number | null>;
  hoverState: HoverState | null;
  activeEditableLine: EditableLineInfo | null;
  lineEditorState: LineEditorState | null;
  setLineEditorState: React.Dispatch<
    React.SetStateAction<LineEditorState | null>
  >;
  setActiveEditableLine: React.Dispatch<
    React.SetStateAction<EditableLineInfo | null>
  >;
  setHoverState: React.Dispatch<React.SetStateAction<HoverState | null>>;
  setSmartConnectLineState: React.Dispatch<
    React.SetStateAction<SmartConnectLineState | null>
  >;
  onConnect?: (
    source: NodeCell | DecoratorCell,
    target: NodeCell | DecoratorCell,
    exitPosition: NodePosition,
    entryPosition: NodePosition | undefined
  ) => void;
  onChangeEdgeView?: (
    source: NodeCell | DecoratorCell,
    target: NodeCell | DecoratorCell,
    view: EdgeView
  ) => void;
}>({
  rootRef: { current: null },
  smartConnectLineState: null,
  unsetHoverStateTimeoutRef: { current: null },
  hoverState: null,
  activeEditableLine: null,
  lineEditorState: null,
  setLineEditorState: () => {},
  setActiveEditableLine: () => {},
  setHoverState: () => {},
  setSmartConnectLineState: () => {},
});

export function useHoverStateContext() {
  return React.useContext(HoverStateContext);
}
