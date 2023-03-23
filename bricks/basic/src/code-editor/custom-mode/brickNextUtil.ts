import storyboardJsonSchema from "@next-core/types/storyboard.json";
import { IEditorProps } from "react-ace";
import { get } from "lodash";

export const brickNextSnippet = [
  {
    label: "${}",
    caption: "${}",
    snippet: "${${0}}",
    meta: "placeholder",
  },
  {
    label: "<% %>",
    caption: "<% %>",
    snippet: "<% ${0} %>",
    meta: "placeholder",
  },
  {
    label: "@{}",
    caption: "@{}",
    snippet: "@{${0}}",
    meta: "transform",
  },
];

export const brickNextKeywords = [
  "EVENT",
  "DATA",
  "PIPES",
  "PARAMS",
  "PATH",
  "QUERY",
  "QUERY_ARRAY",
  "APP",
  "HASH",
  "ANCHOR",
  "SYS",
  "FLAGS",
  "I18N",
  "CTX",
  "SEGUE",
  "ALIAS",
  "PROCESSORS",
  "IMG",
  "PERMISSIONS",
  "LOCAL_STORAGE",
  "SESSION_STORAGE",
  "MISC",
  "TAG_URL",
  "SAFE_TAG_URL",
  "FN",
  "BASE_URL",
  "PATH_NAME",
  "STATE",
  "action",
  "target",
  "method",
  "targetRef",
];

// istanbul ignore next
export const brickNextCompleters = [
  {
    identifierRegexps: [/[a-zA-Z_0-9@<$\-\u00A2-\u2000\u2070-\uFFFF]/],
    getCompletions(
      editor: IEditorProps,
      session: any,
      pos: any,
      prefix: string,
      callback: any
    ) {
      callback(null, brickNextSnippet);
    },
  },
  {
    getCompletions(
      editor: IEditorProps,
      session: any,
      pos: any,
      prefix: string,
      callback: any
    ) {
      callback(
        null,
        brickNextKeywords.map((word) => ({
          caption: word,
          value: word,
          meta: "variable",
          score: 20,
        }))
      );
    },
  },
  {
    getCompletions(
      editor: IEditorProps,
      session: any,
      pos: any,
      prefix: string,
      callback: any
    ) {
      const line = session.getLine(pos.row).substr(0, pos.column);
      if (/action(["']?)([\s]*):/.test(line)) {
        callback(
          null,
          (get(
            storyboardJsonSchema ?? {},
            "definitions.BuiltinBrickEventHandler.properties.action.enum"
          ) ?? []).map((word: any) => ({
            caption: word,
            value: word,
            meta: "event action",
            score: 10,
          }))
        );
      } else {
        callback(null, []);
      }
    },
  },
];
