// @ts-check
import path from "node:path";
import CopyPlugin from "copy-webpack-plugin";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const shoelaceMainPath = await import.meta.resolve("@shoelace-style/shoelace");

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  moduleRules: [
    {
      test: /[/\\]node_modules[/\\]@shoelace-style[/\\]shoelace[/\\]/,
      sideEffects: true,
    },
  ],
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
};
