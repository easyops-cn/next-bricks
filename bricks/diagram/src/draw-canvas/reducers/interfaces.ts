import type { Cell, EdgeCell, NodeCell, NodeId } from "../interfaces";

export interface DrawCanvasState {
  cells: Cell[];
}

export type DrawCanvasAction =
  | DropNodeAction
  | AddNodeAction
  | AddEdgeAction
  | MoveNodeAction;

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

export interface MoveNodeAction {
  type: "move-node";
  payload: {
    id: NodeId;
    x: number;
    y: number;
  };
}

export interface MoveNodePayload {
  id: NodeId;
  x: number;
  y: number;
}
