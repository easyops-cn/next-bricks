import type { UseSingleBrickConf } from "@next-core/react-runtime";

export type Cell = ShapeCell | BrickCell;

export type ShapeCell = NodeShapeCell /*  | EdgeShapeCell */;

export type BrickCell = NodeBrickCell /*  | EdgeBrickCell */;

export type NodeCell = NodeBrickCell | NodeShapeCell;

export type NodeShapeCell = BaseShapeCell & BaseNodeCell;

export type NodeBrickCell = BaseBrickCell & BaseNodeCell;

export type EdgeShapeCell = BaseShapeCell & BaseEdgeCell;

export type EdgeBrickCell = BaseBrickCell & BaseEdgeCell;

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
  useBrick: UseSingleBrickConf;
}

export interface BaseNodeCell extends BaseCell {
  id: string | number;
  view: NodeView;
}

export interface BaseEdgeCell extends BaseCell {
  source: string;
  target: string;
  // view: EdgeView;
}

export interface BaseCell {
  tag?: "shape" | "brick";
  data: unknown;
  view: unknown;
}

export interface NodeView {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BasicShapeProps {
  cell: ShapeCell;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
