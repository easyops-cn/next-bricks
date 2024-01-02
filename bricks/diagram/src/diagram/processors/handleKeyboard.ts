import { minBy } from "lodash";
import type { DiagramNode, RenderedEdge, RenderedNode } from "../interfaces";

export type KeyboardAction =
  | KeyboardActionSwitchActiveNode
  | KeyboardActionDeleteNode;

export interface KeyboardActionSwitchActiveNode {
  action: "switch-active-node";
  node?: DiagramNode;
}

export interface KeyboardActionDeleteNode {
  action: "delete-node";
  node: DiagramNode;
}

export function handleKeyboard(
  event: KeyboardEvent,
  {
    renderedNodes,
    renderedEdges,
    activeNodeId,
  }: {
    renderedNodes: RenderedNode[];
    renderedEdges: RenderedEdge[];
    activeNodeId: string | undefined;
  }
): KeyboardAction | undefined {
  const activeNode = activeNodeId
    ? renderedNodes.find((node) => node.id === activeNodeId)
    : undefined;

  if (!activeNode) {
    return;
  }

  const key =
    event.key ||
    /* istanbul ignore next: compatibility */ event.keyCode ||
    /* istanbul ignore next: compatibility */ event.which;
  let action: KeyboardAction["action"] | undefined;
  let node: RenderedNode | undefined;
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
    case "Backspace":
    case 8:
    case "Delete":
    case 46: {
      action = "delete-node";
      node = activeNode;
      break;
    }
  }
  if (action) {
    event.preventDefault();
    event.stopPropagation();
    return { action, node: node?.data } as KeyboardAction;
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
