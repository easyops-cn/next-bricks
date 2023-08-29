import { customProcessors } from "@next-core/runtime";
import { CommandDoc, CommandIcon, NodeType } from "../interface.js";

interface GraphEdge {
  in: string;
  out: string;
  out_name: string;
}

interface GraphNode {
  name: string;
  label?: string;
  instanceId: string;
  params?: any;
  type: NodeType;
  isChainChild?: boolean;
  parent?: GraphNode;
}

export interface GraphData {
  edges: GraphEdge[];
  topic_vertices: GraphNode[];
  vertices: GraphNode[];
}

interface TreeData {
  key: string;
  name: string;
  icon: CommandIcon;
  data: GraphNode;
  children?: TreeData[];
  labelColor?: string;
}

function getIcon(
  nodeData: GraphNode,
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

function getDisplayLabel(nodeItem: GraphNode): string {
  if (nodeItem.name === "suite") {
    return nodeItem.name;
  }

  return nodeItem.label ? `${nodeItem.name}: ${nodeItem.label}` : nodeItem.name;
}

export function getTreeData(
  GraphData: GraphData,
  commandDocList: CommandDoc[]
): TreeData {
  const {
    topic_vertices: [rootData],
    vertices,
    edges,
  } = GraphData;

  const getChildren = (node: GraphNode): TreeData[] => {
    const relations = edges.filter((item) => item.in === node.instanceId);

    const nodes = relations
      .map((relation) => vertices.find((v) => relation.out === v.instanceId))
      .filter(Boolean) as GraphNode[];

    return nodes.map((nodeData) => {
      const isChainChild =
        node.type === "command" && nodeData.type === "command";
      return {
        name: getDisplayLabel(nodeData),
        key: nodeData.instanceId,
        icon: getIcon(nodeData, commandDocList),
        data: { ...nodeData, isChainChild, parent: node },
        children: getChildren(nodeData),
      };
    }) as TreeData[];
  };

  return {
    name: getDisplayLabel(rootData),
    key: rootData.instanceId,
    icon: getIcon(rootData, commandDocList),
    data: rootData,
    children: getChildren(rootData),
  };
}

customProcessors.define("uiTest.getTreeData", getTreeData);
