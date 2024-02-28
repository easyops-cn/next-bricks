import type { Cell, EdgeCell, NodeCell } from "../interfaces";

export interface DrawCanvasState {
  cells: Cell[];
}

export type DrawCanvasAction = DropNodeAction | AddNodeAction | AddEdgeAction;

export interface DropNodeAction {
  type: "drop-node";
  payload: NodeCell;
}

export interface AddNodeAction {
  type: "add-nodes";
  payload: NodeCell[];
}

export interface AddEdgeAction {
  type: "add-edge";
  payload: EdgeCell;
}
