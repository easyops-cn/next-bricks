import React from "react";
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
import { TreeItem } from "./";

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
  data: TreeItem;
  index: number;
  depth: number;
}

function TreeLeaf(props: TreeLeafProps) {
  const { data, index, depth } = props;
  const { selectedKeysSet, onSelect, suffixBrick } = useDirectoryTreeContext();

  const nodeData = { data, index, depth };

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
  data: TreeItem;
  index: number;
  depth: number;
}

function TreeInternalNode(props: TreeInternalNodeProps) {
  const { data, index, depth } = props;
  const { expandedKeysSet, onExpand, suffixBrick } = useDirectoryTreeContext();

  const nodeData = { data, index, depth };

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
      {data.children?.map((v, index) => {
        return (
          <TreeNode key={v.key} data={v} index={index} depth={depth + 1} />
        );
      })}
    </WrappedTreeInternalNode>
  );
}

interface TreeNodeProps {
  data: TreeItem;
  index: number;
  depth: number;
}

function TreeNode(props: TreeNodeProps) {
  const { data, index, depth } = props;
  const isLeaf = !Array.isArray(data.children);

  return isLeaf ? (
    <TreeLeaf data={data} index={index} depth={depth} />
  ) : (
    <TreeInternalNode data={data} index={index} depth={depth} />
  );
}

interface TreeProps {
  data: TreeItem[];
}

export function Tree(props: TreeProps) {
  const { data } = props;

  return data?.map((v, i) => {
    return <TreeNode key={v.key} data={v} index={i} depth={0} />;
  });
}
