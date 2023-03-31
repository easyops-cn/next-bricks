import { IEditorProps } from "react-ace";
import { AceLanguageRules, AceTokenFunction } from "../interfaces.js";

const celKeywords = {
  keyword:
    "in|as|break|const|continue|else|for|function|if|import|let|loop|package|namespace|return|var|void|while",
  "constant.language": "null",
  "constant.language.boolean": "true|false",
  "support.function":
    // Built-in functions
    "bytes|double|duration|dyn|int|bool|matches|size|string|timestamp|type|uint|round|" +
    // Built-in extensions
    "base64|" +
    // Built-in macros
    "has|" +
    // EasyOps primitive_type_ext
    "printf|isEmpty|repeatArray|" +
    // EasyOps dyn_type_ext
    "mergeList|fieldNotEmpty|hasOrDefault|trinocular|traceId|SHA1|random|random_string|now",
};

const celInstanceMethodKeywords = {
  "support.variable":
    "variable|variable_noload|request|body|query|uri|header|step|config|output|input",
  "support.function":
    // Built-in methods
    "contains|endsWith|matches|startsWith|" +
    // Built-in datetime methods
    "getDate|getDayOfMonth|getDayOfWeek|getDayOfYear|getFullYear|getHours|getMilliseconds|getMinutes|getMonth|getSeconds|" +
    // Built-in extensions
    "charAt|indexOf|lastIndexOf|lowerAscii|replace|split|join|substring|trim|upperAscii|" +
    // Built-in macros
    "all|exists|exists_one|map|filter|" +
    // EasyOps primitive_type_ext
    "decodeb64|truncate|parseJSON|parseYAML|parseURL|isBlank|" +
    // EasyOps dyn_type_ext
    "marshalJSON|marshalYAML|merge|repeat|match|canonical|convertMap|fuse|remove|setAttr|parseDate|format",
};

export const snippets = [
  {
    label: "<% %>",
    caption: "<% %>",
    snippet: "<% ${0} %>",
    meta: "placeholder",
  },
];

let memoizedCompleterWords: string[];

export function getCommonExpressionLanguageCompleterWords(): string[] {
  if (!memoizedCompleterWords) {
    // Reserved keywords are not used in CEL actually.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { keyword, ...restKeywords } = celKeywords;
    memoizedCompleterWords = Object.values(restKeywords)
      .concat(Object.values(celInstanceMethodKeywords))
      .flatMap((words) => words.split("|"));
  }
  return memoizedCompleterWords;
}

export const CommonExpressionLanguageCompleter = [
  {
    getCompletions(
      editor: IEditorProps,
      session: any,
      pos: any,
      prefix: string,
      callback: any
    ): void {
      callback(
        null,
        getCommonExpressionLanguageCompleterWords().map((v) =>
          typeof v === "string"
            ? {
                caption: v,
                value: v,
              }
            : v
        )
      );
    },
  },
  {
    identifierRegexps: [/[a-zA-Z_0-9@<$\-\u00A2-\u2000\u2070-\uFFFF]/],
    getCompletions(
      editor: IEditorProps,
      session: any,
      pos: any,
      prefix: string,
      callback: any
    ) {
      callback(null, snippets);
    },
  },
];

