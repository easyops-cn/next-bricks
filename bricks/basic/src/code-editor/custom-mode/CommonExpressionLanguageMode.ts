import ace from "ace-builds";
import { loadPluginsForCodeEditor } from "../brace/index.js";
import { getCommonExpressionLanguageRules } from "./CommonExpressionLanguageRules.js";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export function getCommonExpressionLanguageMode() {
  loadPluginsForCodeEditor();

  // istanbul ignore next
  class CommonExpressionLanguageHighlightRules extends ace.require(
    "ace/mode/text_highlight_rules"
  ).TextHighlightRules {
    constructor() {
      super();
      this.$rules = getCommonExpressionLanguageRules();
      this.normalizeRules();
    }
  }

  return class CommonExpressionLanguageMode extends ace.require(
    "ace/mode/text"
  ).Mode {
    constructor() {
      super();
      this.HighlightRules = CommonExpressionLanguageHighlightRules;
    }
  };
}
