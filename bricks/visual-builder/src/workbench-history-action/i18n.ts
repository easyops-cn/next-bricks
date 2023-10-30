export enum K {
  LOAD_MORE = "LOAD_MORE",
  LOADING = "LOADING",
  NO_DATA = "NO_DATA",
  NODE = "NODE",
  // action
  ADD = "ADD",
  EDIT = "EDIT",
  DELETE = "DELETE",
  IMPORT = "IMPORT",
  CLONE = "CLONE",
  APPEND_RELATION = "APPEND_RELATION",
  UPDATE_RELATION = "UPDATE_RELATION",
  REMOVE_RELATION = "REMOVE_RELATION",
  ROLLBACK = "ROLLBACK",
  ADD_FULL = "ADD_FULL",
  EDIT_FULL = "EDIT_FULL",
  DELETE_FULL = "DELETE_FULL",
  IMPORT_FULL = "IMPORT_FULL",
  CLONE_FULL = "CLONE_FULL",
  APPEND_RELATION_FULL = "APPEND_RELATION_FULL",
  UPDATE_RELATION_FULL = "UPDATE_RELATION_FULL",
  REMOVE_RELATION_FULL = "REMOVE_RELATION_FULL",
  ROLLBACK_FULL = "ROLLBACK_FULL",
  // category
  PROJECT = "PROJECT",
  USER = "USER",
  PERMISSION = "PERMISSION",
  BRICK = "BRICK",
  ROUTE = "ROUTE",
  TEMPLATE = "TEMPLATE",
  SNIPPET = "SNIPPET",
  I18N = "I18N",
  IMAGE = "IMAGE",
  FUNCTION = "FUNCTION",
  MENU = "MENU",
  MENU_ITEM = "MENU_ITEM",
  WORKFLOW = "WORKFLOW",
}

const en: Locale = {
  LOAD_MORE: "Load more",
  LOADING: "Loading",
  NO_DATA: "No data",
  NODE: "{{ nodes }}",
  NODE_ellipsis: "{{ nodes }} etc., a total of {{ count }} items",
  // action
  ADD: "Add node",
  EDIT: "Edit node",
  DELETE: "Delete node",
  IMPORT: "Batch import node",
  CLONE: "Clone node",
  APPEND_RELATION: "Append Relation",
  UPDATE_RELATION: "Update Relation",
  REMOVE_RELATION: "Remove Relation",
  ROLLBACK: "Rollback",
  ADD_FULL: "Add {{ category }} ({{ nodes }})",
  EDIT_FULL: "Edit {{ nodeChanges }} of {{ category }} ({{ nodes }})",
  DELETE_FULL: "Delete {{ category }} ({{ nodes }})",
  IMPORT_FULL: "Batch Import {{ category }} ({{ nodes }})",
  CLONE_FULL: "Clone {{ category }} ({{ nodes }})",
  APPEND_RELATION_FULL:
    "Append the relation between {{ leftObjectId }} ({{ leftNodes }}) and {{ rightObjectId }} ({{ rightNodes }})",
  UPDATE_RELATION_FULL:
    "Update the relation between {{ leftObjectId }} ({{ leftNodes }}) and {{ rightObjectId }} ({{ rightNodes }})",
  REMOVE_RELATION_FULL:
    "Remove the relation between {{ leftObjectId }} ({{ leftNodes }}) and {{ rightObjectId }} ({{ rightNodes }})",
  ROLLBACK_FULL: "Rollback to [{{ rollbackAbstract }}]",
  // category
  PROJECT: "Project",
  USER: "User Group",
  PERMISSION: "Permission",
  BRICK: "Brick",
  ROUTE: "Route",
  TEMPLATE: "Template",
  SNIPPET: "Snippet",
  I18N: "I18N",
  IMAGE: "Image",
  FUNCTION: "Function",
  MENU: "Menu",
  MENU_ITEM: "Menu item",
  WORKFLOW: "Workflow",
};

const zh: Locale = {
  LOAD_MORE: "加载更多",
  LOADING: "加载中",
  NO_DATA: "没有数据",
  NODE: "{{ nodes }}",
  NODE_ellipsis: "{{ nodes }}等共{{ count }}项",
  // action
  ADD: "新增节点",
  EDIT: "编辑节点",
  DELETE: "删除节点",
  IMPORT: "批量导入节点",
  CLONE: "克隆节点",
  APPEND_RELATION: "添加关系",
  UPDATE_RELATION: "更新关系",
  REMOVE_RELATION: "移除关系",
  ROLLBACK: "回滚",
  ADD_FULL: "新增{{ category }}（{{ nodes }}）",
  EDIT_FULL: "编辑{{ category }}（{{ nodes }}）的 {{ nodeChanges }}",
  DELETE_FULL: "删除{{ category }}（{{ nodes }}）",
  IMPORT_FULL: "批量导入{{ category }}（{{ nodes }}）",
  CLONE_FULL: "克隆{{ category }}（{{ nodes }}）",
  APPEND_RELATION_FULL:
    "添加{{ leftObjectId }}（{{ leftNodes }}）和{{ rightObjectId }}（{{ rightNodes }}）的关系",
  UPDATE_RELATION_FULL:
    "更新{{ leftObjectId }}（{{ leftNodes }}）和{{ rightObjectId }}（{{ rightNodes }}）的关系",
  REMOVE_RELATION_FULL:
    "移除{{ leftObjectId }}（{{ leftNodes }}）和{{ rightObjectId }}（{{ rightNodes }}）的关系",
  ROLLBACK_FULL: "回滚到【{{ rollbackAbstract }}】",
  // category
  PROJECT: "项目",
  USER: "用户组",
  PERMISSION: "权限点",
  BRICK: "构件",
  ROUTE: "路由",
  TEMPLATE: "模版",
  SNIPPET: "片段",
  I18N: "国际化",
  IMAGE: "图片",
  FUNCTION: "函数",
  MENU: "菜单",
  MENU_ITEM: "菜单项",
  WORKFLOW: "工作流",
};

export const NS = "bricks/visual-builder/workbench-history-action";

export const locales = { en, zh };

type Locale = { [k in K]: string } & {
  [k in K as `${k}_plural`]?: string;
} & { NODE_ellipsis: string };
