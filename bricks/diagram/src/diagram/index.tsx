import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { select } from "d3-selection";
import { ZoomTransform, zoom } from "d3-zoom";
import classNames from "classnames";
import { uniqueId } from "lodash";
import type {
  DiagramEdge,
  DiagramNode,
  LayoutOptions,
  LineConf,
  NodeBrickConf,
  PositionTuple,
  RefRepository,
  RenderedLineLabel,
  LineTextClipPath,
  TransformLiteral,
  LineTarget,
  ConnectLineDetail,
  ConnectNodesOptions,
  ConnectLineState,
  ActiveTarget,
  RangeTuple,
  LineLabel,
  LineLabelConf,
  TextOptions,
  DragNodesOptions,
  NodeMovement,
  ManualLayoutStatus,
} from "./interfaces";
import { NodeComponentGroup } from "./NodeComponent";
import { handleKeyboard } from "./processors/handleKeyboard";
import { transformToCenter } from "./processors/transformToCenter";
import { getRenderedLines } from "./processors/getRenderedLines";
import { normalizeLinesAndMarkers } from "./processors/normalizeLinesAndMarkers";
import { LineLabelComponentGroup } from "./LineLabelComponent";
import { LineComponent } from "./LineComponent";
import { MarkerComponent } from "./MarkerComponent";
import { ClipPathComponent } from "./ClipPathComponent";
import { ConnectLineComponent } from "./ConnectLineComponent";
import { getClipPathList } from "./processors/getClipPathList";
import { getRenderedLineLabels } from "./processors/getRenderedLineLabels";
import { handleNodesMouseDown } from "./processors/handleNodesMouseDown";
import { DEFAULT_SCALE_RANGE_MAX, DEFAULT_SCALE_RANGE_MIN } from "./constants";
import { useRenderedDiagram } from "./hooks/useRenderedDiagram";
import { adjustLineLabels } from "./processors/adjustLineLabels";
import styleText from "./styles.shadow.css";
import { useUserView } from "./hooks/useUserView";

const { defineElement, property, event, method } = createDecorators();

export interface EoDiagramProps {
  layout?: "dagre" | "force";
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  nodeBricks?: NodeBrickConf[];
  lines?: LineConf[];
  layoutOptions?: LayoutOptions;
  connectNodes?: ConnectNodesOptions;
  dragNodes?: DragNodesOptions;
  activeTarget?: ActiveTarget | null;
  disableKeyboardAction?: boolean;
  zoomable?: boolean;
  scrollable?: boolean;
  pannable?: boolean;
  scaleRange?: RangeTuple;
}

export interface DiagramRef {
  callOnLineLabel(id: string, method: string, ...args: unknown[]): void;
}

export const EoDiagramComponent = forwardRef(LegacyEoDiagramComponent);

/**
 * 构件 `eo-diagram`
 */
export
@defineElement("eo-diagram", {
  styleTexts: [styleText],
})
class EoDiagram extends ReactNextElement implements EoDiagramProps {
  /**
   * @required
   */
  @property({ type: String })
  accessor layout: "dagre" | "force" | undefined;

  @property({ attribute: false })
  accessor nodes: DiagramNode[] | undefined;

  @property({ attribute: false })
  accessor edges: DiagramEdge[] | undefined;

  @property({ attribute: false })
  accessor nodeBricks: NodeBrickConf[] | undefined;

  @property({ attribute: false })
  accessor lines: LineConf[] | undefined;

  @property({ attribute: false })
  accessor layoutOptions: LayoutOptions | undefined;

  @property({ attribute: false })
  accessor activeTarget: ActiveTarget | null | undefined;

  @property({ type: Boolean })
  accessor disableKeyboardAction: boolean | undefined;

  @property({ attribute: false })
  accessor connectNodes: ConnectNodesOptions | undefined;

  /**
   * @deprecated use `connectNodes` instead
   */
  @property({ attribute: false })
  accessor nodesConnect: ConnectNodesOptions | undefined;

  @property({ attribute: false })
  accessor dragNodes: DragNodesOptions | undefined;

  @property({ type: Boolean })
  accessor zoomable: boolean | undefined = true;

  @property({ type: Boolean })
  accessor scrollable: boolean | undefined = true;

  @property({ type: Boolean })
  accessor pannable: boolean | undefined = true;

  @property({ attribute: false })
  accessor scaleRange: RangeTuple | undefined;

