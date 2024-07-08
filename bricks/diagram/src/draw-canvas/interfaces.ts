import type { UseSingleBrickConf } from "@next-core/react-runtime";
import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import type { ResizeCellPayload } from "./reducers/interfaces";
import type {
  PartialRectTuple,
  PositionTuple,
  TransformLiteral,
} from "../diagram/interfaces";
import {
  SYMBOL_FOR_SIZE_INITIALIZED,
  type SYMBOL_FOR_LAYOUT_INITIALIZED,
} from "./constants";

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
  containerId?: NodeId;
  view: NodeView;
  [SYMBOL_FOR_SIZE_INITIALIZED]?: boolean;
  [SYMBOL_FOR_LAYOUT_INITIALIZED]?: boolean;
}

export interface BaseEdgeCell extends BaseCell {
  type: "edge";
  source: NodeId;
  target: NodeId;
  // view: EdgeView;
}

export type DecoratorType = "text" | "area" | "container";
export type Direction = "top" | "right" | "bottom" | "left";

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
  direction?: Direction;
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

export interface EdgeLineConf
  extends Omit<Partial<ComputedEdgeLineConf>, "markerArrow"> {
  if?: string | boolean | null;
}
export interface LineAnimate {
  useAnimate: boolean;
  duration: number;
}

export interface ComputedEdgeLineConf {
  dashed: boolean;
  strokeWidth: number;
  strokeColor: string;
  interactStrokeWidth: number;
  parallelGap: number;
  markerEnd: string;
  markerArrow: string;
  showStartArrow: boolean;
  showEndArrow: boolean;
  animate: LineAnimate;
}

export interface LineMarker {
  strokeColor: string;
}

export type ActiveTarget = ActiveTargetOfSingular | ActiveTargetOfMulti;

export type ActiveTargetOfSingular =
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

export interface ActiveTargetOfMulti {
  type: "multi";
  targets: ActiveTargetOfSingular[];
}

export interface BasicDecoratorProps {
  cell: DecoratorCell;
  transform: TransformLiteral;
  readOnly?: boolean;
  activeTarget: ActiveTarget | null | undefined;
  cells: Cell[];
  onCellResizing?(info: ResizeCellPayload): void;
  onCellResized?(info: ResizeCellPayload): void;
  onSwitchActiveTarget?(activeTarget: ActiveTarget | null): void;
  onDecoratorTextEditing?(detail: { id: string; editing: boolean }): void;
  onDecoratorTextChange?(detail: DecoratorTextChangeDetail): void;
}

export interface CellContextMenuDetail {
  cell: Cell;
  clientX: number;
  clientY: number;
}

export interface ConnectLineState {
  source: NodeCell | DecoratorCell;
  from: PositionTuple;
  offset: PositionTuple;
}

export interface Deferred<T> {
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

export interface ConnectNodesDetail {
  source: NodeCell | DecoratorCell;
  target: NodeCell | DecoratorCell;
}

export interface DecoratorTextChangeDetail {
  id: string;
  view: DecoratorView;
}

export type LayoutType = "manual" | "force" | "dagre" | undefined;

export type LayoutOptions = LayoutOptionsDagre | LayoutOptionsForce;

export interface LayoutOptionsDagre extends BaseLayoutOptions {
  rankdir?: "TB" | "BT" | "LR" | "RL";
  ranksep?: number;
  edgesep?: number;
  nodesep?: number;
  align?: "UL" | "UR" | "DL" | "DR";
}

export interface LayoutOptionsForce extends BaseLayoutOptions {
  collide?: boolean | ForceCollideOptions;
}

export interface ForceCollideOptions {
  radiusDiff?: number;
  strength?: number;
  iterations?: number;
}

export interface BaseLayoutOptions {
  nodePadding?: PartialRectTuple;

  /**
   * 根据节点什么位置进行对齐，支持关键字、百分比和比例值。
   * 第一个值为 x 轴，第二个值为 y 轴。
   * 使用数字时，表示相对于节点的宽高的比例。
   *
   * 注意，节点宽高将包含 nodePadding 的值。
   *
   * @default ["center","center"]
   *
   * @example
   * [0, 0] // left-top
   * [0.5, 0.5] // center
   * [1, 1] // right-bottom
   * ["center", "center"] // center
   * ["50%", "50%"] // center
   * ["left", "top"]
   * ["right", "bottom"]
   */
  alignOrigin?: AlignOrigin;
}

export type AlignOrigin = [x: string | number, y: string | number];
export type NormalizedAlignOrigin = [x: number, y: number];

export interface ForceNode extends SimulationNodeDatum {
  id: NodeId;
  width: number;
  height: number;
}

export type ForceLink = SimulationLinkDatum<ForceNode>;
