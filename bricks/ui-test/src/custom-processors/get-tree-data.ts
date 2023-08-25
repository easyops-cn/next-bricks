import { customProcessors } from "@next-core/runtime";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { CommandDoc, NodeType } from "../interface.js";

interface GraphEdge {
  in: string;
  out: string;
  relation_id: string;
}

interface GraphNode {
  name: string;
  label?: string;
  instanceId: string;
  params?: any;
  type: NodeType;
}

export interface GraphData {
  edges: GraphEdge[];
  topic_vertices: GraphNode[];
  vertices: GraphNode[];
}

interface TreeData {
  key: string;
  name: string;
  icon: GeneralIconProps;
  data: Record<string, any>;
  children?: TreeData[];
  labelColor?: string;
  isChainChild?: boolean;
}

function getIcon(
  nodeData: GraphNode,
  commandDocList: CommandDoc[]
): GeneralIconProps {
  let icon;
  let color;

  const doc = commandDocList?.find((item) => item.name === nodeData.name);

  const commandIconMap = {
    query: {
      icon: "search",
      color: "var(--palette-blue-6)",
    },
    action: {
      icon: "tool",
      color: "var(--palette-red-6)",
    },
    assertion: {
      icon: "aim",
      color: "var(--palette-green-6)",
    },
    other: {
      icon: "control",
      color: "var(--palette-green-6)",
    },
  };

  switch (nodeData.type) {
    case "suite":
      icon = "file";
      color = "var(--palette-purple-6)";
      break;
    case "block":
      icon = "block";
      color = "var(--palette-cyan-6)";
      break;
    case "command": {
      const result = commandIconMap[doc?.category || "other"];
      icon = result.icon;
      color = result.color;
      break;
    }
  }

  return {
    lib: "antd",
    theme: "outlined",
    icon,
    color,
  } as GeneralIconProps;
}

function getDisplayLabel(nodeItem: GraphNode): string {
  if (nodeItem.name === "suite") {
    return nodeItem.name;
  }
  if (["describe", "it"].includes(nodeItem.name)) {
    return `${nodeItem.name}: ${nodeItem.label}`;
  }

  return nodeItem.name;
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

  const getChildren = (
    node: GraphNode,
    options: { parentType: NodeType }
  ): TreeData[] => {
    const { parentType } = options;
    const relations = edges.filter((item) => item.in === node.instanceId);

    const nodes = relations
      .map((relation) => vertices.find((v) => relation.out === v.instanceId))
      .filter(Boolean) as GraphNode[];

    return nodes.map((nodeData) => {
      const isChainChild =
        parentType === "command" && nodeData.type === "command";
      return {
        name: getDisplayLabel(nodeData),
        key: nodeData.instanceId,
        icon: getIcon(nodeData, commandDocList),
        data: { ...nodeData, isChainChild },
        children: getChildren(nodeData, { parentType: nodeData.type }),
      };
    }) as TreeData[];
  };

  return {
    name: getDisplayLabel(rootData),
    key: rootData.instanceId,
    icon: getIcon(rootData, commandDocList),
    data: rootData,
    children: getChildren(rootData, { parentType: rootData?.type }),
  };
}

customProcessors.define("uiTest.getTreeData", getTreeData);
