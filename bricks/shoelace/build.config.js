// @ts-check
import path from "node:path";
import { fileURLToPath } from "node:url";
import CopyPlugin from "copy-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const shoelaceMainPath = await import.meta.resolve("@shoelace-style/shoelace");

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(
            shoelaceMainPath.replace(/^file:\/\//, ""),
            "../assets"
          ),
          to: "assets",
        },
      ],
    }),
  ],
  moduleRules: [
    {
      test: /\.js$/,
      include: ["@lit", "lit-element", "lit-html"].map((p) =>
        path.resolve(__dirname, `../../node_modules/${p}`)
      ),
      loader: "babel-loader",
      options: {
        rootMode: "upward",
      },
    },
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/](?:@shoelace-style[\\/]shoelace|@floating-ui|@lit(?:-labs)?|lit(?:-element|-html)?|css-loader|style-loader)[\\/]/,
          priority: -5,
          reuseExistingChunk: true,
          name: "vendors",
        },
        react: {
          test: /[\\/]node_modules[\\/](?:@next-core[\\/](?:react-(?:element|runtime))|(?:react(?:-dom)?|scheduler))[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: "react",
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
