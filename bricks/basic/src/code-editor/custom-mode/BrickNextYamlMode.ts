import { brickNextEntryRules, BrickNextRules } from "./BrickNextRules.js";
import { findIndex } from "lodash";
import ace from "brace";
import { loadPluginsForCodeEditor } from "../brace/index.js";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export function getBrickNextYamlMode() {
  loadPluginsForCodeEditor();

  const JavaScriptHighlightRules = ace.acequire(
    "ace/mode/javascript_highlight_rules"
  ).JavaScriptHighlightRules;

  // Ref https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
  // istanbul ignore next
  class CustomHighlightRules extends ace.acequire(
    "ace/mode/yaml_highlight_rules"
  ).YamlHighlightRules {
    constructor() {
      super();
      let originalRules = this.$rules;
      originalRules.start.unshift(...brickNextEntryRules("Unquoted"));
      const findIndexOfString = findIndex(originalRules.start, [
        "token",
        "string",
      ]);
      originalRules.start.splice(
        findIndexOfString,
        0,
        ...[
          {
            token: "string.start",
            regex: '"',
            next: "doubleQuotedToBrickNextEntry",
          },
          {
            token: "string.start",
            regex: "'",
            next: "singleQuotedToBrickNextEntry",
          },
        ]
      );
      originalRules.mlString.unshift(...brickNextEntryRules("Unquoted"));
      originalRules = {
        ...originalRules,
        ...BrickNextRules,
        doubleQuotedToBrickNextEntry: [
          ...brickNextEntryRules("Double"),
          {
            token: "string",
            regex: '"',
            next: "start",
          },
          {
            defaultToken: "string",
          },
        ],
        singleQuotedToBrickNextEntry: [
          ...brickNextEntryRules("Single"),
          {
            token: "string",
            regex: "'",
            next: "start",
          },
          {
            defaultToken: "string",
          },
        ],
      };
      this.$rules = { ...originalRules };
      this.embedRules(JavaScriptHighlightRules, `brickNextSingle-jscode-`, [
        {
          include: ["brickNextSingle-placeholder"],
        },
      ]);
      this.embedRules(JavaScriptHighlightRules, "brickNextDouble-jscode-", [
        {
          include: ["brickNextDouble-placeholder"],
        },
      ]);
      this.embedRules(JavaScriptHighlightRules, "brickNextUnquoted-jscode-", [
        {
          include: ["brickNextUnquoted-placeholder"],
        },
      ]);
      this.normalizeRules();
    }
  }

  return class BrickNextYamlMode extends ace.acequire("ace/mode/yaml").Mode {
    constructor() {
      super();
      this.HighlightRules = CustomHighlightRules;
    }
  };
}
