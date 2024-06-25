import { ContextConf } from "@next-core/types";
import { createProviderClass } from "@next-core/utils/general";
import { MenuIcon } from "@next-shared/general/types";
import { getDataDependency } from "./get-data-dependency";
import { cloneDeep } from "lodash";

interface DataItem extends ContextConf {
  $key?: string;
  path?: string;
}

interface NodeItem {
  name: string;
  key: string;
  path?: string;
  icon?: MenuIcon;
  data?: DataItem;
  unreachable?: boolean;
  children?: NodeItem[];
}

interface DepsItem {
  deps: string[];
  node: NodeItem;
}

interface DepsOptions {
  nodeList?: NodeItem[];
  dependencyList: DepsItem[];
  parents?: NodeItem[];
  result?: NodeItem[];
}

function processNodeList(nodeList: NodeItem[], options: DepsOptions) {
  nodeList.forEach((node) => {
    processNodeItem(node, { ...options, nodeList });
  });
}

function processNodeItem(nodeItem: NodeItem, options: DepsOptions) {
  const { dependencyList, nodeList, parents, result } = options;

  const data = cloneDeep(nodeItem);
  result.push(data);

  const find = dependencyList.find((dep) => dep.node.key === data.key);

  if (find.deps?.length && !parents.some((item) => item.key === data.key)) {
    const children = (data.children = []) as NodeItem[];
    processDataDeps(find, {
      dependencyList,
      nodeList,
      parents: [...parents, data],
      result: children,
    });
  }
}

function processDataDeps(depsData: DepsItem, options: DepsOptions) {
  const collects = [] as NodeItem[];

  depsData.deps.forEach((name) => {
    // 有可能存在同名的两个数据，一起展示
    const matches = options.nodeList.filter((item) => item.name === name);
    collects.push(...matches);
  });

  processNodeList(collects, options);
}

export function getDependencyTree(
  nodeDataList: NodeItem[],
  options: {
    dataType: string;
  }
): NodeItem[] {
  const nodeList = nodeDataList;
  const dependencyMap = getDataDependency(
    nodeList.map((item) => item.data),
    options.dataType
  );

  const dependencyList = [] as DepsItem[];
  for (const [curData, value] of dependencyMap) {
    dependencyList.push({
      deps: Array.from(value.usedProperties),
      node: nodeList.find((node) => node.data === curData),
    });
  }

  const result = [] as NodeItem[];

  processNodeList(nodeList, {
    result,
    dependencyList,
    parents: [],
  });

  return result;
}

customElements.define(
  "visual-builder.get-dependency-tree",
  createProviderClass(getDependencyTree)
);
