// @ts-check
import MonacoWebpackPlugin from "monaco-editor-webpack-plugin";

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
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
        "!accessibilityHelp",
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
  ],
};
