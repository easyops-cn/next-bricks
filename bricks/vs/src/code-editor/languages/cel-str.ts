// https://github.com/microsoft/monaco-editor/blob/8270c45a385a180a53fd8ef8e3a189b1471100ed/src/basic-languages/yaml/yaml.ts
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { conf as confOfCel } from "./cel";

export const conf: monaco.languages.LanguageConfiguration = {
  brackets: confOfCel.brackets,
  autoClosingPairs: confOfCel.autoClosingPairs,
};

export const language: monaco.languages.IMonarchLanguage = {
  tokenPostfix: ".yaml.str",

  tokenizer: {
    root: [{ include: "@whitespace" }, { include: "@expression" }],

    expression: [
      [
        /<%/,
        {
          token: "delimiter",
          next: "@expressionEmbedded",
          nextEmbedded: "text/cel",
          bracket: "@open",
        },
      ],
      [/%>/, { token: "delimiter", bracket: "@close" }],
    ],

    expressionEmbedded: [
      [/%>/, { token: "@rematch", next: "@pop", nextEmbedded: "@pop" }],
    ],

    whitespace: [[/[ \t\r\n]+/, "white"]],
  },
};

/**
 * Register the cel_str language, that CEL is embedded in `<%  %>` as a plain string.
 */
export function register(Monaco: typeof monaco, languageId = "cel_str") {
  Monaco.languages.register({
    id: languageId,
    extensions: [".cel-str"],
    mimetypes: ["text/cel-str"],
  });
  Monaco.languages.setLanguageConfiguration(languageId, conf);
  Monaco.languages.setMonarchTokensProvider(languageId, language);
}
