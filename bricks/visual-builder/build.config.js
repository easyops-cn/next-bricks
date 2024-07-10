// @ts-check
import CopyPlugin from "copy-webpack-plugin";

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: "src/raw-data-preview/fixtures",
          to: "fixtures",
          // Terser skip this file for minimization
          info: { minimized: true },
        },
      ],
    }),
  ],
};
