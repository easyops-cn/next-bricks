import type { Cell, NodeCell } from "../interfaces";

export interface DrawCanvasState {
  cells: Cell[];
}

export type DrawCanvasAction = DropNodeAction;

export interface DropNodeAction {
  type: "drop-node";
  payload: NodeCell;
}
