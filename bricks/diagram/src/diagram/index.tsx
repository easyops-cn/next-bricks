import React, {
  useCallback,
  useEffect,
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
import type {
  DiagramEdge,
  DiagramNode,
  LayoutOptionsDagre,
  LineConf,
  LineMarker,
  NodeBrickConf,
  RefRepository,
  RenderedEdge,
  RenderedLine,
  RenderedNode,
  TransformLiteral,
} from "./interfaces";
import { NodeComponentGroup } from "./NodeComponent";
import { curveLine } from "./lines/curveLine";
import { handleKeyboard } from "./processors/handleKeyboard";
import { getCenterOffsets } from "./processors/getCenterOffsets";
import { getRenderedLinesAndMarkers } from "./processors/getRenderedLinesAndMarkers";
import styleText from "./styles.shadow.css";
import { uniqueId } from "lodash";

const { defineElement, property, event } = createDecorators();

export interface EoDiagramProps {
  layout?: "dagre";
  nodes?: DiagramNode[];
  edges?: DiagramEdge[];
  nodeBricks?: NodeBrickConf[];
  lines?: LineConf[];
  layoutOptions?: LayoutOptionsDagre;
  activeNodeId?: string;
  disableKeyboardAction?: boolean;
  onActiveNodeChange?(node: DiagramNode | undefined): void;
  onSwitchActiveNode?(id: string | undefined): void;
  onNodeDelete?(node: DiagramNode): void;
}

export interface DiagramHandler {
  moveIntoView(id: string): void;
}

/**
 * 构件 `eo-diagram`
 */
export
@defineElement("eo-diagram", {
  styleTexts: [styleText],
  // shadowOptions: false
})
class EoDiagram extends ReactNextElement implements EoDiagramProps {
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

  @property({ type: String })
  accessor activeNodeId: string | undefined;

  @property({ type: Boolean })
  accessor disableKeyboardAction: boolean | undefined;

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

  #handleSwitchActiveNode = (id: string | undefined) => {
    this.activeNodeId = id;
  };

  render() {
    return (
      <EoDiagramComponent
        layout={this.layout}
        nodes={this.nodes}
        edges={this.edges}
        nodeBricks={this.nodeBricks}
        lines={this.lines}
        layoutOptions={this.layoutOptions}
        activeNodeId={this.activeNodeId}
        disableKeyboardAction={this.disableKeyboardAction}
        onActiveNodeChange={this.#handleActiveNodeChange}
        onSwitchActiveNode={this.#handleSwitchActiveNode}
        onNodeDelete={this.#handleNodeDelete}
      />
    );
  }
}

export function EoDiagramComponent({
  layout,
  nodes,
  edges,
  nodeBricks,
  lines,
  layoutOptions,
  activeNodeId,
  disableKeyboardAction,
  onActiveNodeChange,
  onSwitchActiveNode,
  onNodeDelete,
}: EoDiagramProps) {
  // const [nodePositions, setNodePositions] = useState<Map<DiagramNodeId, NodePosition> | undefined>();
  const [graph, setGraph] = useState<dagre.graphlib.Graph<RenderedNode> | null>(
    null
  );
  const [nodesReady, setNodesReady] = useState(false);
  const [renderId, setRenderId] = useState(0);
  const [refRepository, setRefRepository] = useState<RefRepository | null>(
    null
  );
  const [renderedNodes, setRenderedNodes] = useState<RenderedNode[]>([]);
  const [renderedEdges, setRenderedEdges] = useState<RenderedEdge[]>([]);
  const [renderedLines, setRenderedLines] = useState<RenderedLine[]>([]);
  const [markers, setMarkers] = useState<LineMarker[]>([]);

  const draggerRef = useRef<HTMLDivElement>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [transform, setTransform] = useState<TransformLiteral>({
    k: 1,
    x: 0,
    y: 0,
  });

  const rootRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState<[x: number, y: number]>([0, 0]);
  const [centered, setCentered] = useState(false);

  const nodePadding = layoutOptions?.nodePadding ?? 0;

  useEffect(() => {
    const nextActiveNode = activeNodeId
      ? nodes?.find((node) => node.id === activeNodeId)
      : undefined;
    onActiveNodeChange?.(nextActiveNode);
  }, [nodes, activeNodeId, onActiveNodeChange]);

  useEffect(() => {
    setGraph((previousGraph) => {
      // Create a new directed graph
      const newGraph = new dagre.graphlib.Graph<RenderedNode>();

      // Set an object for the graph label
      newGraph.setGraph({
        ranksep: 50,
        nodesep: 20,
        // padding: 15,
        rankdir: "TB",
        // acyclicer: "greedy",
      });

      // Default to assigning a new object as a label for each new edge.
      newGraph.setDefaultEdgeLabel(function () {
        return {};
      });

      for (const node of nodes ?? []) {
        const previousNode = previousGraph?.node(node.id);
        newGraph.setNode(
          node.id,
          previousNode?.data === node
            ? previousNode
            : {
                id: node.id,
                data: node,
              }
        );
      }

      for (const edge of edges ?? []) {
        newGraph.setEdge(edge.source, edge.target, { data: edge });
      }

      return newGraph;
    });
  }, [edges, nodes]);

  useEffect(() => {
    if (!graph || !refRepository || graph.nodeCount() === 0) {
      return;
    }

    for (const id of graph.nodes()) {
      const node = graph.node(id);
      if (!node) {
        // eslint-disable-next-line no-console
        console.error("Diagram node not found: %s", id);
        continue;
      }
      const element = refRepository.get(id);
      node.width = (element?.offsetWidth ?? 10) + nodePadding * 2;
      node.height = (element?.offsetHeight ?? 10) + nodePadding * 2;
    }

    dagre.layout(graph);

    // const positions = new Map<DiagramNodeId, NodePosition>();
    const renderedNodes: RenderedNode[] = [];

    for (const v of graph.nodes()) {
      const node = graph.node(v);
      if (!node) {
        continue;
      }
      renderedNodes.push(node);
      const x = node.x - node.width / 2 + nodePadding;
      const y = node.y - node.height / 2 + nodePadding;
      // positions.set(v, { x, y });

      const nodeContainer = refRepository.get(v)?.parentElement;
      if (nodeContainer) {
        nodeContainer.style.left = `${x}px`;
        nodeContainer.style.top = `${y}px`;
        nodeContainer.style.visibility = "visible";
      }
    }

    setRenderedNodes(renderedNodes);

    setRenderedEdges(graph.edges().map((e) => graph.edge(e) as RenderedEdge));

    // setNodePositions(positions);
  }, [graph, refRepository, renderId, nodePadding]);

  useEffect(() => {
    const { renderedLines, markers } = getRenderedLinesAndMarkers(
      renderedEdges,
      lines
    );
    setRenderedLines(renderedLines);
    setMarkers(markers);
  }, [lines, renderedEdges]);

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
        setRenderId((previous) => previous + 1);
        setRefRepository(refRepository);
      }
      setNodesReady((previous) => previous || !!refRepository);
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
      zoomer.translateBy(select(dragger), e.wheelDeltaX / 5, e.wheelDeltaY / 5);
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

  const markerPrefix = useMemo(() => `${uniqueId("diagram-line-arrow-")}-`, []);

  if (layout !== "dagre") {
    return <div>{`Diagram layout not supported: "${layout}"`}</div>;
  }

  return (
    <div
      className={classNames("diagram", { ready: nodesReady && centered })}
      tabIndex={-1}
      ref={rootRef}
    >
      <svg width="100%" height="100%" className="lines">
        <defs>
          {markers.map(({ strokeColor }, index) => (
            <marker
              key={index}
              id={`${markerPrefix}${index}`}
              viewBox="0 0 6 6"
              refX={3}
              refY={3}
              markerWidth={6}
              markerHeight={6}
              orient="auto"
            >
              <path
                d="M 0.5 0.5 L 5.5 3 L 0.5 5.5 z"
                stroke={strokeColor}
                strokeWidth={1}
                fill={strokeColor}
              />
            </marker>
          ))}
        </defs>
        <g
          transform={`translate(${offsets[0] + transform.x} ${
            offsets[1] + transform.y
          }) scale(${transform.k})`}
        >
          {renderedLines.map(({ points, line, markerIndex }, index) => (
            <path
              key={index}
              stroke={line.strokeColor}
              strokeWidth={line.strokeWidth}
              d={curveLine(points, line.arrow ? -5 : 0, line.curveType)}
              fill="none"
              markerEnd={
                markerIndex === undefined
                  ? undefined
                  : `url(#${markerPrefix}${markerIndex})`
              }
            />
          ))}
        </g>
      </svg>
      <div className={classNames("dragger", { grabbing })} ref={draggerRef} />
      <div
        className="nodes"
        ref={nodesRef}
        style={{
          left: offsets[0] + transform.x,
          top: offsets[1] + transform.y,
        }}
      >
        <NodeComponentGroup
          nodes={nodes}
          nodeBricks={nodeBricks}
          // nodePositions={nodePositions}
          onRendered={handleNodesRendered}
        />
      </div>
    </div>
  );
}
