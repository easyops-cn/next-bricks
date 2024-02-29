import type {
  ActiveTarget,
  Cell,
  NodeBasicInfo,
  // EdgeCell,
} from "../interfaces";
import { findNode } from "./findNode";

export type KeyboardAction = KeyboardActionDeleteNode;
// | KeyboardActionDeleteEdge;

export interface KeyboardActionDeleteNode {
  action: "delete-node";
  node: NodeBasicInfo;
}

// export interface KeyboardActionDeleteEdge {
//   action: "delete-edge";
//   edge: EdgeCell;
// }

export function handleKeyboard(
  event: KeyboardEvent,
  {
    cells,
    activeTarget,
  }: {
    cells: Cell[];
    activeTarget: ActiveTarget | null | undefined;
  }
): KeyboardAction | undefined {
  const activeNode =
    activeTarget?.type === "node"
      ? findNode(cells, activeTarget.id)
      : undefined;
  // const activeEdge =
  //   activeTarget?.type === "edge" ? activeTarget.edge : undefined;

  if (!activeNode /* && !activeEdge */) {
    return;
  }

  const key =
    event.key ||
    /* istanbul ignore next: compatibility */ event.keyCode ||
    /* istanbul ignore next: compatibility */ event.which;
  let action: KeyboardAction["action"] | undefined;
  let node: NodeBasicInfo | undefined;
  // let edge: DiagramEdge | undefined;

  switch (key) {
    case "Backspace":
    case 8:
    case "Delete":
    case 46: {
      // if (activeNode) {
      action = "delete-node";
      node = {
        id: activeNode.id,
        data: activeNode.data,
      };
      // } else {
      //   action = "delete-edge";
      //   edge = activeEdge;
      // }
      break;
    }
  }
  if (action) {
    event.preventDefault();
    event.stopPropagation();
    return { action, node: node! };
  }
}
