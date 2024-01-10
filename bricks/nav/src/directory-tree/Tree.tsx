import React, { useMemo } from "react";
import { wrapBrick } from "@next-core/react-element";
import { ReactUseMultipleBricks } from "@next-core/react-runtime";
import {
  EoDirectoryTreeLeaf,
  EoDirectoryTreeLeafEvents,
  EoDirectoryTreeLeafEventsMap,
  EoDirectoryTreeLeafProps,
} from "./directory-tree-leaf";
import {
  EoDirectoryTreeInternalNode,
  EoDirectoryTreeInternalNodeEvents,
  EoDirectoryTreeInternalNodeEventsMap,
  EoDirectoryTreeInternalNodeProps,
} from "./directory-tree-internal-node";
import { useDirectoryTreeContext } from "./DirectoryTreeContext";
import { TreeData } from "./";

const WrappedTreeLeaf = wrapBrick<
  EoDirectoryTreeLeaf,
  EoDirectoryTreeLeafProps,
  EoDirectoryTreeLeafEvents,
  EoDirectoryTreeLeafEventsMap
>("eo-directory-tree-leaf", {
  onSelect: "select",
});
const WrappedTreeInternalNode = wrapBrick<
  EoDirectoryTreeInternalNode,
  EoDirectoryTreeInternalNodeProps,
  EoDirectoryTreeInternalNodeEvents,
  EoDirectoryTreeInternalNodeEventsMap
>("eo-directory-tree-internal-node", {
  onExpand: "expand",
});

interface TreeLeafProps {
  treeData: TreeData;
}

function TreeLeaf(props: TreeLeafProps) {
  const { treeData } = props;
  const { data, index, depth } = treeData;
  const { selectedKeysSet, onSelect, suffixBrick } = useDirectoryTreeContext();

  const nodeData = useMemo(
    () => ({ data, index, depth }),
    [data, index, depth]
  );

  return (
    <WrappedTreeLeaf
      depth={depth}
      selected={selectedKeysSet.has(data.key)}
      onSelect={() => {
        const keys = [data.key];
        onSelect({ keys, node: nodeData });
      }}
    >
      <span title={data.title}>{data.title}</span>
      {suffixBrick?.useBrick && (
        <div slot="suffix">
          <ReactUseMultipleBricks
            useBrick={suffixBrick.useBrick}
            data={nodeData}
          />
        </div>
      )}
    </WrappedTreeLeaf>
  );
}

interface TreeInternalNodeProps {
  treeData: TreeData;
}

function TreeInternalNode(props: TreeInternalNodeProps) {
  const { treeData } = props;
  const { data, index, depth } = treeData;
  const { expandedKeysSet, onExpand, suffixBrick } = useDirectoryTreeContext();

  const nodeData = useMemo(
    () => ({ data, index, depth }),
    [data, index, depth]
  );

  return (
    <WrappedTreeInternalNode
      depth={depth}
      expanded={expandedKeysSet.has(data.key)}
      onExpand={(e) => {
        if (e.detail) {
          expandedKeysSet.add(data.key);
        } else {
          expandedKeysSet.delete(data.key);
        }
        const keys = [...expandedKeysSet];
        onExpand({ keys, node: nodeData });
      }}
    >
      <span slot="label" title={data.title}>
        {data.title}
      </span>
      {suffixBrick?.useBrick && (
        <div slot="suffix">
          <ReactUseMultipleBricks
            useBrick={suffixBrick.useBrick}
            data={nodeData}
          />
        </div>
      )}
    </WrappedTreeInternalNode>
  );
}

interface TreeNodeProps {
  treeData: TreeData;
}

function TreeNode(props: TreeNodeProps) {
  const { treeData } = props;
  const isLeaf = !Array.isArray(treeData.children);

  return isLeaf ? (
    <TreeLeaf treeData={treeData} />
  ) : (
    <TreeInternalNode treeData={treeData} />
  );
}

interface TreeProps {
  treeData: TreeData[];
}

export function Tree(props: TreeProps) {
  const { treeData } = props;

  return treeData.map((v) => {
    return <TreeNode key={v.key} treeData={v} />;
  });
}
