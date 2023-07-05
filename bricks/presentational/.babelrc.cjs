const prismjsPlugin = require("babel-plugin-prismjs");

module.exports = {
  plugins: [
    [
      prismjsPlugin,
      {
        languages: [
          "javascript",
          "css",
          "markup",
          "bash",
          "shell",
          "c",
          "git",
          "go",
          "ini",
          "java",
          "json",
          "php",
          "powershell",
          "python",
          "sql",
          "typescript",
          "vim",
          "yaml",
        ],
        plugins: [],
        css: false,
      },
    ],
  ],
};