  @event({ type: "activeTarget.change" })
  accessor #activeTargetChangeEvent!: EventEmitter<ActiveTarget | null>;

  #handleActiveTargetChange = (target: ActiveTarget | null) => {
    this.#activeTargetChangeEvent.emit(target);
  };

  @event({ type: "node.delete" })
  accessor #nodeDelete!: EventEmitter<DiagramNode>;

  #handleNodeDelete = (node: DiagramNode) => {
    this.#nodeDelete.emit(node);
  };

  @event({ type: "edge.delete" })
  accessor #edgeDelete!: EventEmitter<DiagramEdge>;

  #handleEdgeDelete = (edge: DiagramEdge) => {
    this.#edgeDelete.emit(edge);
  };

  @event({ type: "line.click" })
  accessor #lineClick!: EventEmitter<LineTarget>;

  #handleLineClick = (line: LineTarget) => {
    this.#lineClick.emit(line);
  };

  @event({ type: "line.dblclick" })
  accessor #lineDoubleClick!: EventEmitter<LineTarget>;

  #handleLineDoubleClick = (line: LineTarget) => {
    this.#lineDoubleClick.emit(line);
  };

  @event({ type: "nodes.connect" })
  accessor #connectNodes!: EventEmitter<ConnectLineDetail>;

  #handleNodesConnect = (detail: ConnectLineDetail) => {
    this.#connectNodes.emit(detail);
  };

  #handleSwitchActiveTarget = (target: ActiveTarget | null) => {
    this.activeTarget = target;
  };

  #diagramRef = createRef<DiagramRef>();

  @method()
  callOnLineLabel(id: string, method: string, ...args: unknown[]) {
    this.#diagramRef.current?.callOnLineLabel(id, method, ...args);
  }

  render() {
    return (
      <EoDiagramComponent
        ref={this.#diagramRef}
        layout={this.layout}
        nodes={this.nodes}
        edges={this.edges}
        nodeBricks={this.nodeBricks}
        lines={this.lines}
        layoutOptions={this.layoutOptions}
        connectNodes={this.connectNodes ?? this.nodesConnect}
        dragNodes={this.dragNodes}
        activeTarget={this.activeTarget}
        disableKeyboardAction={this.disableKeyboardAction}
        zoomable={this.zoomable}
        scrollable={this.scrollable}
        pannable={this.pannable}
        scaleRange={this.scaleRange}
        onActiveTargetChange={this.#handleActiveTargetChange}
        onSwitchActiveTarget={this.#handleSwitchActiveTarget}
        onNodeDelete={this.#handleNodeDelete}
        onEdgeDelete={this.#handleEdgeDelete}
        onLineClick={this.#handleLineClick}
        onLineDoubleClick={this.#handleLineDoubleClick}
        onNodesConnect={this.#handleNodesConnect}
      />
    );
  }
}

export interface EoDiagramComponentProps extends EoDiagramProps {
  onActiveTargetChange?(target: ActiveTarget | null): void;
  onSwitchActiveTarget?(target: ActiveTarget | null): void;
  onNodeDelete?(node: DiagramNode): void;
  onEdgeDelete?(edge: DiagramEdge): void;
  onLineClick?(line: LineTarget): void;
  onLineDoubleClick?(line: LineTarget): void;
  onNodesConnect?(detail: ConnectLineDetail): void;
}

export function LegacyEoDiagramComponent(
  {
    layout,
    nodes,
    edges,
    nodeBricks,
    lines,
    layoutOptions,
    connectNodes,
    dragNodes,
    activeTarget,
    disableKeyboardAction,
    zoomable,
    scrollable,
    pannable,
    scaleRange: _scaleRange,
    onActiveTargetChange,
    onSwitchActiveTarget,
    onNodeDelete,
    onEdgeDelete,
    onLineClick,
    onLineDoubleClick,
    onNodesConnect,
  }: EoDiagramComponentProps,
  ref: React.Ref<DiagramRef>
) {
  const [nodesReady, setNodesReady] = useState(false);
  const [nodesRenderId, setNodesRenderId] = useState(0);
  const [nodesRefRepository, setNodesRefRepository] =
    useState<RefRepository | null>(null);
  const [lineLabelsReady, setLineLabelsReady] = useState(false);
  const [lineLabelsRenderId, setLineLabelsRenderId] = useState(0);
  const [lineLabelsRefRepository, setLineLabelsRefRepository] =
    useState<RefRepository | null>(null);
  const [renderedLineLabels, setRenderedLineLabels] = useState<
    RenderedLineLabel[]
  >([]);

  const [grabbing, setGrabbing] = useState(false);
  const [transform, setTransform] = useState<TransformLiteral>({
    k: 1,
    x: 0,
    y: 0,
  });

  const linePathsRef = useRef(new Map<string, SVGPathElement | null>());

  const rootRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const [centered, setCentered] = useState(false);

  const { userViewReady, userViewNodesMap, saveUserView } = useUserView(
    dragNodes?.save
  );

  const [connectLineTo, setConnectLineTo] = useState<PositionTuple>([0, 0]);
  const [connectLineState, setConnectLineState] =
    useState<ConnectLineState | null>(null);
  const [manualLayoutStatus, setManualLayoutStatus] =
    useState<ManualLayoutStatus>("initial");
  const [nodeMovement, setNodeMovement] = useState<NodeMovement | null>(null);

  useImperativeHandle(ref, () => ({
    callOnLineLabel(id, method, ...args) {
      (
        lineLabelsRefRepository?.get(id)
          ?.firstElementChild as unknown as Record<string, Function>
      )?.[method](...args);
    },
  }));

  useEffect(() => {
    const onNodesMouseDown = (event: MouseEvent) => {
      handleNodesMouseDown(event, {
        nodes,
        nodesRefRepository,
        connectNodes,
        dragNodes,
        setConnectLineState,
        setConnectLineTo,
        setManualLayoutStatus,
        setNodeMovement,
        onSwitchActiveTarget,
        onNodesConnect,
      });
    };
    // Bind mousedown event manually, since the React event handler can't work with
    // d3-zoom inside shadow DOM.
    const nodesContainer = nodesRef.current;
    nodesContainer?.addEventListener("mousedown", onNodesMouseDown);
    return () => {
      nodesContainer?.removeEventListener("mousedown", onNodesMouseDown);
    };
  }, [
    nodes,
    connectNodes,
    dragNodes,
    nodesRefRepository,
    onNodesConnect,
    onSwitchActiveTarget,
  ]);

  const { normalizedLines, normalizedLinesMap, markers } = useMemo(
    () => normalizeLinesAndMarkers(edges, lines),
    [edges, lines]
  );

  const lineLabels = useMemo(() => {
    return normalizedLines.flatMap(({ line: { text, label, $id }, edge }) => {
      if (!text && !label) {
        return [] as LineLabel[];
      }

      let key: "label" | "text";
      let list: LineLabelConf[] | TextOptions[];
      if (label) {
        key = "label";
        list = ([] as LineLabelConf[]).concat(label);
      } else {
        key = "text";
        list = ([] as TextOptions[]).concat(text!);
      }

      return list.map<LineLabel>((item) => ({
        [key as "label"]: item as LineLabelConf,
        id: `${$id}-${item.placement ?? "center"}`,
        edge,
      }));
    });
  }, [normalizedLines]);

  const { nodes: renderedNodes, edges: renderedEdges } = useRenderedDiagram({
    layout,
    nodes,
    edges,
    manualLayoutStatus,
    userViewReady,
    userViewNodesMap,
    nodeMovement,
    nodesRefRepository,
    lineLabelsRefRepository,
    normalizedLinesMap,
    layoutOptions,
    nodesRenderId,
    lineLabelsRenderId,
  });

  useEffect(
    () => {
      if (manualLayoutStatus === "finished") {
        saveUserView(
          renderedNodes.map((node) => ({
            id: node.id,
            x: node.x,
            y: node.y,
          }))
        );
      }
    },
    // Only save user view when manual layout is just finished.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manualLayoutStatus]
  );

  const renderedLines = useMemo(
    () => getRenderedLines(renderedEdges, normalizedLines),
    [normalizedLines, renderedEdges]
  );

  const activeTargetChangeInitialized = useRef(false);
  useEffect(() => {
    if (!activeTargetChangeInitialized.current) {
      activeTargetChangeInitialized.current = true;
      return;
    }
    onActiveTargetChange?.(activeTarget ?? null);
  }, [nodes, activeTarget, onActiveTargetChange]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || disableKeyboardAction) {
      return;
    }
    const onKeydown = (event: KeyboardEvent) => {
      const action = handleKeyboard(event, {
        renderedNodes,
        renderedEdges,
        activeTarget,
      });

      if (action?.action === "delete-node") {
        onNodeDelete?.(action.node);
      } else if (action?.action === "delete-edge") {
        onEdgeDelete?.(action.edge);
      } else if (action?.action === "switch-active-node" && action.node) {
        onSwitchActiveTarget?.({ type: "node", nodeId: action.node.id });
      }
    };
    root.addEventListener("keydown", onKeydown);
    return () => {
      root.removeEventListener("keydown", onKeydown);
    };
  }, [
    activeTarget,
    renderedNodes,
    renderedEdges,
    disableKeyboardAction,
    onSwitchActiveTarget,
    onNodeDelete,
    onEdgeDelete,
  ]);

  const handleNodesRendered = useCallback(
    (refRepository: RefRepository | null) => {
      if (refRepository) {
        setNodesRenderId((previous) => previous + 1);
        setNodesRefRepository(refRepository);
      }
      setNodesReady((previous) => previous || !!refRepository);
    },
    []
  );

  const handleLineLabelsRendered = useCallback(
    (refRepository: RefRepository | null) => {
      if (refRepository) {
        setLineLabelsRenderId((previous) => previous + 1);
        setLineLabelsRefRepository(refRepository);
      }
      setLineLabelsReady((previous) => previous || !!refRepository);
    },
    []
  );

  const scaleRange = useMemo(
    () =>
      _scaleRange ??
      ([DEFAULT_SCALE_RANGE_MIN, DEFAULT_SCALE_RANGE_MAX] as RangeTuple),
    [_scaleRange]
  );

  const zoomer = useMemo(() => zoom<HTMLDivElement, unknown>(), []);

  useEffect(() => {
    let moved = false;
    zoomer
      .scaleExtent(zoomable ? scaleRange : [1, 1])
      .on("start", () => {
        moved = false;
        setGrabbing(true);
      })
      .on("zoom", (e: { transform: TransformLiteral }) => {
        moved = true;
        setTransform(e.transform);
      })
      .on("end", () => {
        setGrabbing(false);
        if (!moved) {
          onSwitchActiveTarget?.(null);
        }
      });
  }, [onSwitchActiveTarget, scaleRange, zoomable, zoomer]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const rootSelection = select(root);

    const unsetZoom = () => {
      rootSelection
        .on(".zoom", null)
        .on(".zoom.custom", null)
        .on("wheel", null);
    };

    if (!(zoomable || scrollable || pannable)) {
      unsetZoom();
      return;
    }

    if (zoomable || scrollable) {
      // Do not override default d3 zoom handler.
      // Only handles *panning*
      rootSelection.on(
        "wheel.zoom.custom",
        (e: WheelEvent & { wheelDeltaX: number; wheelDeltaY: number }) => {
          // Mac OS trackpad pinch event is emitted as a wheel.zoom and d3.event.ctrlKey set to true
          if (!e.ctrlKey) {
            // Stop immediate propagation for default d3 zoom handler
            e.stopImmediatePropagation();
            if (scrollable) {
              e.preventDefault();
              zoomer.translateBy(
                rootSelection,
                e.wheelDeltaX / 5,
                e.wheelDeltaY / 5
              );
            }
          }
          // zoomer.scaleBy(rootSelection, Math.pow(2, defaultWheelDelta(e)))
        }
      );
    }

    rootSelection
      .call(zoomer)
      .on("wheel", (e: WheelEvent) => e.preventDefault())
      .on("dblclick.zoom", null);

    if (!pannable) {
      rootSelection
        .on("mousedown.zoom", null)
        .on("touchstart.zoom", null)
        .on("touchmove.zoom", null)
        .on("touchend.zoom", null);
    }

    return unsetZoom;
  }, [pannable, scrollable, zoomable, zoomer]);

  useEffect(() => {
    const root = rootRef.current;
    if (renderedNodes.length === 0 || !root || centered) {
      return;
    }
    const { k, x, y } = transformToCenter(renderedNodes, {
      canvasWidth: root.clientWidth,
      canvasHeight: root.clientHeight,
      scaleRange: zoomable ? scaleRange : undefined,
    });
    zoomer.transform(select(root), new ZoomTransform(k, x, y));
    setCentered(true);
  }, [centered, renderedNodes, scaleRange, zoomable, zoomer]);

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;
  const clipPathPrefix = `${defPrefix}clip-path-`;
  const activeLineMarkerPrefix = `${defPrefix}active-line-`;

  useEffect(() => {
    setRenderedLineLabels((previous) =>
      getRenderedLineLabels(previous, renderedLines, linePathsRef.current)
    );
  }, [renderedLines]);

  const [clipPathList, setClipPathList] = React.useState<LineTextClipPath[]>(
    []
  );

  useEffect(() => {
    if (!lineLabelsRefRepository) {
      return;
    }
    adjustLineLabels(renderedLineLabels, lineLabelsRefRepository);
    setClipPathList(
      getClipPathList(renderedLineLabels, lineLabelsRefRepository)
    );
  }, [lineLabelsRenderId, lineLabelsRefRepository, renderedLineLabels]);

  if (layout !== "dagre" && layout !== "force") {
    return <div>{`Diagram layout not supported: "${layout}"`}</div>;
  }

  return (
    <div
      className={classNames("diagram", {
        ready: nodesReady && centered,
        grabbing,
        pannable,
      })}
      tabIndex={-1}
      ref={rootRef}
    >
      <svg width="100%" height="100%" className="lines">
        <defs>
          {markers.map(({ strokeColor }, index) => (
            <MarkerComponent
              key={index}
              id={`${markerPrefix}${index}`}
              strokeColor={strokeColor}
            />
          ))}
          {clipPathList.map((clipPath) => (
            <ClipPathComponent
              key={clipPath.lineId}
              clipPath={clipPath}
              clipPathPrefix={clipPathPrefix}
              renderedLineLabels={renderedLineLabels}
            />
          ))}
          <marker
            id={`${activeLineMarkerPrefix}start`}
            viewBox="0 0 8 8"
            refX={4}
            refY={4}
            markerWidth={8}
            markerHeight={8}
            orient="auto"
          >
            <path
              d="M 0.5 0.5 H 7.5 V 7.5 H 0.5 Z"
              stroke="var(--palette-gray-7)"
              strokeWidth={1}
              fill="var(--palette-gray-1)"
            />
          </marker>
          <marker
            id={`${activeLineMarkerPrefix}end`}
            viewBox="0 0 14 8"
            refX={3}
            refY={4}
            markerWidth={14}
            markerHeight={8}
            orient="auto"
          >
            <path
              d="M 0.5 1.5 L 5.5 4 L 0.5 6.5 z"
              stroke="var(--palette-blue-3)"
              strokeWidth={1}
              fill="var(--palette-blue-3)"
            />
            <path
              d="M 6.5 0.5 H 13.5 V 7.5 H 6.5 Z"
              stroke="var(--palette-gray-7)"
              strokeWidth={1}
              fill="var(--palette-gray-1)"
            />
          </marker>
        </defs>
        <g
          transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}
        >
          {renderedLines.map((line) => (
            <LineComponent
              key={line.line.$id}
              line={line}
              linePaths={linePathsRef.current}
              clipPathList={clipPathList}
              markerPrefix={markerPrefix}
              clipPathPrefix={clipPathPrefix}
              activeLineMarkerPrefix={activeLineMarkerPrefix}
              activeEdge={
                activeTarget?.type === "edge" ? activeTarget.edge : null
              }
              onLineClick={onLineClick}
              onLineDoubleClick={onLineDoubleClick}
            />
          ))}
        </g>
      </svg>
      <div
        className={classNames("line-labels", { ready: lineLabelsReady })}
        style={{
          left: transform.x,
          top: transform.y,
          transform: `scale(${transform.k})`,
        }}
      >
        <LineLabelComponentGroup
          labels={lineLabels}
          onRendered={handleLineLabelsRendered}
        />
      </div>
      <div
        className="nodes"
        ref={nodesRef}
        style={{
          left: transform.x,
          top: transform.y,
          transform: `scale(${transform.k})`,
        }}
      >
        <NodeComponentGroup
          nodes={nodes}
          nodeBricks={nodeBricks}
          // nodePositions={nodePositions}
          onRendered={handleNodesRendered}
        />
      </div>
      <ConnectLineComponent
        connectLineState={connectLineState}
        connectLineTo={connectLineTo}
        markerPrefix={markerPrefix}
      />
    </div>
  );
}
