import { forEach, map } from "lodash";

// Refer to https://github.com/easyops-cn/vscode-brick-next for rules
export const GetBrickNextRules = (
  quotedType: "Single" | "Double" | "Unquoted"
) => ({
  placeholder: [
    {
      token: "support.class.builtin.js",
      regex:
        "\\b(?:EVENT|DATA|PIPES|PARAMS|PATH|QUERY(?:_ARRAY)?|APP|HASH|ANCHOR|SYS|FLAGS|I18N|CTX|SEGUE|ALIAS|PROCESSORS|IMG|PERMISSIONS|LOCAL_STORAGE|SESSION_STORAGE|MISC|TAG_URL|SAFE_TAG_URL|FN|BASE_URL|PATH_NAME|STATE|DS|TPL)\\b",
    },
    {
      token: "placeholder.end",
      regex: "\\s%>",
      next: "placeholderEnd",
    },
  ],
  placeholderEnd: [
    {
      token: "string",
      regex: "['|\"]*",
      next: "start",
    },
    {
      defaultToken: "string",
    },
  ],
  transform: [
    {
      token: "paren.rparen",
      regex: "\\}",
      next: "placeholderEnd",
    },
    {
      include: ["field"],
    },
    {
      token: "expression.assign-default.placeholder",
      regex: "=",
      next: "assignDefault",
    },
    {
      token: "keyword.operator.expression.pipe.placeholder",
      regex: "\\|",
      next: "pipe",
    },
  ],
  field: [
    {
      token: "support.variable.field",
      regex: "(?:[a-zA-Z_\\-0-9\\.\\*\\[\\]]+)",
    },
  ],
  assignDefault: [
    {
      include: ["value", "literal"],
    },
    {
      token: "expression.assign-default.placeholder",
      regex: "(?=[\\|\\}])",
      next: "transform",
    },
  ],
  literal: [
    {
      token: "literal.string",
      regex: "[a-zA-Z_\\-0-9]+",
    },
  ],
  pipe: [
    {
      token: "expression.pipe.placeholder",
      regex: "(?=\\})",
      next: "transform",
    },
    {
      token: "expression.pipe-parameter.placeholder",
      regex: ":",
      next: "pipeParameter",
    },
    {
      include: ["identifier"],
    },
    {
      token: "keyword.operator.expression.pipe.placeholder",
      regex: "\\|",
      next: "pipe",
    },
  ],
  pipeParameter: [
    {
      token: "expression.pipe-parameter.placeholder",
      regex: "(?=[\\|\\}])",
      next: "pipe",
    },
    {
      include: ["value"],
    },
  ],
  identifier: [
    {
      token: "support.function",
      regex: "[a-zA-Z]\\w*",
      next: "pipe",
    },
  ],
  value: [
    {
      include: ["constant", "number"],
    },
    {
      token: "string.quoted.double.json",
      regex:
        quotedType === "Double" ? '\\\\"' : quotedType === "Single" ? '"' : '"',
      next: "stringValue",
    },
    {
      token: "meta.structure.array.json",
      regex: "\\[",
      next: "arrayValue",
    },
    {
      token: "meta.structure.dictionary.json",
      regex: "\\{",
      next: "objectValue",
    },
  ],
  constant: [
    {
      token: "constant.language.json",
      regex: "\\b(?:true|false|null)\\b",
    },
  ],
  number: [
    {
      token: "constant.numeric.json",
      regex: "-?(?:0|[1-9]\\d*)(?:(?:\\.\\d+)?(?:[eE][+-]?\\d+)?)?",
    },
  ],
  stringValue: [
    {
      token: "constant.character.escape.json",
      regex:
        quotedType === "Double"
          ? '\\\\\\\\(?:["/bfnrt]|u[0-9a-fA-F]{4}|\\\\\\\\)'
          : quotedType === "Single"
          ? "\\\\\\\\(?:['/bfnrt]|u[0-9a-fA-F]{4}|\\\\\\\\)"
          : "\\\\\\\\(?:['|\"/bfnrt]|u[0-9a-fA-F]{4}|\\\\\\\\)",
    },
    {
      token: "invalid.illegal.unrecognized-string-escape.json",
      regex: "\\\\\\\\.",
    },
    {
      token: "string.quoted.double.json",
      regex:
        quotedType === "Double" ? '\\\\"' : quotedType === "Single" ? '"' : '"',
      next: "value",
    },
  ],
  arrayValue: [
    {
      include: ["value"],
    },
    {
      token: "punctuation.separator.array.json",
      regex: ",",
    },
    {
      token: "invalid.illegal.expected-array-separator.json",
      regex: "[^\\s\\]]",
    },
    {
      token: "meta.structure.array.json",
      regex: "(,)?[\\s]*(\\])",
      next: "value",
    },
  ],
  objectValue: [
    {
      include: ["stringValue"],
    },
    {
      token: "meta.structure.dictionary.value.json",
      regex: ":",
      next: "dictionaryValue",
    },
    {
      token: "invalid.illegal.expected-dictionary-separator.json",
      regex: "[^\\s\\}]",
    },
    {
      token: "meta.structure.dictionary.json",
      regex: "\\}",
      next: "value",
    },
  ],
  dictionaryValue: [
    {
      token: "meta.structure.dictionary.value.json",
      regex: "(,)(?=[\\s]*\\})|(,)|(?=\\})",
      next: "objectValue",
    },
    {
      include: ["value"],
    },
    {
      token: "invalid.illegal.expected-dictionary-separator.json",
      regex: "[^\\s,]",
    },
  ],
});

export const generateBrickNextRules = (
  quotedType: "Single" | "Double" | "Unquoted"
) => {
  const resultRules: Record<string, any> = {};
  forEach(GetBrickNextRules(quotedType), (rules, key) => {
    resultRules[`brickNext${quotedType}-${key}`] = map(rules, (rule) => {
      if ((rule as any)?.next && (rule as any)?.next !== "start") {
        (rule as any).next = `brickNext${quotedType}-${(rule as any).next}`;
      }
      if ((rule as any)?.include) {
        (rule as any).include = map(
          (rule as any).include,
          (includeKey) => `brickNext${quotedType}-${includeKey}`
        );
      }
      return rule;
    });
  });
  return resultRules;
};

export const brickNextEntryRules = (
  quotedType: "Single" | "Double" | "Unquoted"
) => [
  {
    token: "placeholder.start",
    regex: "(<%)(~?)(\\s|$)",
    push: `brickNext${quotedType}-jscode-start`,
  },
  {
    token: "paren.lparen",
    regex: "(@)(\\{)",
    next: `brickNext${quotedType}-transform`,
  },
];

export const BrickNextRules = {
  ...generateBrickNextRules("Single"),
  ...generateBrickNextRules("Double"),
  ...generateBrickNextRules("Unquoted"),
};
