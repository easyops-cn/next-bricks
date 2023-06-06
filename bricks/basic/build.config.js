import { getSvgrLoaders } from "@next-core/build-next-bricks";

// @ts-check
/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  svgRules: [
    {
      test: /\.svg$/i,
      use: getSvgrLoaders({}),
    },
  ],
};
