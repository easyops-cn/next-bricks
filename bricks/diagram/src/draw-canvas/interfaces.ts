import type { UseSingleBrickConf } from "@next-core/react-runtime";
import type { ResizeCellPayload } from "./reducers/interfaces";
import type { PositionTuple, TransformLiteral } from "../diagram/interfaces";

export type Cell = NodeCell | EdgeCell | DecoratorCell;

export type BrickCell = NodeBrickCell /*  | EdgeBrickCell */;

export type NodeCell = NodeBrickCell /* | NodeShapeCell */;

export type EdgeCell = BaseEdgeCell;

export type NodeBrickCell = BaseBrickCell & BaseNodeCell;

// export type EdgeBrickCell = BaseBrickCell & BaseEdgeCell;

export type NodeId = string /* | number */;

export interface BaseBrickCell extends BaseCell {
  tag?: "brick";
  useBrick?: UseSingleBrickConf;
}

export interface BaseNodeCell extends BaseCell {
  type: "node";
  id: NodeId;
  view: NodeView;
}

export interface BaseEdgeCell extends BaseCell {
  type: "edge";
  source: NodeId;
  target: NodeId;
  // view: EdgeView;
}

export type DecoratorType = "text" | "area";

export interface DecoratorCell extends BaseCell {
  type: "decorator";
  decorator: DecoratorType;
  id: NodeId;
  view: DecoratorView;
}

export interface BaseCell {
  type: "node" | "edge" | "decorator";
  data?: unknown;
}

export interface NodeView extends InitialNodeView {
  width: number;
  height: number;
}

export interface DecoratorView extends NodeView {
  text?: string;
}

export interface InitialNodeView {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export type InitialNodeCell = Omit<NodeCell, "view"> & {
  view?: InitialNodeView;
};

export type InitialCell = InitialNodeCell | EdgeCell | DecoratorCell;

export interface NodeBrickConf {
  useBrick: UseSingleBrickConf;
  if?: string | boolean | null;
}

export interface EdgeLineConf {
  if?: string | boolean | null;
  dashed?: boolean;
}

export type ActiveTarget =
  | ActiveTargetOfNode
  | ActiveTargetOfEdge
  | ActiveTargetOfDecorator;

export interface ActiveTargetOfNode {
  type: "node";
  id: NodeId;
}

export interface ActiveTargetOfEdge {
  type: "edge";
  source: NodeId;
  target: NodeId;
}

export interface ActiveTargetOfDecorator {
  type: "decorator";
  id: NodeId;
}

export interface BasicDecoratorProps {
  cell: DecoratorCell;
  transform: TransformLiteral;
  onCellResizing(info: ResizeCellPayload): void;
  onCellResized(info: ResizeCellPayload): void;
  onSwitchActiveTarget(activeTarget: ActiveTarget | null): void;
}

export interface CellContextMenuDetail {
  cell: Cell;
  clientX: number;
  clientY: number;
}

export interface ConnectLineState {
  source: NodeCell;
  from: PositionTuple;
  offset: PositionTuple;
}

export interface Deferred<T> {
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

export interface ConnectNodesDetail {
  source: NodeCell;
  target: NodeCell;
}
