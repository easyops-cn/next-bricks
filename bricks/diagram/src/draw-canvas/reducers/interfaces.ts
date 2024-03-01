import type {
  Cell,
  DecoratorCell,
  EdgeCell,
  NodeCell,
  NodeId,
} from "../interfaces";

export interface DrawCanvasState {
  cells: Cell[];
}

export type DrawCanvasAction =
  | DropNodeAction
  | DropDecoratorAction
  | AddNodeAction
  | AddEdgeAction
  | MoveCellAction
  | ResizeCellAction;

export interface DropNodeAction {
  type: "drop-node";
  payload: NodeCell;
}

export interface DropDecoratorAction {
  type: "drop-decorator";
  payload: DecoratorCell;
}

export interface AddNodeAction {
  type: "add-nodes";
  payload: NodeCell[];
}

export interface AddEdgeAction {
  type: "add-edge";
  payload: EdgeCell;
}

export interface MoveCellAction {
  type: "move-cell";
  payload: MoveCellPayload;
}

export interface ResizeCellAction {
  type: "resize-cell";
  payload: ResizeCellPayload;
}

export interface MoveCellPayload {
  type: "node" | "decorator";
  id: NodeId;
  x: number;
  y: number;
}

export interface ResizeCellPayload {
  type: "node" | "decorator";
  id: NodeId;
  width: number;
  height: number;
}

export interface MoveNodePayload {
  id: NodeId;
  x: number;
  y: number;
}
