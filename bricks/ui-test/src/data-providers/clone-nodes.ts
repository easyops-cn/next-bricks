import { createProviderClass } from "@next-core/utils/general";
import { NodeGraphData, TreeNodeItemData, TestTreeData } from "../interface.js";
import { findNodeData } from "./sort-test-tree-node.js";
import { InstanceApi_createInstance } from "@next-api-sdk/cmdb-sdk";
import { isEmpty, pick } from "lodash";

const basicFields = ["name", "label", "sort", "type", "params"];

async function createChildrenNode(
  parentData: TreeNodeItemData,
  nodes: NodeGraphData[],
  treeData: TestTreeData[]
): Promise<void> {
  const responseNodes = (await Promise.all(
    nodes.map((node) =>
      InstanceApi_createInstance("UI_TEST_NODE@EASYOPS", {
        ...pick(node, basicFields),
        parent: parentData?.instanceId,
      })
    )
  )) as TreeNodeItemData[];

  let index = 0;
  for (const item of nodes) {
    const findNode = findNodeData(treeData, item.instanceId)?.data;

    if (!isEmpty(findNode?.children)) {
      await createChildrenNode(
        responseNodes[index],
        findNode!.children as NodeGraphData[],
        treeData
      );
    }
    index += 1;
  }
}

export async function cloneNodes(
  clonedData: TreeNodeItemData,
  parentData: TreeNodeItemData,
  treeData: TestTreeData[]
): Promise<void> {
  const instanceData = await InstanceApi_createInstance(
    "UI_TEST_NODE@EASYOPS",
    {
      ...pick(clonedData, basicFields),
      sort: parentData.children?.length
        ? (parentData.children[parentData.children.length - 1].sort ?? 0) + 1
        : 0,
      parent: parentData.instanceId,
    }
  );
  // istanbul ignore else
  if (!isEmpty(clonedData.children)) {
    await createChildrenNode(
      instanceData as TreeNodeItemData,
      clonedData.children as NodeGraphData[],
      treeData
    );
  }
}

customElements.define("ui-test.clone-nodes", createProviderClass(cloneNodes));
