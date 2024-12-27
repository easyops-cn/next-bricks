// @ts-check
/** @type {import("@next-core/build-next-bricks").BuildNextBricksConfig} */
export default {
  moduleRules: [
    {
      // These modules contain unicode character class escapes,
      // which are not supported until Firefox 78.
      test: /[\\/]node_modules[\\/](?:estree-util-is-identifier-name|micromark-util-character|micromark-util-sanitize-uri|@sindresorhus[\\/]transliterate)[\\/]/,
      loader: "babel-loader",
      options: {
        rootMode: "upward",
      },
    },
  ],
};
