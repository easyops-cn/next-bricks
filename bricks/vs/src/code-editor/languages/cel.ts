// https://github.com/microsoft/monaco-editor/blob/8270c45a385a180a53fd8ef8e3a189b1471100ed/src/basic-languages/yaml/yaml.ts
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";

export const conf: monaco.languages.LanguageConfiguration = {
  // wordPattern:
  //   /(-?\d*\.\d\w*)|([^\`\~\!\@\#\%\^\&\*\(\)\-\=\+\[\{\]\}\\\|\;\:\'\"\,\.\<\>\/\?\s]+)/g,

  comments: {
    lineComment: "//",
    blockComment: null,
  },

  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"],
  ],

  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    // { open: "`", close: "`", notIn: ["string", "comment"] },
    // { open: "/**", close: " */", notIn: ["string"] },
  ],
};

export const language: monaco.languages.IMonarchLanguage = {
  // Set defaultToken to invalid to see what you do not tokenize yet
  defaultToken: "invalid",

  tokenPostfix: ".cel",

  keywords: [
    // Reserved keywords are not used in CEL actually.
    "in",
    "as",
    "break",
    "const",
    "continue",
    "else",
    "for",
    "function",
    "if",
    "import",
    "let",
    "loop",
    "package",
    "namespace",
    "return",
    "var",
    "void",
    "while",
    // constants
    "null",
    // boolean
    "true",
    "false",
  ],

  constants: [
    // Built-in functions
    "bytes",
    "double",
    "duration",
    "dyn",
    "int",
    "bool",
    "matches",
    "size",
    "string",
    "timestamp",
    "type",
    "uint",
    "round",
    // Built-in extensions
    "base64",
    // Built-in macros
    "has",
    // EasyOps primitive_type_ext
    "printf",
    "isEmpty",
    "repeatArray",
    // EasyOps dyn_type_ext
    "mergeList",
    "fieldNotEmpty",
    "hasOrDefault",
    "trinocular",
    "traceId",
    "SHA1",
    "random",
    "random_string",
    "now",
    // Flow builder variables
    "request",
    "step",
    "variable",
    "config",
    "$",
  ],

  prototypes: [
    // Built-in methods
    "contains",
    "endsWith",
    "matches",
    "startsWith",
    // Built-in datetime methods
    "getDate",
    "getDayOfMonth",
    "getDayOfWeek",
    "getDayOfYear",
    "getFullYear",
    "getHours",
    "getMilliseconds",
    "getMinutes",
    "getMonth",
    "getSeconds",
    // Built-in extensions
    "charAt",
    "indexOf",
    "lastIndexOf",
    "lowerAscii",
    "replace",
    "split",
    "join",
    "substring",
    "trim",
    "upperAscii",
    // Built-in macros
    "all",
    "exists",
    "exists_one",
    "map",
    "filter",
    // EasyOps primitive_type_ext
    "decodeb64",
    "truncate",
    "parseJSON",
    "parseYAML",
    "parseURL",
    "isBlank",
    // EasyOps dyn_type_ext
    "marshalJSON",
    "marshalYAML",
    "merge",
    "repeat",
    "match",
    "canonical",
    "convertMap",
    "fuse",
    "remove",
    "setAttr",
    "parseDate",
    "format",
  ],

  operators: [
    // Logical operators
    "&&",
    "||",
    // Comparison operators
    "<=",
    "<",
    ">=",
    ">",
    "==",
    "!=",
    // "in",
    // Arithmetic operators
    "+",
    "-",
    "*",
    "/",
    "%",
    "!",
  ],

  // we include these common regular expressions
  symbols: /[=><!~?:&|+\-*/^%]+/,

  escapes:
    /\\(?:[bfnrt\\"']|x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8}|[0-3][0-7]{2})/,

  // The main tokenizer for our languages
  tokenizer: {
    root: [
      // identifiers and keywords
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            "@keywords": "keyword",
            "@constants": "keyword",
            "@default": "identifier",
          },
        },
      ],

      // Method calling
      [
        /(\.)([a-zA-Z_$][\w$]*)/,
        [
          "operator",
          {
            cases: {
              "@prototypes": "keyword",
              "@default": "identifier",
            },
          },
        ],
      ],

      // whitespace
      { include: "@whitespace" },

      // delimiters and operators
      [/[{}()[\]]/, "@brackets"],
      // [/[<>](?!@symbols)/, "@brackets"],
      [/@symbols/, { cases: { "@operators": "operator", "@default": "" } }],

      // numbers
      [/\d*\.\d+([eE][-+]?\d+)?/, "number.float"],
      [/0x[0-9a-fA-F]+[uU]?/, "number.hex"],
      [/\d+[uU]?/, "number"],

      // delimiter: after number because of .\d floats
      [/[;,.]/, "delimiter"],

      // strings
      [/"([^"\\]|\\.)*$/, "string.invalid"], // non-terminated string
      [/"/, { token: "string.quote", bracket: "@open", next: "@string" }],

      // characters
      [/'[^\\']'/, "string"],
      [/(')(@escapes)(')/, ["string", "string.escape", "string"]],
      [/'/, "string.invalid"],
    ],

    string: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, { token: "string.quote", bracket: "@close", next: "@pop" }],
    ],

    whitespace: [
      [/[ \t\r\n]+/, "white"],
      [/\/\/.*$/, "comment"],
    ],
  },
};

/**
 * Register the CEL language.
 *
 * See https://github.com/google/cel-spec/blob/master/doc/langdef.md#syntax
 */
export function register(Monaco: typeof monaco, languageId = "cel") {
  Monaco.languages.register({
    id: languageId,
    extensions: [".cel"],
    mimetypes: ["text/cel"],
  });
  Monaco.languages.setLanguageConfiguration(languageId, conf);
  Monaco.languages.setMonarchTokensProvider(languageId, language);
}
