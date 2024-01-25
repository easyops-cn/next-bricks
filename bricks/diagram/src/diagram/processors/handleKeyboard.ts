import { minBy } from "lodash";
import type {
  ActiveTarget,
  DiagramEdge,
  DiagramNode,
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
    activeTarget,
  }: {
    renderedNodes: RenderedNode[];
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
          node = moveOnAxis("x", renderedNodes, activeNode, -1);
          action = "switch-active-node";
          break;
        }
        case "ArrowUp":
        case 38: {
          node = moveOnAxis("y", renderedNodes, activeNode, -1);
          action = "switch-active-node";
          break;
        }
        case "ArrowRight":
        case 39: {
          node = moveOnAxis("x", renderedNodes, activeNode, 1);
          action = "switch-active-node";
          break;
        }
        case "ArrowDown":
        case 40: {
          node = moveOnAxis("y", renderedNodes, activeNode, 1);
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

function moveOnAxis(
  axis: "x" | "y",
  renderedNodes: RenderedNode[],
  activeNode: RenderedNode,
  direction: 1 | -1
) {
  const oppositeAxis = axis === "x" ? "y" : "x";
  let diff: number;
  const candidates = renderedNodes.filter(
    (node) =>
      node !== activeNode &&
      ((diff = (node[axis] - activeNode[axis]) * direction), diff > 0) &&
      diff > Math.abs(activeNode[oppositeAxis] - node[oppositeAxis])
  );
  return minBy(
    candidates,
    (node) =>
      (activeNode[oppositeAxis] - node[oppositeAxis]) ** 2 +
      (activeNode[axis] - node[axis]) ** 2
  );
}
