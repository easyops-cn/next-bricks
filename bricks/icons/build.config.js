// @ts-check
import { getSvgrLoaders } from "@next-core/build-next-bricks";

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
  svgRules: [{
    resource: {
      and: [
        /\.svg$/i,
        {
          not: /\/colored-(?:pseudo-3d|common|big-screen)\/[^/]+\.svg$/i,
        }
      ]
    },
    issuer,
    use: getSvgrLoaders({ convertCurrentColor: true}),
  },{
    test: /\/colored-(?:pseudo-3d|common|big-screen)\/[^/]+\.svg$/i,
    issuer,
    use: getSvgrLoaders({ convertCurrentColor: false }),
  }]
};
