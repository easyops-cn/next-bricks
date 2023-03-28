// @ts-check
import path from "node:path";

/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  svgAsAsset: true,
  imageAssetFilename(pathData) {
    const dirname = path.basename(path.dirname(pathData.filename));
    return `images/${dirname}/[name].[hash][ext][query]`;
  }
};
