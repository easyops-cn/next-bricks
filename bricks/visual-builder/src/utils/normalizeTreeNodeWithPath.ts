import _ from "lodash";
import { WorkbenchNodeData } from "../interfaces.js";

export function getNodeTreeByPath(
  nodes: WorkbenchNodeData[],
  nodeKey: string
): Array<WorkbenchNodeData> {
  const createNodeByPath = (
    pathList: string[],
    nodes: Array<WorkbenchNodeData>,
    node: WorkbenchNodeData,
    index?: number
  ): void => {
    const path = pathList.shift();
    if (path) {
      pathList.length > 0
        ? pathList.splice(0, 1, `${path}/${pathList[0]}`)
        : pathList;
      const folder = nodes.find(
        (node) => node && node.key === path && node.isContainer
      );
      if (folder) {
        nodes[index] = null;
        createNodeByPath(pathList, folder.children, node);
      } else {
        const newPathList = path.split("/");
        const newNode = {
          name: newPathList.pop(),
          key: path,
          parentPath: newPathList ? newPathList.join("/") : newPathList,
          originKey: node.key,
          data: {
            [nodeKey]: path,
            isContainer: true,
          },
          children: [],
          icon: {
            icon: "folder",
            lib: "antd",
            theme: "filled",
            color: "orange",
          },
          isContainer: true,
        } as WorkbenchNodeData;
        if (typeof index === "number") {
          nodes[index] = newNode;
        } else {
          nodes.push(newNode);
        }
        createNodeByPath(pathList, newNode.children, node);
      }
    } else {
      nodes.push(node);
    }
  };

  nodes.forEach((node, index) => {
    if (node.path) {
      const pathList = node.path.split("/").filter(Boolean);
      createNodeByPath(pathList, nodes, node, index);
    }
  });
  return nodes.filter(Boolean);
}

export function getNodesByPathTree(
  nodes: Array<WorkbenchNodeData>
): Array<WorkbenchNodeData> {
  const result: Array<WorkbenchNodeData> = [];
  const walk = (nodes: Array<WorkbenchNodeData>): void => {
    nodes.forEach((item) => {
      if (item.isContainer) {
        walk(item.children);
      } else {
        result.push(_.omit(item, ["path", "icon"]) as WorkbenchNodeData);
      }
    });
  };
  walk(nodes);
  return result;
}
