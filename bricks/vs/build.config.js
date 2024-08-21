// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import webpack from "webpack";
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";
import _ from "lodash";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const originalFilePath = path.resolve(
  require.resolve("monaco-editor/package.json"),
  "../esm/vs/editor/common/services/findSectionHeaders.js"
);

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  moduleRules: [
    {
      // This file contains static initialization blocks which are not supported until Chrome 94
      test: /[\\/]node_modules[\\/]monaco-editor[\\/]esm[\\/]vs[\\/]language[\\/]typescript[\\/]tsMode\.js$/,
      loader: "babel-loader",
      options: {
        rootMode: "upward",
      },
    },
  ],
  plugins: [
    new MonacoWebpackPlugin({
      languages: [
        "javascript",
        "typescript",
        "json",
        "shell",
        "powershell",
        "yaml",
        "markdown",
        "python",
        "java",
        "xml",
        "mysql",
        "go",
      ],
      features: [
        // "!accessibilityHelp",
        "!codelens",
        "!colorPicker",
        "!documentSymbols",
        "!fontZoom",
        "!iPadShowKeyboard",
        "!inspectTokens",
      ],
      filename: `workers/[name].${
        process.env.NODE_ENV === "development" ? "bundle" : "[contenthash:8]"
      }.worker.js`,
    }),
    new webpack.NormalModuleReplacementPlugin(
      new RegExp(`^${_.escapeRegExp(originalFilePath)}$`),
      // Refactor without 'd' flag of RegExp
      path.resolve(__dirname, "src/replaces/findSectionHeaders.js")
    ),
  ],
};
