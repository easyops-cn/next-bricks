import React from "react";
import { NodeData } from ".";
import type { SimpleActionType } from "@next-bricks/basic/mini-actions";

export interface ContextOfDirectoryTree {
  expandedKeysSet: Set<string>;
  selectedKeysSet: Set<string>;
  onExpand: (data: { keys: string[]; node: NodeData }) => void;
  onSelect: (data: { keys: string[]; node: NodeData }) => void;
  onSuffixActionsClick: (data: NodeData, action: SimpleActionType) => void;
}

export const DirectoryTreeContext = React.createContext<ContextOfDirectoryTree>(
  {
    expandedKeysSet: new Set(),
    selectedKeysSet: new Set(),
    onExpand: () => {},
    onSelect: () => {},
    onSuffixActionsClick: () => {},
  }
);

export const useDirectoryTreeContext = (): ContextOfDirectoryTree =>
  React.useContext(DirectoryTreeContext);
