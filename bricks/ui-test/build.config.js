import webpack from "webpack";

// @ts-check
/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
