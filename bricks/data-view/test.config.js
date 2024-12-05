// @ts-check
/** @type {import("@next-core/test-next").TestNextConfig} */
export default {
  moduleNameMapper: {
    "\\.mp4$": `<rootDir>/../../jest/__mocks__/mp4-url.js`,
    "\\.webm$": `<rootDir>/../../jest/__mocks__/mp4-url.js`,
    "^d3-hierarchy$":
      "<rootDir>/../../node_modules/d3-hierarchy/dist/d3-hierarchy.min.js",
  },
  transformModulePatterns: ["three/examples/jsm/"],
};
