import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "m3skph",
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require("./cypress/plugins/index.js")(on, config);
    },
    specPattern: "cypress/size-check.spec.js",
  },
});
