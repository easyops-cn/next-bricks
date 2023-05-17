// @ts-check
import { getSvgrLoaders } from "@next-core/build-next-bricks";
import CopyPlugin from "copy-webpack-plugin";

/**
 * @param {string} input
 * @returns {boolean}
 */
function issuer(input) {
  // The issuer is null (or an empty string) for dynamic import
  return !input || /\.[jt]sx?$/.test(input);
}

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  svgRules: [
    {
      resource: {
        and: [
          /\.svg$/i,
          {
            not: /\/(?:twotone|colored-(?:pseudo-3d|common|big-screen))\/[^/]+\.svg$/i,
          },
        ],
      },
      issuer,
      use: getSvgrLoaders({ convertCurrentColor: true }),
    },
    {
      test: /\/(?:twotone|colored-(?:pseudo-3d|common|big-screen))\/[^/]+\.svg$/i,
      issuer,
      use: getSvgrLoaders({ convertCurrentColor: false }),
    },
  ],
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
          from: "src/easyops-icon/generated",
          to: "chunks/easyops-icons",
          filter(filePath) {
            return !filePath.endsWith(".json");
          },
          // Terser skip this file for minimization
          info: { minimized: true },
        },
      ],
    }),
  ],
};
