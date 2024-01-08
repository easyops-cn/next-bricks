import type { CSSProperties } from "react";
import type { UseSingleBrickConf } from "@next-core/react-runtime";

export interface DiagramNode {
  id: DiagramNodeId;
  type?: string;
  [key: string]: unknown;
}

export interface DiagramEdge {
  source: string;
  target: string;
  type?: string;
  [key: string]: unknown;
}

export interface RenderedGraph {
  nodes: RenderedNode[];
  edges: RenderedEdge[];
}

export interface RenderedNode {
  id: DiagramNodeId;
  x: number;
  y: number;
  width: number;
  height: number;
  data: DiagramNode;
}

export interface RenderedEdge {
  points: NodePosition[];
  data: DiagramEdge;
}

export interface RenderedLine {
  line: LineConf & {
    strokeColor: string;
    strokeWidth: number;
    interactStrokeWidth: number;
    curveType: string;
    $id: string;
  };
  d: string;
  markerIndex: number | undefined;
  edge: DiagramEdge;
}

export interface RenderedLineLabel {
  text?: TextOptions;
  label?: LineLabelConf;
  edge: DiagramEdge;
  position: PositionTuple;
  lineRect: {
    left: number;
    top: number;
    right: number;
    bottom: number;
  };
  id: string;
}

export type PositionTuple = [x: number, y: number];

export interface LineMarker {
  strokeColor: string;
}

export type DiagramNodeId = string /* | number */;

export type RefRepository = Map<DiagramNodeId, HTMLElement>;

export interface NodeBrickConf {
  useBrick: UseSingleBrickConf;
  nodeType?: string | string[];
  if?: string | boolean | null;
}

export interface NodePosition {
  x: number;
  y: number;
}

export type CurveType = `curve${string}`;

export interface LineConf {
  edgeType?: string | string[];
  if?: string | boolean | null;
  draw?: boolean;
  type?: "auto";
  strokeColor?: string;
  strokeWidth?: number;
  interactable?: boolean;
  interactStrokeWidth?: number;
  curveType?: "curveBasis";
  arrow?: boolean;
  text?: TextOptions;
  label?: LineLabelConf;
  cursor?: React.CSSProperties["cursor"];
}

export interface LineLabelConf {
  if?: string | boolean | null;
  useBrick: UseSingleBrickConf;
}

export interface TextOptions {
  content: string;
  style?: CSSProperties;
}

export interface TransformLiteral {
  k: number;
  x: number;
  y: number;
}

export interface LayoutOptionsDagre {
  nodePadding?: PartialRectTuple;
  rankdir?: "TB" | "BT" | "LR" | "RL";
  ranksep?: number;
  edgesep?: number;
  nodesep?: number;
  align?: "UL" | "UR" | "DL" | "DR";
}

export type PartialRectTuple =
  | number
  | [all: number]
  | [vertical: number, horizontal: number]
  | [top: number, horizontal: number, bottom: number]
  | [top: number, right: number, bottom: number, left: number];

export type FullRectTuple = [
  top: number,
  right: number,
  bottom: number,
  left: number,
];

export interface LineTextClipPath extends SimpleRect {
  id: string;
}

export interface SimpleRect {
  x0: number;
  y0: number;
  w: number;
  h: number;
}

export interface LineTarget {
  id: string;
  edge: DiagramEdge;
}

export interface ConnectLineDetail {
  source: DiagramNode;
  target: DiagramNode;
}

export interface NodesConnectOptions {
  sourceType?: string | string[];
  if?: string | boolean | null;
  strokeColor?: string;
  strokeWidth?: number;
  arrow?: boolean;
}

export interface ConnectLineState {
  from: PositionTuple;
  options: NodesConnectOptions;
}

export type ActiveTarget = ActiveTargetOfNode | ActiveTargetOfEdge;

export interface ActiveTargetOfNode {
  type: "node";
  nodeId: string;
}

export interface ActiveTargetOfEdge {
  type: "edge";
  edge: DiagramEdge;
}
