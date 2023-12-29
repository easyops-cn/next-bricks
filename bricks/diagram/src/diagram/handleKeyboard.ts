import { minBy } from "lodash";
import type { DiagramNode, RenderedEdge, RenderedNode } from "./interfaces";

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
      const candidates = renderedNodes.filter(
        (node) =>
          node !== activeNode &&
          node.x < activeNode.x &&
          activeNode.x - node.x > Math.abs(activeNode.y - node.y)
      );
      node = minBy(
        candidates,
        (node) => (activeNode.y - node.y) ** 2 + (activeNode.x - node.x) ** 2
      );
      action = "switch-active-node";
      break;
    }
    case "ArrowUp":
    case 38: {
      const candidateEdges = renderedEdges.filter(
        ({ data }) =>
          data.target === activeNodeId && data.source !== activeNodeId
      );
      const candidates = candidateEdges
        .map(({ data: { source } }) =>
          renderedNodes.find((node) => node.id === source)
        )
        .filter((node) => node && node.y < activeNode.y) as RenderedNode[];
      node = minBy(candidates, (node) => Math.abs(activeNode.x - node.x));
      action = "switch-active-node";
      break;
    }
    case "ArrowRight":
    case 39: {
      const candidates = renderedNodes.filter(
        (node) =>
          node !== activeNode &&
          node.x > activeNode.x &&
          node.x - activeNode.x > Math.abs(activeNode.y - node.y)
      );
      node = minBy(candidates, (node) => Math.abs(activeNode.y - node.y));
      action = "switch-active-node";
      break;
    }
    case "ArrowDown":
    case 40: {
      const candidateEdges = renderedEdges.filter(
        ({ data }) =>
          data.source === activeNodeId && data.target !== activeNodeId
      );
      const candidates = candidateEdges
        .map(({ data: { target } }) =>
          renderedNodes.find((node) => node.id === target)
        )
        .filter((node) => node && node.y > activeNode.y) as RenderedNode[];
      node = minBy(
        candidates,
        (node) => (activeNode.y - node.y) ** 2 + (activeNode.x - node.x) ** 2
      );
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
