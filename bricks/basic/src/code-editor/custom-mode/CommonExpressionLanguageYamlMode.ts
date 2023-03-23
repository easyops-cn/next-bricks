import ace from "brace";
import { loadPluginsForCodeEditor } from "../brace/index.js";
import { getCommonExpressionLanguageRules } from "./CommonExpressionLanguageRules.js";
import { AceLanguageRule, AceLanguageRules } from "../interfaces.js";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export function getCommonExpressionLanguageYamlMode() {
  loadPluginsForCodeEditor();

  // Ref https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
  // istanbul ignore next
  class CustomHighlightRules extends ace.acequire(
    "ace/mode/yaml_highlight_rules"
  ).YamlHighlightRules {
    constructor() {
      super();

      const originalRules = this.$rules as AceLanguageRules;

      this.$rules = Object.fromEntries(
        Object.entries(originalRules)
          .filter((entry) => entry[0] !== "mlString")
          // @ts-ignore
          .map<[string, AceLanguageRule[]]>(([key, value]) => {
            if (key === "start") {
              const indexOfStringToken = value.findIndex(
                (rule) => rule.token === "string"
              );
              return [
                key,
                [
                  ...value
                    .slice(0, indexOfStringToken)
                    .filter((rule) => rule.token !== "string"),
                  {
                    token: "string",
                    regex: '"',
                    next: "cel-double-quoted-start",
                  },
                  {
                    token: "string",
                    regex: "'",
                    next: "cel-single-quoted-start",
                  },
                  {
                    token: "string", // multi line string start
                    regex: /[|>][-+\d\s]*$/,
                    onMatch: function (
                      val: string,
                      state: unknown,
                      stack: [string, number],
                      line: string
                    ): string {
                      const indent = /^\s*/.exec(line)?.[0] ?? "";
                      if (stack.length < 1) {
                        stack.push(this.next as string);
                      } else {
                        stack[0] = "cel-multi-line-start";
                      }

                      if (stack.length < 2) {
                        stack.push(indent.length);
                      } else {
                        stack[1] = indent.length;
                      }
                      return this.token as string;
                    },
                    next: "cel-multi-line-start",
                  },
                  ...value
                    .slice(indexOfStringToken + 1)
                    .filter((rule) => rule.token !== "string"),
                ],
              ];
            }
            return [key, value];
          })
          .concat(
            Object.entries(
              getCommonExpressionLanguageRules({
                yamlContext: "multi-line",
              })
            ),
            Object.entries(
              getCommonExpressionLanguageRules({
                yamlContext: "double-quoted",
              })
            ),
            Object.entries(
              getCommonExpressionLanguageRules({
                yamlContext: "single-quoted",
              })
            )
          )
      );

      this.normalizeRules();
    }
  }

  return class CommonExpressionLanguageYamlMode extends ace.acequire(
    "ace/mode/yaml"
  ).Mode {
    constructor() {
      super();
      this.HighlightRules = CustomHighlightRules;
    }
  };
}
