import React, { useMemo } from "react";
import { useDirectoryTreeContext } from "./DirectoryTreeContext";
import { TreeData } from "./";
import {
  WrappedMiniActions,
  WrappedTag,
  WrappedTreeInternalNode,
  WrappedTreeLeaf,
} from "./wrapped-bricks";

interface SuffixActionsProps {
  treeData: TreeData;
}

function SuffixActions(props: SuffixActionsProps) {
  const { treeData } = props;
  const { data, index, depth } = treeData;
  const { onSuffixActionsClick } = useDirectoryTreeContext();

  const actions = useMemo(() => {
    return [
      {
        icon: {
          lib: "antd",
          icon: "plus-circle",
          theme: "outlined",
        },
        text: "新建接口",
        disabled: treeData.data.isPublic,
        hidden:
          treeData.data.key.split("-").length >= 3 &&
          treeData.data.type === "group",
        event: "create-api",
      },
      {
        icon: {
          lib: "antd",
          icon: "upload",
        },
        text: "导入接口",
        hidden:
          treeData.data.key.split("-").length >= 3 &&
          treeData.data.type === "group",
        disabled: treeData.data.isPublic,
        event: "import-api",
        isDropdown: true,
      },
      {
        icon: {
          lib: "antd",
          icon: "plus",
          theme: "outlined",
        },
        text: "新建子目录",
        disabled: treeData.data.isPublic,
        hidden:
          treeData.data.key.split("-").length >= 2 &&
          treeData.data.type === "group",
        isDropdown: true,
        event: "create-sub-directory",
      },
      {
        icon: {
          lib: "antd",
          icon: "edit",
          theme: "outlined",
        },
        disabled: treeData.data.isPublic,
        isDropdown: true,
        text: "重命名",
        event: "rename-directory",
      },
      {
        icon: {
          lib: "antd",
          icon: "delete",
          theme: "outlined",
        },
        text: "删除",
        disabled: treeData.data.isPublic,
        isDropdown: true,
        danger: true,
        event: "delete-directory",
      },
    ] as any;
  }, [treeData.data]);

  return (
    <WrappedMiniActions
      actions={actions}
      onActionClick={(e) => {
        onSuffixActionsClick({ data, index, depth }, e.detail);
      }}
    />
  );
}

interface SuffixTagProps {
  treeData: TreeData;
}

function SuffixTag(props: SuffixTagProps) {
  const { treeData } = props;

  return (
    <WrappedTag
      color={
        treeData.data.data?.method?.toLowerCase() === "delete" ? "red" : "green"
      }
    >
      {treeData.data.data?.method}
    </WrappedTag>
  );
}

interface SuffixComponentProps {
  treeData: TreeData;
}

function SuffixComponent(props: SuffixComponentProps) {
  const { treeData } = props;

  if (treeData.data.type === "item") {
    return <SuffixTag treeData={treeData} />;
  }

  if (
    treeData.data.type === "group" &&
    treeData.data.key.split("-").length < 3
  ) {
    return <SuffixActions treeData={treeData} />;
  }

  return null;
}

interface TreeLeafProps {
  treeData: TreeData;
}

function TreeLeaf(props: TreeLeafProps) {
  const { treeData } = props;
  const { data, index, depth } = treeData;
  const { selectedKeysSet, onSelect } = useDirectoryTreeContext();

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
      <div slot="suffix">
        <SuffixComponent treeData={treeData} />
      </div>
    </WrappedTreeLeaf>
  );
}

interface TreeInternalNodeProps {
  treeData: TreeData;
}

function TreeInternalNode(props: TreeInternalNodeProps) {
  const { treeData } = props;
  const { data, index, depth } = treeData;
  const { expandedKeysSet, onExpand } = useDirectoryTreeContext();

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
        {data.title} <span>({data.children?.length})</span>
      </span>
      <div slot="suffix">
        <SuffixComponent treeData={treeData} />
      </div>
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
