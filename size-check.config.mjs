/** @type {import("@next-core/brick-container").DevConfig} */
export default {
  sizeCheckFilter(brick, pkgId) {
    return (
      // This brick is an alias of a deprecated brick.
      // Ignore it otherwise it will cause custom element conflict.
      ((pkgId && pkgId !== "bricks/basic") ||
        brick !== "basic.app-bar-wrapper") &&
      // This brick requires an internal dependency.
      brick !== "data-view.app-wall"
    );
  },
}
