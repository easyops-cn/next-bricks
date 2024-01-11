import { wrapBrick } from "@next-core/react-element";
import type {
  EoDirectoryTreeLeaf,
  EoDirectoryTreeLeafEvents,
  EoDirectoryTreeLeafEventsMap,
  EoDirectoryTreeLeafProps,
} from "@next-bricks/nav/directory-tree/directory-tree-leaf";
import type {
  EoDirectoryTreeInternalNode,
  EoDirectoryTreeInternalNodeEvents,
  EoDirectoryTreeInternalNodeEventsMap,
  EoDirectoryTreeInternalNodeProps,
} from "@next-bricks/nav/directory-tree/directory-tree-internal-node";
import type { Tag, TagProps } from "@next-bricks/basic/tag";
import type {
  EoMiniActions,
  EoMiniActionsProps,
  EoMiniActionsEvents,
  EoMiniActionsEventsMapping,
} from "@next-bricks/basic/mini-actions";
import type {
  GeneralSearch,
  SearchProps,
  SearchEvents,
  SearchEventsMap,
} from "@next-bricks/form/search";

export const WrappedTreeLeaf = wrapBrick<
  EoDirectoryTreeLeaf,
  EoDirectoryTreeLeafProps,
  EoDirectoryTreeLeafEvents,
  EoDirectoryTreeLeafEventsMap
>("eo-directory-tree-leaf", {
  onSelect: "select",
});
export const WrappedTreeInternalNode = wrapBrick<
  EoDirectoryTreeInternalNode,
  EoDirectoryTreeInternalNodeProps,
  EoDirectoryTreeInternalNodeEvents,
  EoDirectoryTreeInternalNodeEventsMap
>("eo-directory-tree-internal-node", {
  onExpand: "expand",
  onSelect: "select",
});
export const WrappedTag = wrapBrick<Tag, TagProps>("eo-tag");
export const WrappedMiniActions = wrapBrick<
  EoMiniActions,
  EoMiniActionsProps,
  EoMiniActionsEvents,
  EoMiniActionsEventsMapping
>("eo-mini-actions", {
  onActionClick: "action.click",
});
export const WrappedSearch = wrapBrick<
  GeneralSearch,
  SearchProps,
  SearchEvents,
  SearchEventsMap
>("eo-search", {
  onChange: "change",
  onSearch: "search",
});
