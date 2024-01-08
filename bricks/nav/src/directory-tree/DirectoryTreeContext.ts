import { UseBrickConf } from "@next-core/types";
import React from "react";
import { NodeData } from ".";

export interface ContextOfDirectoryTree {
  expandedKeysSet: Set<string>;
  selectedKeysSet: Set<string>;
  onExpand: (data: { keys: string[]; node: NodeData }) => void;
  onSelect: (data: { keys: string[]; node: NodeData }) => void;
  suffixBrick?: { useBrick: UseBrickConf };
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
