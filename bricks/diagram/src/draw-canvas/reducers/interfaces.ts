import type { Cell, NodeCell } from "../interfaces";

export interface DrawCanvasState {
  cells: Cell[];
}

export type DrawCanvasAction = DropNodeAction | AddNodeAction | AddEdgesAction;

export interface DropNodeAction {
  type: "drop-node";
  payload: NodeCell;
}

export interface AddNodeAction {
  type: "add-nodes";
  payload: NodeCell[];
}

export interface AddEdgesAction {
  type: "add-edges";
  payload: unknown;
}
