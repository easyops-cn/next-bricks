import eslintConfigNext from "@next-core/eslint-config-next";
import nodeConfig from "@next-core/eslint-config-next/node.js";
import globals from "globals";

export default [
  {
    ignores: ["**/node_modules", "**/dist"],
  },
  ...eslintConfigNext,
  {
    files: ["cypress/**/*.js"],
    ...nodeConfig,
    languageOptions: {
      globals: {
        ...Object.fromEntries(
          Object.entries(globals.jest).map(([key]) => [key, "off"])
        ),
        ...globals.mocha,
        ...globals.node,
        cy: false,
        Cypress: false,
      },
    },
  },
];
