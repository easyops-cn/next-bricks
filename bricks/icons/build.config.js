// @ts-check
import path from "node:path";
import { createRequire } from "node:module";
import CopyPlugin from "copy-webpack-plugin";

const require = createRequire(import.meta.url);
const easyopsIconsDir = path.resolve(
  require.resolve("@next-core/brick-icons/package.json"),
  "../src/icons"
);

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/fa-icon/generated/icons",
          to: "chunks/fa-icons",
          // Terser skip this file for minimization
          info: { minimized: true },
        },
        {
          from: "src/antd-icon/generated",
          to: "chunks/antd-icons",
          // Terser skip this file for minimization
          info: { minimized: true },
        },
        {
          context: easyopsIconsDir,
          from: "*/*.svg",
          to: "chunks/easyops-icons",
          // Terser skip this file for minimization
          info: { minimized: true },
        },
        {
          context: easyopsIconsDir,
          from: "*.svg",
          to: "chunks/easyops-icons/default",
          // Terser skip this file for minimization
          info: { minimized: true },
        },
        {
          from: "src/easyops-icon/generated/sprite.svg",
          to: "chunks/easyops-icons",
          // Terser skip this file for minimization
          info: { minimized: true },
        },
      ],
    }),
  ],
};
