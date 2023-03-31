// Copy from ace/mode/terraform
// Terraform mode is not supported in the react-ace 7.x version
import ace from "ace-builds";
import "../aceBuilds/index.js";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types,@typescript-eslint/explicit-function-return-type
export function getTerraformMode() {
  const CstyleBehaviour = ace.require(
    "ace/mode/behaviour/cstyle"
  ).CstyleBehaviour;

  const CStyleFoldMode = ace.require("ace/mode/folding/cstyle").FoldMode;

  const MatchingBraceOutdent = ace.require(
    "ace/mode/matching_brace_outdent"
  ).MatchingBraceOutdent;

  // Ref https://github.com/ajaxorg/ace/wiki/Creating-or-Extending-an-Edit-Mode
  // istanbul ignore next
  class TerraformHighlightRules extends ace.require(
    "ace/mode/text_highlight_rules"
  ).TextHighlightRules {
    constructor() {
      super();
      this.$rules = {
        start: [
          {
            token: ["storage.function.terraform"],
            regex: "\\b(output|resource|data|variable|module|export)\\b",
          },
          {
            token: "variable.terraform",
            regex: "\\$\\s",
            push: [
              {
                token: "keyword.terraform",
                regex: "(-var-file|-var)",
              },
              {
                token: "variable.terraform",
                regex: "\\n|$",
                next: "pop",
              },

              { include: "strings" },
              { include: "variables" },
              { include: "operators" },

              { defaultToken: "text" },
            ],
          },
          {
            token: "language.support.class",
            regex:
              "\\b(timeouts|provider|connection|provisioner|lifecycleprovider|atlas)\\b",
          },

          {
            token: "singleline.comment.terraform",
            regex: "#(.)*$",
          },
          {
            token: "multiline.comment.begin.terraform",
            regex: "^\\s*\\/\\*",
            push: "blockComment",
          },
          {
            token: "storage.function.terraform",
            regex: "^\\s*(locals|terraform)\\s*{",
          },
          {
            token: "paren.lparen",
            regex: "[[({]",
          },

          {
            token: "paren.rparen",
            regex: "[\\])}]",
          },
          { include: "constants" },
          { include: "strings" },
          { include: "operators" },
          { include: "variables" },
        ],
        blockComment: [
          {
            regex: "^\\s*\\/\\*",
            token: "multiline.comment.begin.terraform",
            push: "blockComment",
          },
          {
            regex: "\\*\\/\\s*$",
            token: "multiline.comment.end.terraform",
            next: "pop",
          },
          {
            defaultToken: "comment",
          },
        ],
        constants: [
          {
            token: "constant.language.terraform",
            regex: "\\b(true|false|yes|no|on|off|EOF)\\b",
          },
          {
            token: "constant.numeric.terraform",
            regex:
              "(\\b([0-9]+)([kKmMgG]b?)?\\b)|(\\b(0x[0-9A-Fa-f]+)([kKmMgG]b?)?\\b)",
          },
        ],
        variables: [
          {
            token: ["variable.assignment.terraform", "keyword.operator"],
            regex: "\\b([a-zA-Z_]+)(\\s*=)",
          },
        ],
        interpolated_variables: [
          {
            token: "variable.terraform",
            regex: "\\b(var|self|count|path|local)\\b(?:\\.*[a-zA-Z_-]*)?",
          },
        ],
        strings: [
          {
            token: "punctuation.quote.terraform",
            regex: "'",
            push: [
              {
                token: "punctuation.quote.terraform",
                regex: "'",
                next: "pop",
              },
              { include: "escaped_chars" },
              { defaultToken: "string" },
            ],
          },
          {
            token: "punctuation.quote.terraform",
            regex: '"',
            push: [
              {
                token: "punctuation.quote.terraform",
                regex: '"',
                next: "pop",
              },
              { include: "interpolation" },
              { include: "escaped_chars" },
              { defaultToken: "string" },
            ],
          },
        ],
        escaped_chars: [
          {
            token: "constant.escaped_char.terraform",
            regex: "\\\\.",
          },
        ],
        operators: [
          {
            token: "keyword.operator",
            regex: "\\?|:|==|!=|>|<|>=|<=|&&|\\|\\||!|%|&|\\*|\\+|\\-|/|=",
          },
        ],
        interpolation: [
          {
            // TODO: double $
            token: "punctuation.interpolated.begin.terraform",
            regex: "\\$?\\$\\{",
            push: [
              {
                token: "punctuation.interpolated.end.terraform",
                regex: "\\}",
                next: "pop",
              },
              { include: "interpolated_variables" },
              { include: "operators" },
              { include: "constants" },
              { include: "strings" },
              { include: "functions" },
              { include: "parenthesis" },
              { defaultToken: "punctuation" },
            ],
          },
        ],
        functions: [
          {
            token: "keyword.function.terraform",
            regex:
              "\\b(abs|basename|base64decode|base64encode|base64gzip|base64sha256|base64sha512|bcrypt|ceil|chomp|chunklist|cidrhost|cidrnetmask|cidrsubnet|coalesce|coalescelist|compact|concat|contains|dirname|distinct|element|file|floor|flatten|format|formatlist|indent|index|join|jsonencode|keys|length|list|log|lookup|lower|map|matchkeys|max|merge|min|md5|pathexpand|pow|replace|rsadecrypt|sha1|sha256|sha512|signum|slice|sort|split|substr|timestamp|timeadd|title|transpose|trimspace|upper|urlencode|uuid|values|zipmap)\\b",
          },
        ],
        parenthesis: [
          {
            token: "paren.lparen",
            regex: "\\[",
          },
          {
            token: "paren.rparen",
            regex: "\\]",
          },
        ],
      };
      this.normalizeRules();
    }
  }

  return class TerraformMode extends ace.require("ace/mode/text").Mode {
    constructor() {
      super();
      this.HighlightRules = TerraformHighlightRules;
      this.$outdent = new MatchingBraceOutdent();
      this.$behaviour = new CstyleBehaviour();
      this.foldingRules = new CStyleFoldMode();
    }
  };
}
