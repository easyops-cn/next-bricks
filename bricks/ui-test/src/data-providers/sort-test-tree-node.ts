import { createProviderClass } from "@next-core/utils/general";
import { TestTreeData, TreeNodeItemData } from "../interface.js";
import { isEmpty } from "lodash";

type Action = "move-up" | "move-down";

export function findNodeData(
  treeData: TestTreeData[],
  key: string
): TestTreeData | undefined {
  let matchNode;

  const findNode = (nodeItem: TestTreeData, key: string): void => {
    if (nodeItem.key === key) {
      matchNode = nodeItem;
      return;
    }

    if (!isEmpty(nodeItem.children)) {
      nodeItem.children?.forEach((item) => {
        return findNode(item, key);
      });
    }
  };

  treeData.forEach((item) => findNode(item, key));

  return matchNode;
}

function moveChildrenNode(
  nodes: TestTreeData[],
  index: number
): TestTreeData[] {
  return [
    ...nodes.slice(0, index),
    nodes[index + 1],
    nodes[index],
    ...nodes.slice(index + 2),
  ].map((item, index) => {
    const prevSort = item.data.sort;

    return {
      ...item,
      data: {
        ...item.data,
        sort: index,
        isSortChange: index !== prevSort,
      },
    };
  });
}

interface SortData {
  treeData: TestTreeData[];
  sortedChangeChildren: TestTreeData[];
}

export function sortTestTreeNode(
  treeData: TestTreeData[],
  itemData: TreeNodeItemData,
  action: Action
): SortData {
  const parentKey = itemData.parent?.instanceId;

  const parentData = findNodeData(treeData, parentKey as string);

  const children = parentData?.children || [];

  const findIndex = children?.findIndex(
    (item) => item.key === itemData.instanceId
  );

  if (findIndex !== -1) {
    let cursorIndex: number;

    const isValidMoveUP = action === "move-up" && findIndex !== 0;

    const isValidMoveDown =
      action === "move-down" && findIndex !== children.length - 1;

    // istanbul ignore else
    if (isValidMoveUP || isValidMoveDown) {
      if (isValidMoveUP) {
        cursorIndex = findIndex - 1;
      } else {
        cursorIndex = findIndex;
      }

      const sortedChildren = moveChildrenNode(children, cursorIndex);
      parentData!.children = sortedChildren;

      return {
        treeData,
        sortedChangeChildren: sortedChildren.filter(
          (item) => item.data.isSortChange
        ),
      };
    }
  }

  return {
    treeData,
    sortedChangeChildren: [],
  };
}

customElements.define(
  "ui-test.sort-test-tree-node",
  createProviderClass(sortTestTreeNode)
);
