import { omit } from "lodash";
import { InstanceApi_createInstance } from "@next-api-sdk/cmdb-sdk";
import { NodeItem } from "../../interface.js";

interface NodeInstance extends NodeItem {
  instanceId: string;
}

interface NodeItemToSave extends NodeItem {
  parent: string;
  sort: number;
}

export async function createNodes(
  nodes: NodeItem[],
  parent: string,
  initialSort = 0
): Promise<void> {
  let sort = initialSort;
  for (const node of nodes) {
    await createNode({
      ...node,
      parent,
      sort,
    });
    sort++;
  }
}

async function createNode(node: NodeItemToSave): Promise<void> {
  const instance = (await InstanceApi_createInstance(
    "UI_TEST_NODE@EASYOPS",
    omit(node, ["children"])
  )) as NodeInstance;

  if (node.children?.length) {
    await createNodes(node.children, instance.instanceId);
  }
}
