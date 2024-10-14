import type { UseSingleBrickConf } from "@next-core/react-runtime";
import type { SimulationLinkDatum, SimulationNodeDatum } from "d3-force";
import type { ResizeCellPayload } from "./reducers/interfaces";
import type {
  CurveType,
  LineMarkerType,
  NodePosition,
  PartialRectTuple,
  PositionTuple,
  TransformLiteral,
} from "../diagram/interfaces";
import type {
  SYMBOL_FOR_SIZE_INITIALIZED,
  SYMBOL_FOR_LAYOUT_INITIALIZED,
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
  view?: EdgeView;
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

export interface EdgeView extends LineSettings {
  exitPosition?: NodePosition | null;
  entryPosition?: NodePosition | null;
  vertices?: NodePosition[] | null;
}

export interface EdgeLineConf extends BaseEdgeLineConf {
  if?: string | boolean | null;
}

export type LineType = "straight" | "curve" | "polyline";

export interface LineSettings {
  type?: LineType;
  curveType?: CurveType;
}

export interface LineAnimate {
  useAnimate: boolean;
  duration: number;
}

export interface ComputedEdgeLineConf extends Required<BaseEdgeLineConf> {
  $markerUrl: string;
}

export interface BaseEdgeLineConf {
  type?: LineType;
  curveType?: CurveType;
  dashed?: boolean;
  dotted?: boolean;
  strokeWidth?: number;
  strokeColor?: string;
  interactStrokeWidth?: number;
  parallelGap?: number;
  markerType?: LineMarkerType;
  showStartArrow?: boolean;
  showEndArrow?: boolean;
  animate?: LineAnimate;
}

export interface LineMarker {
  strokeColor: string;
  markerType: LineMarkerType;
}

export type LineConnecterConf = Pick<
  BaseEdgeLineConf,
  "strokeWidth" | "strokeColor" | "showStartArrow" | "showEndArrow"
> & {
  editingStrokeColor?: string;
};

export type ComputedLineConnecterConf = ComputedEdgeLineConf & {
  editingStrokeColor: string;
  $editingMarkerUrl: string;
};

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
  layout?: LayoutType;
  view: DecoratorView;
  layoutOptions?: LayoutOptions;
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

export interface SmartConnectLineState {
  source: NodeCell;
  from: PositionTuple;
  offset: PositionTuple;
  exitPosition: NodePosition;
}

export interface Deferred<T> {
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
}

export interface ConnectNodesDetail {
  source: NodeCell | DecoratorCell;
  target: NodeCell | DecoratorCell;
  view?: EdgeView;
}

export interface DecoratorTextChangeDetail {
  id: string;
  view: DecoratorView;
}

export type LayoutType = "manual" | "force" | "dagre" | undefined;

export type LayoutOptions =
  | LayoutOptionsManual
  | LayoutOptionsDagre
  | LayoutOptionsForce;

export interface LayoutOptionsManual extends LayoutSnapOptions {}

export interface LayoutSnapOptions {
  /** Snap options. Setting to true means enable all snap options */
  snap?: boolean | SnapOptions;
}

export interface SnapOptions {
  /** Snap to grid */
  grid?: boolean | SnapToGridOptions;
  /** Snap to object */
  object?: boolean | SnapToObjectOptions;
}

export interface SnapToGridOptions {
  /** @default 10 */
  size?: number;
}

export interface SnapToObjectOptions {
  /** @default 5 */
  distance?: number;
}

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

export interface BaseLayoutOptions extends LayoutSnapOptions {
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

export interface NodeConnectPoint extends NodePosition {
  d: Direction[];
}

export interface EditableLineInfo {
  edge: EdgeCell;
  parallelGap: number;
  source: NodeCell | DecoratorCell;
  target: NodeCell | DecoratorCell;
  linePoints: NodePosition[];
}

export type LineEditorState =
  | LineEditorStateOfEndPoint
  | LineEditorStateOfControl;

export interface LineEditorStateOfEndPoint extends EditableLineInfo {
  type: "exit" | "entry";
  offset: PositionTuple;
  from: PositionTuple;
}

export interface LineEditorStateOfControl extends EditableLineInfo {
  type: "control";
  offset: PositionTuple;
  from: PositionTuple;
  control: ControlPoint;
}

export type BiDirection = "ns" | "ew";

/**
 * A control point for editing line is the middle point of a line segment.
 *
 * Direction means the control point changes on the what direction,
 * ns means north-south, ew means east-west.
 *
 * ```
 *      C1  ┌─────┐
 *    ┌──⊙──┤  T  │
 * C0 ⊙     └─────┘
 * ┌──┴──┐
 * │  S  │
 * └─────┘
 * ```
 */
export interface ControlPoint extends NodePosition {
  direction: BiDirection;
  index: number;
}
