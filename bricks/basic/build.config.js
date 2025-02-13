// @ts-check
/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  svgAsReactComponent: true,
  optimization: {
    splitChunks: {
      cacheGroups: {
        specificVendors: {
          test: /[\\/]node_modules[\\/](?:@babel[\\/]runtime|@next-core[\\/]element|css-loader|style-loader|dompurify|classnames)[\\/]/,
          priority: -5,
          reuseExistingChunk: true,
          name: "vendors",
        },
        react: {
          test: /[\\/]node_modules[\\/](?:@next-core[\\/](?:react-(?:element|runtime))|(?:react(?:-dom)?|scheduler))[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
          name: "react",
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
