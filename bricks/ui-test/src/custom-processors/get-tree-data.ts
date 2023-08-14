// istanbul ignore file
import { customProcessors } from "@next-core/runtime";
import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { NodeItem, NodeType } from "../interface.js";
import { isEmpty } from "lodash";

interface GraphEdge {
  in: string;
  out: string;
  relation_id: string;
}

interface GraphNode {
  name: string;
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
  isContainer?: boolean;
}

const setupGroup = ["before", "beforeEach", "after", "afterEach"];

const caseGroup = ["describe", "case"];

const collapseGroups = [...setupGroup, ...caseGroup];

function getIcon(type: string): GeneralIconProps {
  let icon;
  let color;

  if (collapseGroups.includes(type)) {
    icon = "down";
    color = "var(--palette-gray-6)";
  }

  switch (type) {
    case "suite":
      icon = "file";
      color = "var(--palette-purple-6)";
      break;
    case "code":
      icon = "code";
      color = "var(--palette-cyan-6)";
      break;
    case "preset":
      icon = "build";
      color = "var(--palette-green-6)";
      break;
  }

  return {
    lib: "antd",
    theme: "outlined",
    icon,
    color,
  } as GeneralIconProps;
}

function getRestParams(node: GraphNode): Partial<TreeData> {
  if (collapseGroups.includes(node.type)) {
    return {
      name: node.type,
      labelColor: "var(--palette-gray-6)",
      isContainer: true,
    };
  }

  if (["code", "preset"].includes(node.type)) {
    return {
      name: node.type,
    };
  }

  return {};
}

export function getTreeData(GraphData: GraphData): TreeData {
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

    return nodes.map((nodeData) => ({
      name: nodeData.name,
      key: nodeData.instanceId,
      icon: getIcon(nodeData?.type),
      data: nodeData,
      children: getChildren(nodeData),
      ...getRestParams(nodeData),
    })) as TreeData[];
  };

  return {
    name: rootData.name,
    key: rootData.instanceId,
    icon: getIcon(rootData?.type),
    data: rootData,
    children: getChildren(rootData),
  };
}

customProcessors.define("uiTest.getTreeData", getTreeData);
