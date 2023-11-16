export const dirHandleStorageKey = "directory-handle-key";
export const fileHandleStorageKey = "file-handle-key";

export const blacklistBricksOfQueries = [
  "basic-bricks.easy-view",
  "basic-bricks.grid-layout",
  "basic-bricks.micro-view",
  "basic-bricks.flex-layout",
  "basic-bricks.list-container",
  "basic-bricks.advanced-list-container",
  "presentational-bricks.general-list",
  "presentational-bricks.dynamic-grid-container",
  "basic-bricks.multiple-columns-card",
  "eo-flex-layout",
  /^eo-.*-view/,
  /^eo-.*-layout/,
  /^base-layout.*/,
];
