import type { Cell, NodeCell } from "../interfaces";

export interface DrawCanvasState {
  cells: Cell[];
}

export type DrawCanvasAction = DropNodeAction | AddNodeAction;

export interface DropNodeAction {
  type: "drop-node";
  payload: NodeCell;
}

export interface AddNodeAction {
  type: "add-node";
  payload: NodeCell;
}
