/** @type {import("@next-core/brick-container").DevConfig} */
export default {
  brickFolders: [
    "ci-bricks/bricks"
  ],
  sizeCheckFilter(brick, pkgId) {
    return (
      // This brick is an alias of a deprecated brick.
      // Ignore it otherwise it will cause custom element conflict.
      ((pkgId && pkgId !== "bricks/basic") ||
        !["basic.app-bar-wrapper", "eo-app-bar-wrapper", "eo-frame-breadcrumb", "eo-sidebar", "eo-sidebar-menu", "eo-sidebar-menu-group", "eo-sidebar-menu-item", "eo-sidebar-menu-submenu", "eo-sidebar-sub-menu"].includes(brick)) &&
      // This brick requires an internal dependency.
      brick !== "data-view.app-wall"
    );
  },
}
