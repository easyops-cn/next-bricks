import React from "react";
import type { NodeData, SuffixBrickConf } from ".";

export interface ContextOfDirectoryTree {
  expandedKeysSet: Set<string>;
  selectedKeysSet: Set<string>;
  internalNodeSelectable?: boolean;
  onExpand: (data: { keys: string[]; node: NodeData }) => void;
  onSelect: (data: { keys: string[]; node: NodeData }) => void;
  suffixBrick?: SuffixBrickConf;
}

export const DirectoryTreeContext = React.createContext<ContextOfDirectoryTree>(
  {
    expandedKeysSet: new Set(),
    selectedKeysSet: new Set(),
    onExpand: () => {},
    onSelect: () => {},
  }
);

export const useDirectoryTreeContext = (): ContextOfDirectoryTree =>
  React.useContext(DirectoryTreeContext);
