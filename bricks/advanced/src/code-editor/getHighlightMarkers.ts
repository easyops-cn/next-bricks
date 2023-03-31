import { IEditorProps } from "react-ace";
import {
  ExtendedMarker,
  HighlightTokenSettings,
  HighlightTokenType,
} from "./interfaces.js";

type TokenPosition = [
  HighlightTokenSettings,
  string,
  number,
  number,
  number,
  number
];

const tagNameAsTargetRegExp = /^[-\w]+(\\\.[-\w]+)*$/;

export function getHighlightMarkers({
  editor,
  markerClassMap,
  highlightTokens,
}: {
  editor: IEditorProps;
  markerClassMap: {
    default: string;
    warn: string;
    error: string;
  };
  highlightTokens?: HighlightTokenSettings[];
}): ExtendedMarker[] {
  if (!editor || !highlightTokens?.length) {
    return [];
  }
  const length = editor.session.getLength();
  let state:
    | "initial"
    | "namespace"
    | "dot"
    | "meta-tag"
    | "colon"
    | "string-start" = "initial";
  const tokenPositions: TokenPosition[] = [];
  let startRow = 0;
  let highlightToken: any = {} as HighlightTokenSettings;
  let metaTag: string = "";
  let quote: string = "";
  for (let i = 0; i < length; i++) {
    const tokens = editor.session.getTokens(i);
    let col = 0;
    let startCol = 0;
    for (const token of tokens) {
      switch (token.type) {
        case "identifier":
          if (state === "dot") {
            tokenPositions.push([
              highlightToken,
              token.value,
              i,
              startRow === i ? startCol : col,
              i,
              col + token.value.length,
            ]);
          }
          state = "initial";
          break;
        case "punctuation.operator":
          if (state === "namespace" && token.value === ".") {
            state = "dot";
          } else {
            state = "initial";
          }
          break;
        case "support.class.builtin.js":
          if (state === "initial") {
            const currentType =
              token.value === "FN"
                ? "storyboard-function"
                : token.value === "CTX"
                ? "storyboard-context"
                : token.value === "STATE"
                ? "storyboard-state"
                : token.value === "TPL"
                ? "storyboard-tpl-var"
                : token.value === "PATH" ||
                  token.value === "PATH_NAME" ||
                  token.value === "QUERY" ||
                  token.value === "QUERY_ARRAY" ||
                  token.value === "PARAMS" ||
                  token.value === "HASH" ||
                  token.value === "ANCHOR"
                ? "storyboard-route-var"
                : token.value === "DS"
                ? "dashboard-DS"
                : null;
            highlightToken = currentType
              ? highlightTokens.find((item) => item.type === currentType)
              : null;
            if (highlightToken) {
              state = "namespace";
              startCol = col;
              startRow = i;
            }
          } else {
            state = "initial";
          }
          break;
        case "meta.tag":
          state = "meta-tag";
          metaTag = token.value.replace(/^\s+/, "");
          break;
        case "keyword":
          if (state === "meta-tag" && token.value === ":") {
            state = "colon";
          } else {
            state = "initial";
          }
          break;
        case "text":
          if (!/^\s+$/.test(token.value)) {
            if (state === "colon") {
              if (metaTag === "action" || metaTag === "target") {
                // @ts-ignore
                const [, leadingSpace, value, trailingSpace] = (
                  token.value as string
                ).match(/^(\s*)(.+?)(\s*)$/);
                pushActionOrTarget(
                  metaTag,
                  i,
                  col + leadingSpace.length,
                  col + token.value.length - trailingSpace.length,
                  value,
                  highlightTokens,
                  tokenPositions
                );
              }
            }
            state = "initial";
          }
          break;
        case "string.start":
          if (state === "colon") {
            state = "string-start";
            quote = token.value;
          } else {
            state = "initial";
          }
          break;
        case "string":
          if (state === "string-start") {
            if (
              (metaTag === "action" || metaTag === "target") &&
              token.value.endsWith(quote)
            ) {
              const value = token.value.substring(
                0,
                token.value.length - quote.length
              );
              pushActionOrTarget(
                metaTag,
                i,
                col,
                col + value.length,
                value,
                highlightTokens,
                tokenPositions
              );
            }
          }
          state = "initial";
          break;
        default:
          state = "initial";
      }
      col += token.value.length;
    }
  }
  return tokenPositions.map<ExtendedMarker>(
    ([highlight, identifier, startRow, startCol, endRow, endCol]) => ({
      startRow,
      startCol,
      endRow,
      endCol,
      highlightType: highlight.type,
      identifier,
      className: markerClassMap[highlight.level ?? "default"],
      type: "text",
      inFront: true,
    })
  );
}

function pushActionOrTarget(
  type: "action" | "target",
  row: number,
  startCol: number,
  endCol: number,
  value: string,
  highlightTokens: HighlightTokenSettings[],
  tokenPositions: TokenPosition[]
): void {
  let currentType: HighlightTokenType = "" as HighlightTokenType;

  if (type === "action") {
    switch (value) {
      case "context.assign":
      case "context.replace":
      case "context.load":
      case "context.refresh":
        currentType = "storyboard-context-action";
        break;
      case "state.update":
      case "state.load":
      case "state.refresh":
        currentType = "storyboard-state-action";
        break;
    }
  } else {
    if (
      value !== "_self" &&
      value !== "null" &&
      tagNameAsTargetRegExp.test(value)
    ) {
      currentType = "storyboard-tag-name-as-target";
    }
  }
  const highlightToken = currentType
    ? highlightTokens.find((item) => item.type === currentType)
    : null;
  if (highlightToken) {
    tokenPositions.push([highlightToken, value, row, startCol, row, endCol]);
  }
}