export function getCommonExpressionLanguageRules({
  yamlContext,
}: {
  yamlContext?: "single-quoted" | "double-quoted" | "multi-line";
} = {}): AceLanguageRules {
  const keywordMapper = keywordTokenFactory(celKeywords, "identifier");
  const instanceMethodKeywordMapper = keywordTokenFactory(
    celInstanceMethodKeywords,
    "identifier"
  );

  const escapedRe =
    "\\\\(?:x[0-9a-fA-F]{2}|" + // hex
    "u[0-9a-fA-F]{4}|" + // unicode
    "U[0-9a-fA-F]{8}|" + // unicode
    "[0-3][0-7]{0,2}|" + // oct
    ".)";

  const identifierRe = "[_a-zA-Z]\\w*";

  const prefix = yamlContext ? `cel-${yamlContext}-` : "";

  return {
    [`${prefix}start`]: [
      ...(yamlContext === "multi-line"
        ? [
            {
              token: "indent",
              regex: /^\s*$/,
            },
            {
              token: "indent",
              regex: /^\s*/,
              onMatch: function (
                val: string,
                state: unknown,
                stack: [string, number]
              ): string {
                const curIndent = stack[1];
                if (curIndent >= val.length) {
                  this.next = "start";
                  stack.splice(0);
                } else {
                  this.next = `${prefix}start`;
                }
                return this.token;
              },
              next: `${prefix}start`,
            },
          ]
        : []),
      {
        token: "comment",
        regex: "//.*$",
      },
      ...(yamlContext === "single-quoted"
        ? [
            {
              token: "string",
              regex: "'",
              next: "start",
            },
          ]
        : [
            {
              token: "string",
              regex: "'''",
              next: `${prefix}tqstring`,
            },
            {
              token: ["keyword.other", "string"],
              regex: "([bB]?[rR])(')(?=.)",
              next: `${prefix}rawqstring`,
            },
            {
              token: ["keyword.other", "string"],
              regex: "([bB]?)(')(?=.)",
              next: `${prefix}qstring`,
            },
          ]),
      ...(yamlContext === "double-quoted"
        ? [
            {
              token: "string",
              regex: '"',
              next: "start",
            },
          ]
        : [
            {
              token: "string",
              regex: '"""',
              next: `${prefix}tqqstring`,
            },
            {
              token: ["keyword.other", "string"],
              regex: '([bB]?[rR])(")(?=.)',
              next: `${prefix}rawqqstring`,
            },
            {
              token: ["keyword.other", "string"],
              regex: '([bB]?)(")(?=.)',
              next: `${prefix}qqstring`,
            },
          ]),
      {
        // INT_LIT  ::= '-'? ( DIGIT+ | '0x' HEXDIGIT+ )
        // UINT_LIT ::= INT_LIT [uU]
        token: "constant.numeric", // int or unit
        regex: "-?(?:\\d+|0x[0-9a-fA-F]+)[uU]?\\b",
      },
      {
        // FLOAT_LIT
        //          ::= '-'? DIGIT* ( . DIGIT+ EXPONENT? | DIGIT EXPONENT )
        // EXPONENT ::= [eE] [+#x2D]? DIGIT+
        token: "constant.numeric", // float
        regex: "-?\\d*(?:\\.\\d+(?:[eE][+-]?\\d+)?|\\d[eE][+-]?\\d+)\\b",
      },
      {
        token: keywordMapper,
        regex: identifierRe,
      },
      {
        token: "punctuation.operator",
        regex: "\\.(?!\\.)",
        next: `${prefix}property`,
      },
      {
        token: "keyword.operator",
        regex: "==|!=|<=?|>=?|!|&&|\\|\\||\\?:|[-!%*+/]",
      },
      {
        token: "punctuation.operator",
        regex: "[?:,.]",
      },
      {
        token: "paren.lparen",
        regex: "[[({]",
      },
      {
        token: "paren.rparen",
        regex: "[\\])}]",
      },
    ],
    [`${prefix}property`]: [
      {
        token: "text",
        regex: "\\s+",
      },
      {
        token: "punctuation.operator",
        regex: "\\.(?!\\.)",
      },
      {
        token: instanceMethodKeywordMapper,
        regex: identifierRe,
      },
      {
        token: "empty",
        regex: "",
        next: `${prefix}start`,
      },
    ],
    [`${prefix}qqstring`]: [
      {
        token: "constant.language.escape",
        regex: escapedRe,
      },
      {
        token: "string",
        regex: '"|$',
        next: `${prefix}start`,
      },
      {
        defaultToken: "string",
      },
    ],
    [`${prefix}qstring`]: [
      {
        token: "constant.language.escape",
        regex: escapedRe,
      },
      {
        token: "string",
        regex: "'|$",
        next: `${prefix}start`,
      },
      {
        defaultToken: "string",
      },
    ],
    [`${prefix}rawqqstring`]: [
      {
        token: "string",
        regex: '"|$',
        next: `${prefix}start`,
      },
      {
        defaultToken: "string",
      },
    ],
    [`${prefix}rawqstring`]: [
      {
        token: "string",
        regex: "'|$",
        next: `${prefix}start`,
      },
      {
        defaultToken: "string",
      },
    ],
    [`${prefix}tqqstring`]: [
      {
        token: "constant.language.escape",
        regex: escapedRe,
      },
      {
        token: "string",
        regex: '"""',
        next: `${prefix}start`,
      },
      {
        defaultToken: "string",
      },
    ],
    [`${prefix}tqstring`]: [
      {
        token: "constant.language.escape",
        regex: escapedRe,
      },
      {
        token: "string",
        regex: "'''",
        next: `${prefix}start`,
      },
      {
        defaultToken: "string",
      },
    ],
  } as AceLanguageRules;
}

