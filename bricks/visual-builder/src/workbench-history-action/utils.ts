import { NS, K } from "./i18n.js";
import { i18n } from "@next-core/i18n";
import { NextBuilderModels } from "@next-api-sdk/next-builder-sdk";

const actionI18nKeyMap: Record<string, string> = {
  add: `${NS}:${K.ADD}`,
  edit: `${NS}:${K.EDIT}`,
  delete: `${NS}:${K.DELETE}`,
  batch_delete: `${NS}:${K.DELETE}`,
  import: `${NS}:${K.IMPORT}`,
  clone: `${NS}:${K.CLONE}`,
  append_relation: `${NS}:${K.APPEND_RELATION}`,
  update_relation: `${NS}:${K.UPDATE_RELATION}`,
  remove_relation: `${NS}:${K.REMOVE_RELATION}`,
  rollback: `${NS}:${K.ROLLBACK}`,
  rollback_all: `${NS}:${K.ROLLBACK_ALL}`,
};

const fullActionI18nKeyMap: Record<string, string> = {
  add: `${NS}:${K.ADD_FULL}`,
  edit: `${NS}:${K.EDIT_FULL}`,
  delete: `${NS}:${K.DELETE_FULL}`,
  batch_delete: `${NS}:${K.DELETE_FULL}`,
  import: `${NS}:${K.IMPORT_FULL}`,
  clone: `${NS}:${K.CLONE_FULL}`,
  append_relation: `${NS}:${K.APPEND_RELATION_FULL}`,
  update_relation: `${NS}:${K.UPDATE_RELATION_FULL}`,
  remove_relation: `${NS}:${K.REMOVE_RELATION_FULL}`,
  rollback: `${NS}:${K.ROLLBACK_FULL}`,
  rollback_all: `${NS}:${K.ROLLBACK_ALL_FULL}`,
};

const categoryI18nKeyMap: Record<string, string> = {
  project: `${NS}:${K.PROJECT}`,
  userGroup: `${NS}:${K.USER}`,
  permission: `${NS}:${K.PERMISSION}`,
  brick: `${NS}:${K.BRICK}`,
  route: `${NS}:${K.ROUTE}`,
  template: `${NS}:${K.TEMPLATE}`,
  snippet: `${NS}:${K.SNIPPET}`,
  i18n: `${NS}:${K.I18N}`,
  image: `${NS}:${K.IMAGE}`,
  function: `${NS}:${K.FUNCTION}`,
  menu: `${NS}:${K.MENU}`,
  menuItem: `${NS}:${K.MENU_ITEM}`,
  workflow: `${NS}:${K.WORKFLOW}`,
};

const modelI18nKeyMap: Record<string, string> = {
  PROJECT_MICRO_APP: `${NS}:${K.PROJECT}`,
  "MICRO_APP_USER_GROUP@EASYOPS": `${NS}:${K.USER}`,
  MICRO_APP_RESOURCE_PERMISSION: `${NS}:${K.PERMISSION}`,
  STORYBOARD_BRICK: `${NS}:${K.BRICK}`,
  STORYBOARD_ROUTE: `${NS}:${K.ROUTE}`,
  STORYBOARD_TEMPLATE: `${NS}:${K.TEMPLATE}`,
  STORYBOARD_SNIPPET: `${NS}:${K.SNIPPET}`,
  STORYBOARD_I18N: `${NS}:${K.I18N}`,
  MICRO_APP_RESOURCE_IMAGE: `${NS}:${K.IMAGE}`,
  STORYBOARD_FUNCTION: `${NS}:${K.FUNCTION}`,
  MICRO_APP_RESOURCE_MENU: `${NS}:${K.MENU}`,
  MICRO_APP_RESOURCE_MENU_ITEM: `${NS}:${K.MENU_ITEM}`,
  "WORKFLOW_DEF@EASYOPS": `${NS}:${K.WORKFLOW}`,
};

export function translateHistory(
  history: Partial<NextBuilderModels.ModelWorkspaceChangeHistory>
): Record<string, string> {
  const historyAction =
    history.action === "rollback" && !history.rollBackIdInfo
      ? "rollback_all"
      : history.action;

  const category = i18n.t(
    categoryI18nKeyMap[history.category] ?? history.category
  );
  const action = i18n.t(actionI18nKeyMap[historyAction] ?? historyAction);
  const leftObjectId = i18n.t(
    modelI18nKeyMap[history.abstract?.leftObjectId] ??
      history.abstract?.leftObjectId
  );
  const rightObjectId = i18n.t(
    modelI18nKeyMap[history.abstract?.rightObjectId] ??
      history.abstract?.rightObjectId
  );
  const nodes = translateNodes(
    history.abstract?.nodes,
    history.abstract?.nodesCount
  );
  const leftNodes = translateNodes(
    history.abstract?.leftNodes,
    history.abstract?.leftNodesCount
  );
  const rightNodes = translateNodes(
    history.abstract?.rightNodes,
    history.abstract?.rightNodesCount
  );
  const rollbackAbstract =
    historyAction === "rollback"
      ? translateHistory(history.rollBackIdInfo).abstract
      : null;

  const abstract = i18n.t(
    fullActionI18nKeyMap[historyAction] ?? historyAction,
    {
      category,
      nodes,
      leftNodes,
      rightNodes,
      nodeChanges: history.abstract?.nodeChanges?.join(", "),
      relationChanges: history.abstract?.relationChanges?.join(", "),
      leftObjectId,
      rightObjectId,
      rollbackAbstract,
    }
  );

  return {
    category,
    action,
    leftObjectId,
    rightObjectId,
    nodes,
    leftNodes,
    rightNodes,
    abstract,
    rollbackAbstract,
  };
}

function translateNodes(nodes: string[] = [], total: number, separator = ", ") {
  return i18n.t(`${NS}:${K.NODE}`, {
    nodes: nodes.join(separator),
    context: total > nodes.length ? "ellipsis" : undefined,
    count: total,
  });
}
