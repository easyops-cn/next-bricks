// @ts-check
/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  moduleRules: [
    {
      test: /\.txt$/,
      type: "asset/source",
    },
  ],
};
