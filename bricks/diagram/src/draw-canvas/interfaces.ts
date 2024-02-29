import type { UseSingleBrickConf } from "@next-core/react-runtime";

export type Cell = NodeCell | EdgeCell;

export type ShapeCell = NodeShapeCell /*  | EdgeShapeCell */;

export type BrickCell = NodeBrickCell /*  | EdgeBrickCell */;

export type NodeCell = NodeBrickCell | NodeShapeCell;

export type EdgeCell = BaseEdgeCell;

export type NodeShapeCell = BaseShapeCell & BaseNodeCell;

export type NodeBrickCell = BaseBrickCell & BaseNodeCell;

// export type EdgeShapeCell = BaseShapeCell & BaseEdgeCell;

// export type EdgeBrickCell = BaseBrickCell & BaseEdgeCell;

export type NodeId = string /* | number */;

export interface BaseShapeCell extends BaseCell {
  tag: "shape";
  shape: string;
  style?: ShapeStyle;
}

export interface ShapeStyle {
  stroke: string;
  fill: string;
  strokeWidth: number;
}

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

export interface BaseCell {
  type: "node" | "edge";
  tag?: "shape" | "brick";
  data?: unknown;
}

export interface NodeView extends InitialNodeView {
  width: number;
  height: number;
}

export interface InitialNodeView {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export type InitialNodeCell = Omit<NodeCell, "view"> & {
  view: InitialNodeView;
};

export type InitialCell = InitialNodeCell | EdgeCell;

export interface NodeBrickConf {
  useBrick: UseSingleBrickConf;
  if?: string | boolean | null;
}

export type ActiveTarget = ActiveTargetOfNode | ActiveTargetOfEdge;

export interface ActiveTargetOfNode {
  type: "node";
  id: NodeId;
}

export interface ActiveTargetOfEdge {
  type: "edge";
  source: NodeId;
  target: NodeId;
}

export interface NodeBasicInfo {
  id: NodeId;
  data: unknown;
}

export interface BasicShapeProps {
  cell: ShapeCell;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
