import type { SizeTuple } from "../../diagram/interfaces";
import type {
  Cell,
  DecoratorCell,
  DecoratorType,
  EdgeCell,
  NodeCell,
  NodeId,
} from "../interfaces";

export interface DrawCanvasState {
  cells: Cell[];
  layoutKey: number;
}

export type DrawCanvasAction =
  | DropNodeAction
  | DropDecoratorAction
  | AddNodeAction
  | AddEdgeAction
  | MoveCellsAction
  | ResizeCellAction
  | UpdateCellsAction
  | UpdateNodeSizeAction;

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

export interface MoveCellsAction {
  type: "move-cells";
  payload: MoveCellPayload[];
}

export interface ResizeCellAction {
  type: "resize-cell";
  payload: ResizeCellPayload;
}

export interface UpdateCellsAction {
  type: "update-cells";
  payload: Cell[];
}

export interface UpdateNodeSizeAction {
  type: "update-node-size";
  payload: {
    id: string;
    size: SizeTuple | null;
  };
  layoutKey: number;
}

export interface MoveCellPayload {
  type: "node" | "decorator";
  id: NodeId;
  x: number;
  y: number;
  width?: number;
  height?: number;
  decorator?: DecoratorType;
  containerCell?: DecoratorCell;
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
