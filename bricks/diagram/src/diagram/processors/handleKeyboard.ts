import { minBy } from "lodash";
import type {
  ActiveTarget,
  DiagramEdge,
  DiagramNode,
  RenderedEdge,
  RenderedNode,
} from "../interfaces";

export type KeyboardAction =
  | KeyboardActionSwitchActiveNode
  | KeyboardActionDeleteNode
  | KeyboardActionDeleteEdge;

export interface KeyboardActionSwitchActiveNode {
  action: "switch-active-node";
  node?: DiagramNode;
}

export interface KeyboardActionDeleteNode {
  action: "delete-node";
  node: DiagramNode;
}

export interface KeyboardActionDeleteEdge {
  action: "delete-edge";
  edge: DiagramEdge;
}

export function handleKeyboard(
  event: KeyboardEvent,
  {
    renderedNodes,
    renderedEdges,
    activeTarget,
  }: {
    renderedNodes: RenderedNode[];
    renderedEdges: RenderedEdge[];
    activeTarget: ActiveTarget | null | undefined;
  }
): KeyboardAction | undefined {
  const activeNode =
    activeTarget?.type === "node"
      ? renderedNodes.find((node) => node.id === activeTarget.nodeId)
      : undefined;
  const activeEdge =
    activeTarget?.type === "edge" ? activeTarget.edge : undefined;

  if (!activeNode && !activeEdge) {
    return;
  }

  const key =
    event.key ||
    /* istanbul ignore next: compatibility */ event.keyCode ||
    /* istanbul ignore next: compatibility */ event.which;
  let action: KeyboardAction["action"] | undefined;
  let node: RenderedNode | undefined;
  let edge: DiagramEdge | undefined;

  switch (key) {
    case "Backspace":
    case 8:
    case "Delete":
    case 46: {
      if (activeNode) {
        action = "delete-node";
        node = activeNode;
      } else {
        action = "delete-edge";
        edge = activeEdge;
      }
      break;
    }
    default:
      if (!activeNode) {
        return;
      }
      switch (key) {
        case "ArrowLeft":
        case 37: {
          node = moveOnX(renderedNodes, activeNode, -1);
          action = "switch-active-node";
          break;
        }
        case "ArrowUp":
        case 38: {
          node = moveOnY(renderedNodes, renderedEdges, activeNode, -1);
          action = "switch-active-node";
          break;
        }
        case "ArrowRight":
        case 39: {
          node = moveOnX(renderedNodes, activeNode, 1);
          action = "switch-active-node";
          break;
        }
        case "ArrowDown":
        case 40: {
          node = moveOnY(renderedNodes, renderedEdges, activeNode, 1);
          action = "switch-active-node";
          break;
        }
      }
  }
  if (action) {
    event.preventDefault();
    event.stopPropagation();
    return { action, node: node?.data, edge } as KeyboardAction;
  }
}

function moveOnX(
  renderedNodes: RenderedNode[],
  activeNode: RenderedNode,
  direction: 1 | -1
) {
  let diff: number;
  const candidates = renderedNodes.filter(
    (node) =>
      node !== activeNode &&
      ((diff = (node.x - activeNode.x) * direction), diff > 0) &&
      diff > Math.abs(activeNode.y - node.y)
  );
  return minBy(
    candidates,
    (node) => (activeNode.y - node.y) ** 2 + (activeNode.x - node.x) ** 2
  );
}

function moveOnY(
  renderedNodes: RenderedNode[],
  renderedEdges: RenderedEdge[],
  activeNode: RenderedNode,
  direction: 1 | -1
) {
  const from = direction === 1 ? "source" : "target";
  const to = direction === 1 ? "target" : "source";
  const candidateEdges = renderedEdges.filter(
    ({ data }) => data[from] === activeNode.id && data[to] !== activeNode.id
  );
  const candidates = candidateEdges
    .map(({ data }) => renderedNodes.find((node) => node.id === data[to]))
    .filter(
      (node) => node && (node.y - activeNode.y) * direction > 0
    ) as RenderedNode[];
  return minBy(
    candidates,
    (node) => (activeNode.y - node.y) ** 2 + (activeNode.x - node.x) ** 2
  );
}
