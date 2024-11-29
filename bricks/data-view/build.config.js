// @ts-check
/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  moduleRules: [
    {
      test: /\.(?:mp4|webm)$/,
      type: "asset/resource",
      generator: {
        filename: "media/[hash][ext]",
      },
    },
    {
      test: /\.(?:ttf|otf)$/,
      type: "asset/resource",
      generator: {
        filename: "media/[hash][ext]",
      },
    },
  ],
};
