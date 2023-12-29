import { UseSingleBrickConf } from "@next-core/react-runtime";

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

export interface RenderedLine extends RenderedEdge {
  line: LineConf & {
    strokeColor: string;
    strokeWidth: number;
    curveType: "curveBasis";
  };
  markerIndex: number | undefined;
}

export interface LineMarker {
  strokeColor: string;
}

export type DiagramNodeId = string /* | number */;

export type RefRepository = Map<DiagramNodeId, HTMLElement>;

export interface NodeBrickConf {
  useBrick: UseSingleBrickConf;
  nodeType?: string | string[];
  if?: string | boolean;
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
  curveType?: "curveBasis";
  arrow?: boolean;
}

export interface TransformLiteral {
  k: number;
  x: number;
  y: number;
}

export interface LayoutOptionsDagre {
  nodePadding?: number;
}