function keywordTokenFactory(
  map: Record<string, string>,
  defaultToken: string
): AceTokenFunction {
  const tokenMap = new Map<string, string>();
  for (const [className, keywords] of Object.entries(map)) {
    for (const kw of keywords.split("|")) {
      tokenMap.set(kw, className);
    }
  }
  return (value: string) => tokenMap.get(value) ?? defaultToken;
}

// Below are the refined EBNF rules for Common Expression Language (CEL).
// For the original syntax rules, see https://github.com/google/cel-spec/blob/master/doc/langdef.md#syntax .
// Copy the rules to https://www.bottlecaps.de/rr/ui and view the diagram.
/*

Expr           ::= ConditionalOr ("?" ConditionalOr ":" Expr)?
ConditionalOr  ::= (ConditionalOr "||")? ConditionalAnd
ConditionalAnd ::= (ConditionalAnd "&&")? Relation
Relation       ::= (Relation Relop)? Addition
Relop          ::= "<" | "<=" | ">=" | ">" | "==" | "!=" | "in"
Addition       ::= (Addition ("+" | "-"))? Multiplication
Multiplication ::= (Multiplication ("*" | "/" | "%"))? Unary
Unary          ::= Member
                    | ("!")+ Member
                    | ("-")+ Member
Member         ::= Primary
                    | Member "." IDENT ("(" ExprList? ")")?
                    | Member "[" Expr "]"
                    | Member "{" FieldInits? "}"
Primary        ::= "."? IDENT ("(" ExprList? ")")?
                    | "(" Expr ")"
                    | "[" ExprList? "]"
                    | "{" MapInits? "}"
                    | LITERAL
ExprList       ::= Expr ("," Expr)*
FieldInits     ::= IDENT ":" Expr ("," IDENT ":" Expr)*
MapInits       ::= Expr ":" Expr ("," Expr ":" Expr)*

IDENT          ::= [_a-zA-Z][_a-zA-Z0-9]* "-" RESERVED
LITERAL        ::= INT_LIT | UINT_LIT | FLOAT_LIT | STRING_LIT | BYTES_LIT
                 | BOOL_LIT | NULL_LIT
INT_LIT        ::= "-"? DIGIT+ | "-"? "0x" HEXDIGIT+
UINT_LIT       ::= INT_LIT [uU]
FLOAT_LIT      ::= "-"? DIGIT* . DIGIT+ EXPONENT? | "-"? DIGIT+ EXPONENT
DIGIT          ::= [0-9]
HEXDIGIT       ::= [0-9abcdefABCDEF]
EXPONENT       ::= [eE] [+-]? DIGIT+
STRING_LIT     ::= [rR]? ( '"'   [^"#xD#xA]*       '"'
                         | "'"   [^'#xD#xA]*       "'"
                         | '"""' ( CHAR* - '"""' ) '"""'
                         | "'''" ( CHAR* - "'''" ) "'''"
                        )
BYTES_LIT      ::= [bB] STRING_LIT
ESCAPE         ::= "\" [bfnrt"'\]
                 | "\" "x" HEXDIGIT HEXDIGIT
                 | "\" "u" HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT
                 | "\" "U" HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT HEXDIGIT
                 | "\" [0-3] [0-7] [0-7]
NEWLINE        ::= #xD #xA | #xD | #xA
BOOL_LIT       ::= "true" | "false"
NULL_LIT       ::= "null"
RESERVED       ::= BOOL_LIT | NULL_LIT | "in"
                 | "as" | "break" | "const" | "continue" | "else"
                 | "for" | "function" | "if" | "import" | "let"
                 | "loop" | "package" | "namespace" | "return"
                 | "var" | "void" | "while"
WHITESPACE     ::= (#x9 | #xA | #xC | #xD | #x20)+
COMMENT        ::= '//' [^#xD#xA]* NEWLINE

CHAR           ::= [http://www.w3.org/TR/xml#NT-Char]

*/
