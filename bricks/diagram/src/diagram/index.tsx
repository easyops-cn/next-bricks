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
import dagre from "@dagrejs/dagre";
import { select } from "d3-selection";
import { zoom } from "d3-zoom";
import classNames from "classnames";
import { pick, uniqueId } from "lodash";
import type {
  DiagramEdge,
  DiagramNode,
  LayoutOptionsDagre,
  LineConf,
  NodeBrickConf,
  PositionTuple,
  RefRepository,
  RenderedEdge,
  RenderedLineLabel,
  RenderedNode,
  LineTextClipPath,
  TransformLiteral,
  LineTarget,
  ConnectLineDetail,
  NodesConnectOptions,
  ConnectLineState,
} from "./interfaces";
import { NodeComponentGroup } from "./NodeComponent";
import { handleKeyboard } from "./processors/handleKeyboard";
import { getCenterOffsets } from "./processors/getCenterOffsets";
import { getRenderedLinesAndMarkers } from "./processors/getRenderedLinesAndMarkers";
import { LineLabelComponentGroup } from "./LineLabelComponent";
import { LineComponent } from "./LineComponent";
import { MarkerComponent } from "./MarkerComponent";
import { ClipPathComponent } from "./ClipPathComponent";
import { ConnectLineComponent } from "./ConnectLineComponent";
import { getClipPathList } from "./processors/getClipPathList";
import { getRenderedLineLabels } from "./processors/getRenderedLineLabels";
import { getRenderedDiagram } from "./processors/getRenderedDiagram";
import { getDagreGraph } from "./processors/getDagreGraph";
import { handleDiagramMouseDown } from "./processors/handleDiagramMouseDown";
import styleText from "./styles.shadow.css";

const { defineElement, property, event, method } = createDecorators();

export interface EoDiagramProps {
  layout?: "dagre";
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  nodeBricks?: NodeBrickConf[];
  lines?: LineConf[];
  layoutOptions?: LayoutOptionsDagre;
  nodesConnect?: NodesConnectOptions;
  // activeType?: "node" | "edge";
  activeNodeId?: string;
  // activeEdge?: DiagramEdge;
  disableKeyboardAction?: boolean;
}

export interface DiagramRef {
  callOnLineLabel(id: string, method: string, ...args: unknown[]): void;
}

export interface DiagramHandler {
  moveIntoView(id: string): void;
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
  accessor layout: "dagre" | undefined;

  @property({ attribute: false })
  accessor nodes: DiagramNode[] | undefined;

  @property({ attribute: false })
  accessor edges: DiagramEdge[] | undefined;

  @property({ attribute: false })
  accessor nodeBricks: NodeBrickConf[] | undefined;

  @property({ attribute: false })
  accessor lines: LineConf[] | undefined;

  @property({ attribute: false })
  accessor layoutOptions: LayoutOptionsDagre | undefined;

  // @property({ type: String })
  // accessor activeType: "node" | "edge" | undefined;

  @property({ type: String })
  accessor activeNodeId: string | undefined;

  // @property({ attribute: false })
  // accessor activeEdge: DiagramEdge | undefined;

  @property({ type: Boolean })
  accessor disableKeyboardAction: boolean | undefined;

  @property({ attribute: false })
  accessor nodesConnect: NodesConnectOptions | undefined;

  @event({ type: "activeNode.change" })
  accessor #activeNodeChangeEvent!: EventEmitter<DiagramNode | undefined>;

