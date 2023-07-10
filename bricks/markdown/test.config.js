// @ts-check
/** @type {import("@next-core/test-next").TestNextConfig} */
export default {
  moduleNameMapper: {
    "theme-nord":
      "<rootDir>/../../node_modules/@milkdown/theme-nord/lib/index.es.js",
    "prose/model":
      "<rootDir>/../../node_modules/@milkdown/prose/lib/model.d.ts",
    "prose/state": "<rootDir>/../../node_modules/@milkdown/prose/lib/state.js",
    "prose/tables":
      "<rootDir>/../../node_modules/@milkdown/prose/lib/tables.js",
    "prose/view": "<rootDir>/../../node_modules/@milkdown/prose/lib/view.js",
  },
};
