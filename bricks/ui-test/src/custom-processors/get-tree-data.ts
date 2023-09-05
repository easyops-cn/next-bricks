import { customProcessors } from "@next-core/runtime";
import {
  CommandDoc,
  CommandIcon,
  NodeGraphData,
  TestTreeData,
} from "../interface.js";
import { sortBy } from "lodash";

interface GraphEdge {
  in: string;
  out: string;
  out_name: string;
}

export interface GraphData {
  edges: GraphEdge[];
  topic_vertices: NodeGraphData[];
  vertices: NodeGraphData[];
}

function getIcon(
  nodeData: NodeGraphData,
  commandDocList: CommandDoc[]
): CommandIcon {
  let icon: CommandIcon;

  switch (nodeData.type) {
    case "suite":
      icon = {
        lib: "fa",
        icon: "vial",
        color: "var(--palette-purple-6)",
      };
      break;
    case "block":
      icon = {
        lib: "fa",
        icon: "bookmark",
        color: "var(--palette-cyan-6)",
      };
      break;
    default: {
      const doc = commandDocList?.find((item) => item.name === nodeData.name);
      switch (doc?.category) {
        case "query":
          icon = {
            lib: "antd",
            icon: "aim",
            color: "var(--palette-blue-6)",
          };
          break;
        case "action":
          icon = {
            lib: "fa",
            icon: "computer-mouse",
            color: "var(--palette-red-6)",
          };
          break;
        case "assertion":
          icon = {
            lib: "fa",
            icon: "spell-check",
            color: "var(--palette-green-6)",
          };
          break;
        default:
          icon = {
            lib: "fa",
            icon: "wrench",
            color: "var(--palette-yellow-6)",
          };
      }

      if (doc?.icon) {
        icon = {
          color: icon.color,
          ...doc.icon,
        };
      }
    }
  }

  return icon;
}

function getDisplayLabel(nodeItem: NodeGraphData): string {
  if (nodeItem.type === "suite") {
    return nodeItem.name;
  }

  if (nodeItem.label) {
    return `${nodeItem.name}: ${nodeItem.label}`;
  }

  const literalParams = getLiteralParams(nodeItem.params);
  return literalParams.length === 0
    ? nodeItem.name
    : `${nodeItem.name}: ${literalParams.join(", ")}`;
}

function getLiteralParams(params: unknown[]): unknown[] {
  const literalParams: unknown[] = [];
  if (Array.isArray(params)) {
    for (const param of params) {
      if (
        literalParams.length < 3 &&
        ["string", "boolean", "number"].includes(typeof param)
      ) {
        literalParams.push(param);
      } else {
        break;
      }
    }
  }
  return literalParams;
}

export function getTreeData(
  GraphData: GraphData,
  commandDocList: CommandDoc[]
): TestTreeData {
  const {
    topic_vertices: [rootData],
    vertices,
    edges,
  } = GraphData;

  const getChildVertices = (children: TestTreeData[]) => {
    return vertices.filter((v) =>
      children.find((c) => c.data.instanceId === v.instanceId)
    );
  };

  const getChildren = (node: NodeGraphData): TestTreeData[] => {
    const relations = edges.filter((item) => item.in === node.instanceId);

    const nodes = relations
      .map((relation) => vertices.find((v) => relation.out === v.instanceId))
      .filter(Boolean) as NodeGraphData[];

    return sortBy(nodes, "sort").map((nodeData) => {
      const isChainChild =
        node.type === "command" && nodeData.type === "command";

      const children = getChildren(nodeData);
      const displayLabel = getDisplayLabel(nodeData);
      return {
        name: displayLabel,
        key: nodeData.instanceId,
        icon: getIcon(nodeData, commandDocList),
        data: {
          ...nodeData,
          isChainChild,
          parent: node,
          displayLabel,
          children: getChildVertices(children),
        },
        children,
      };
    }) as TestTreeData[];
  };

  const children = getChildren(rootData);
  const displayLabel = getDisplayLabel(rootData);
  return {
    name: displayLabel,
    key: rootData.instanceId,
    icon: getIcon(rootData, commandDocList),
    data: {
      ...rootData,
      displayLabel,
      children: getChildVertices(children),
    },
    children,
  };
}

customProcessors.define("uiTest.getTreeData", getTreeData);