  #handleActiveNodeChange = (node: DiagramNode | undefined) => {
    // this.activeNodeId = node?.id;
    this.#activeNodeChangeEvent.emit(node);
  };

  @event({ type: "node.delete" })
  accessor #nodeDelete!: EventEmitter<DiagramNode>;

  #handleNodeDelete = (node: DiagramNode) => {
    this.#nodeDelete.emit(node);
  };

  @event({ type: "line.dblclick" })
  accessor #lineDoubleClick!: EventEmitter<LineTarget>;

  #handleLineDoubleClick = (line: LineTarget) => {
    this.#lineDoubleClick.emit(line);
  };

  @event({ type: "nodes.connect" })
  accessor #nodesConnect!: EventEmitter<ConnectLineDetail>;

  #handleNodesConnect = (detail: ConnectLineDetail) => {
    this.#nodesConnect.emit(detail);
  };

  #handleSwitchActiveNode = (id: string | undefined) => {
    this.activeNodeId = id;
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
        nodesConnect={this.nodesConnect}
        // activeType={this.activeType}
        activeNodeId={this.activeNodeId}
        // activeEdge={this.activeEdge}
        disableKeyboardAction={this.disableKeyboardAction}
        onActiveNodeChange={this.#handleActiveNodeChange}
        onSwitchActiveNode={this.#handleSwitchActiveNode}
        onNodeDelete={this.#handleNodeDelete}
        onLineDoubleClick={this.#handleLineDoubleClick}
        onNodesConnect={this.#handleNodesConnect}
      />
    );
  }
}

export interface EoDiagramComponentProps extends EoDiagramProps {
  onActiveNodeChange?(node: DiagramNode | undefined): void;
  onSwitchActiveNode?(id: string | undefined): void;
  onNodeDelete?(node: DiagramNode): void;
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
    nodesConnect,
    // activeType,
    activeNodeId,
    // activeEdge,
    disableKeyboardAction,
    onActiveNodeChange,
    onSwitchActiveNode,
    onNodeDelete,
    onLineDoubleClick,
    onNodesConnect,
  }: EoDiagramComponentProps,
  ref: React.Ref<DiagramRef>
) {
  const [graph, setGraph] = useState<dagre.graphlib.Graph<RenderedNode> | null>(
    null
  );
  const [nodesReady, setNodesReady] = useState(false);
  const [nodesRenderId, setNodesRenderId] = useState(0);
  const [nodesRefRepository, setNodesRefRepository] =
    useState<RefRepository | null>(null);
  // const [lineLabelsReady, setLineLabelsReady] = useState(false);
  const [lineLabelsRenderId, setLineLabelsRenderId] = useState(0);
  const [lineLabelsRefRepository, setLineLabelsRefRepository] =
    useState<RefRepository | null>(null);
  const [renderedNodes, setRenderedNodes] = useState<RenderedNode[]>([]);
  const [renderedEdges, setRenderedEdges] = useState<RenderedEdge[]>([]);
  const [renderedLineLabels, setRenderedLineLabels] = useState<
    RenderedLineLabel[]
  >([]);

  const draggerRef = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [transform, setTransform] = useState<TransformLiteral>({
    k: 1,
    x: 0,
    y: 0,
  });

  const linePathsRef = useRef(new Map<string, SVGPathElement | null>());

  const rootRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<PositionTuple>([0, 0]);
  const [centered, setCentered] = useState(false);

  const [connectLineTo, setConnectLineTo] = useState<PositionTuple>([0, 0]);
  const [connectLineState, setConnectLineState] =
    useState<ConnectLineState | null>(null);

  useImperativeHandle(ref, () => ({
    callOnLineLabel(id, method, ...args) {
      (
        lineLabelsRefRepository?.get(id)
          ?.firstElementChild as unknown as Record<string, Function>
      )?.[method](...args);
    },
  }));

  const onDiagramMouseDown = useCallback(
    (event: React.MouseEvent) => {
      handleDiagramMouseDown(event, {
        nodes,
        nodesRefRepository,
        nodesConnect,
        setConnectLineState,
        setConnectLineTo,
        onSwitchActiveNode,
        onNodesConnect,
      });
    },
    [
      nodes,
      nodesConnect,
      nodesRefRepository,
      onNodesConnect,
      onSwitchActiveNode,
    ]
  );

  const fixedOptions = useMemo(
    () => ({
      rankdir: "TB",
      ranksep: 50,
      edgesep: 10,
      nodesep: 50,
      // align: undefined,
      nodePadding: 0,
      ...layoutOptions,
    }),
    [layoutOptions]
  );

  const { nodePadding } = fixedOptions;
  const dagreGraphOptions = useMemo(
    () =>
      pick(fixedOptions, ["rankdir", "ranksep", "edgesep", "nodesep", "align"]),
    [fixedOptions]
  );

  const activeNodeChangeInitialized = useRef(false);
  useEffect(() => {
    if (!activeNodeChangeInitialized.current) {
      activeNodeChangeInitialized.current = true;
      return;
    }
    const nextActiveNode = activeNodeId
      ? nodes?.find((node) => node.id === activeNodeId)
      : undefined;
    onActiveNodeChange?.(nextActiveNode);
  }, [nodes, activeNodeId, onActiveNodeChange]);

  useEffect(() => {
    setGraph((previousGraph) =>
      getDagreGraph(previousGraph, nodes, edges, dagreGraphOptions)
    );
  }, [edges, nodes, dagreGraphOptions]);

  useEffect(() => {
    const renderedDiagram = getRenderedDiagram({
      graph,
      nodesRefRepository,
      nodePadding,
    });
    if (renderedDiagram) {
      setRenderedNodes(renderedDiagram.nodes);
      setRenderedEdges(renderedDiagram.edges);
    }
  }, [graph, nodesRefRepository, nodesRenderId, nodePadding]);

  const { renderedLines, markers } = useMemo(
    () => getRenderedLinesAndMarkers(renderedEdges, lines),
    [lines, renderedEdges]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root || disableKeyboardAction) {
      return;
    }
    const onKeydown = (event: KeyboardEvent) => {
      const action = handleKeyboard(event, {
        renderedNodes,
        renderedEdges,
        activeNodeId,
      });

      if (action?.action === "delete-node") {
        onNodeDelete?.(action.node);
      } else if (action?.action === "switch-active-node" && action.node) {
        onSwitchActiveNode?.(action.node.id);
      }
    };
    root.addEventListener("keydown", onKeydown);
    return () => {
      root.removeEventListener("keydown", onKeydown);
    };
  }, [
    activeNodeId,
    renderedNodes,
    renderedEdges,
    disableKeyboardAction,
    onSwitchActiveNode,
    onNodeDelete,
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
      // setLineLabelsReady((previous) => previous || !!refRepository);
    },
    []
  );

  useEffect(() => {
    const root = rootRef.current;
    const dragger = draggerRef.current as Element;
    if (!root || !dragger) {
      return;
    }
    let moved = false;
    const zoomer = zoom()
      .scaleExtent([1, 1])
      .on("start", () => {
        moved = false;
        setGrabbing(true);
      })
      .on("zoom", (e) => {
        moved = true;
        setTransform(e.transform);
      })
      .on("end", () => {
        setGrabbing(false);
        if (!moved) {
          onSwitchActiveNode?.(undefined);
        }
      });
    select(dragger).call(zoomer);

    select(root).on("wheel.zoom", (e) => {
      e.stopPropagation();
      e.preventDefault();
      // Mac OS trackpad pinch event is emitted as a wheel.zoom and d3.event.ctrlKey set to true
      if (!e.ctrlKey) {
        zoomer.translateBy(
          select(dragger),
          e.wheelDeltaX / 5,
          e.wheelDeltaY / 5
        );
      }
    });
  }, [onSwitchActiveNode]);

  useEffect(() => {
    const root = rootRef.current;
    if (renderedNodes.length === 0 || !root || centered) {
      return;
    }
    setOffsets(
      getCenterOffsets(renderedNodes, [root.clientWidth, root.clientHeight])
    );
    setCentered(true);
  }, [centered, renderedNodes]);

  const defPrefix = useMemo(() => `${uniqueId("diagram-")}-`, []);
  const markerPrefix = `${defPrefix}line-arrow-`;
  const clipPathPrefix = `${defPrefix}clip-path-`;

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
    setClipPathList(
      getClipPathList(renderedLineLabels, lineLabelsRefRepository)
    );
  }, [lineLabelsRenderId, lineLabelsRefRepository, renderedLineLabels]);

  if (layout !== "dagre") {
    return <div>{`Diagram layout not supported: "${layout}"`}</div>;
  }

  const rootOffsets = [offsets[0] + transform.x, offsets[1] + transform.y];

  return (
    <div
      className={classNames("diagram", { ready: nodesReady && centered })}
      tabIndex={-1}
      ref={rootRef}
      onMouseDown={onDiagramMouseDown}
    >
      <div className={classNames("dragger", { grabbing })} ref={draggerRef} />
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
              key={clipPath.id}
              clipPath={clipPath}
              clipPathPrefix={clipPathPrefix}
              renderedLineLabels={renderedLineLabels}
            />
          ))}
        </defs>
        <g
          transform={`translate(${rootOffsets[0]} ${rootOffsets[1]}) scale(${transform.k})`}
        >
          {renderedLines.map((line) => (
            <LineComponent
              key={line.line.$id}
              line={line}
              linePaths={linePathsRef.current}
              clipPathList={clipPathList}
              markerPrefix={markerPrefix}
              clipPathPrefix={clipPathPrefix}
              onLineDoubleClick={onLineDoubleClick}
            />
          ))}
        </g>
      </svg>
      <div
        className="line-labels"
        style={{
          left: rootOffsets[0],
          top: rootOffsets[1],
        }}
      >
        <LineLabelComponentGroup
          labels={renderedLineLabels}
          onRendered={handleLineLabelsRendered}
        />
      </div>
      <div
        className="nodes"
        ref={nodesRef}
        style={{
          left: rootOffsets[0],
          top: rootOffsets[1],
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
