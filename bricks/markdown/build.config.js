import webpack from "webpack";

// @ts-check
/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  plugins: [
    new webpack.NormalModuleReplacementPlugin(
      new RegExp(/^micromark.+\.js$/),
      function (
        /** @type {{ request: string }} */
        resource
      ) {
        resource.request = resource.request.replace(".js", "");
      }
    ),
  ],
};
