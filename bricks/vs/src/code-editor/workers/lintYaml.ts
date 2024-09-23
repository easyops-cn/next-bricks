import type { CST } from "yaml";
import type { Identifier, MemberExpression } from "@babel/types";
import type { EstreeParent } from "@next-core/cook";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import type { Marker } from "..";

export interface LintRequest {
  id: string;
  source: string;
  links?: string[];
  markers?: Marker[];
}

export interface LintResponse {
  id: string;
  lintMarkers: LintMarker[];
  lintDecorations: LintDecoration[];
}

export interface LintMarker {
  start: number;
  end: number;
  message: string;
  severity: keyof typeof monaco.MarkerSeverity;
  code?:
    | string
    | {
        value: string;
        target: string;
      };
}

export interface LintDecoration {
  start: number;
  end: number;
  options: monaco.editor.IModelDecorationOptions;
}

interface MarkerNode {
  node: Identifier;
  message: string;
  severity: keyof typeof monaco.MarkerSeverity;
  code?:
    | string
    | {
        value: string;
        target: string;
      };
}

const LEVEL_TO_SEVERITY_NAME = {
  hit: "Hint",
  hint: "Hint",
  info: "Info",
  warn: "Warning",
  error: "Error",
} as const;

export async function lintYaml({
  id,
  source,
  links,
  markers,
}: LintRequest): Promise<LintResponse> {
  const { parseDocument, visit } = await import("yaml");
  const { preevaluate, isEvaluable } = await import("@next-core/cook");

  const lintMarkers: LintMarker[] = [];
  const lintDecorations: LintDecoration[] = [];

  const beforeVisitGlobalFactory = (
    linkNodes: MemberExpression[],
    markerNodes: MarkerNode[]
  ) => {
    return (node: Identifier, parent: EstreeParent): void => {
      if (links?.includes(node.name)) {
        const memberParent = parent[parent.length - 1];
        if (
          memberParent?.node.type === "MemberExpression" &&
          memberParent.key === "object"
        ) {
          const memberNode = memberParent.node;
          if (
            !memberNode.computed &&
            memberNode.property.type === "Identifier"
          ) {
            linkNodes.push(memberNode);
          }
        }
      }
      const matchedMarker = markers?.find(
        (marker) => marker.token === node.name
      );
      if (matchedMarker?.message) {
        // Todo: re-implement `markers.params`
        markerNodes.push({
          node,
          message: matchedMarker.message,
          severity:
            LEVEL_TO_SEVERITY_NAME[matchedMarker.level ?? "warn"] ?? "Warning",
          code: matchedMarker.code,
        });
      }
    };
  };

  try {
    const doc = parseDocument(source, {
      keepSourceTokens: true,
      version: "1.2",
    });

    visit(doc, {
      Scalar(key, node) {
        if (key !== "key" && typeof node.value === "string") {
          /**
           * 对于 PLAIN 和 BLOCK_* 类型，没有字符转义，可以直接使用原始内容来对表达式进行分析；
           * 对于 QUOTE_* 类型，需要使用解析后的值来进行表达式分析，同时将值与原始内容的位置关系进行映射。
           * TODO: 对于 QUOTE_* 类型，暂未处理连续空行的转换。
           */
          switch (node.type) {
            case "PLAIN":
            case "BLOCK_LITERAL":
            case "BLOCK_FOLDED": {
              const srcToken = node.srcToken as
                | CST.BlockScalar
                | CST.FlowScalar;
              // 此 source 非 yaml 解析 后的值，而是原始内容
              if (isEvaluable(srcToken.source)) {
                const fixes: string[] = srcToken.source.match(
                  /^\s*<%[~=]?\s|\s%>\s*$/g
                )!;
                let offset: number;
                if (srcToken.type === "block-scalar") {
                  const lastProp = srcToken.props[srcToken.props.length - 1];
                  offset =
                    lastProp.offset +
                    (lastProp as CST.SourceToken).source.length +
                    fixes[0].length;
                } else {
                  offset = srcToken.offset + fixes[0].length;
                }
                try {
                  const linkNodes: MemberExpression[] = [];
                  const markerNodes: MarkerNode[] = [];
                  preevaluate(srcToken.source, {
                    withParent: true,
                    hooks: {
                      beforeVisitGlobal: beforeVisitGlobalFactory(
                        linkNodes,
                        markerNodes
                      ),
                    },
                  });
                  for (const linkNode of linkNodes) {
                    lintDecorations.push({
                      start: linkNode.start! + offset,
                      end: linkNode.end! + offset,
                      options: {
                        inlineClassName: "highlight",
                      },
                    });
                  }
                  for (const markerNode of markerNodes) {
                    lintMarkers.push({
                      start: markerNode.node.start! + offset,
                      end: markerNode.node.end! + offset,
                      message: markerNode.message,
                      severity: markerNode.severity,
                      code: markerNode.code,
                    });
                  }
                } catch (e) {
                  if (e instanceof SyntaxError) {
                    const start =
                      (e as SyntaxError & { pos: number }).pos + offset;
                    lintMarkers.push({
                      start,
                      end: start + 1,
                      message: e.message,
                      severity: "Error",
                    });
                  } else {
                    // eslint-disable-next-line no-console
                    console.error("unknown expression parse error:", e);
                  }
                }
              }
              break;
            }
            case "QUOTE_SINGLE":
            case "QUOTE_DOUBLE": {
              if (isEvaluable(node.value)) {
                const fixes: string[] = node.value.match(
                  /^\s*<%[~=]?\s|\s%>\s*$/g
                )!;
                const srcToken = node.srcToken as CST.FlowScalar;
                const escapedIndexes = escapedIndexesWithQuote(
                  srcToken.source.slice(1, -1),
                  node.type
                );
                const getEscapedPosition = (
                  valuePos: number,
                  endPlus: number
                ) => {
                  const pos = valuePos + fixes[0].length;
                  let escapedCount = 0;
                  let lastEscaped = false;
                  if (escapedIndexes.length > 0) {
                    escapedCount = escapedIndexes.findIndex(
                      (index) => index >= pos
                    );
                    if (escapedCount === -1) {
                      escapedCount = escapedIndexes.length;
                    } else if (escapedIndexes[escapedCount] === pos) {
                      lastEscaped = true;
                    }
                  }
                  const start = srcToken.offset + 1 + pos + escapedCount;
                  return {
                    start,
                    end: start + endPlus + (lastEscaped ? 1 : 0),
                  };
                };
                try {
                  const linkNodes: MemberExpression[] = [];
                  const markerNodes: MarkerNode[] = [];
                  preevaluate(node.value, {
                    withParent: true,
                    hooks: {
                      beforeVisitGlobal: beforeVisitGlobalFactory(
                        linkNodes,
                        markerNodes
                      ),
                    },
                  });
                  for (const linkNode of linkNodes) {
                    lintDecorations.push({
                      start: getEscapedPosition(linkNode.start!, 0).start,
                      end: getEscapedPosition(linkNode.end!, 0).end,
                      options: {
                        inlineClassName: "highlight",
                      },
                    });
                  }
                  for (const markerNode of markerNodes) {
                    lintMarkers.push({
                      start: getEscapedPosition(markerNode.node.start!, 0)
                        .start,
                      end: getEscapedPosition(markerNode.node.end!, 0).end,
                      message: markerNode.message,
                      severity: markerNode.severity,
                      code: markerNode.code,
                    });
                  }
                } catch (e) {
                  if (e instanceof SyntaxError) {
                    const { pos } = e as SyntaxError & { pos: number };
                    lintMarkers.push({
                      ...getEscapedPosition(pos, 1),
                      message: e.message,
                      severity: "Error",
                    });
                  } else {
                    // eslint-disable-next-line no-console
                    console.error("unknown expression parse error:", e);
                  }
                }
              }
              break;
            }
          }
        }
      },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error("visit yaml doc failed:", e);
  }

  return {
    id,
    lintMarkers,
    lintDecorations,
  };
}

function escapedIndexesWithQuote(
  source: string,
  type: "QUOTE_SINGLE" | "QUOTE_DOUBLE"
) {
  const indexes: number[] = [];
  let i = 0;
  while (i < source.length - 1) {
    if (
      type === "QUOTE_SINGLE"
        ? source[i] === "'" && source[i + 1] === "'"
        : source[i] === "\\"
    ) {
      indexes.push(i - indexes.length);
      i += 2;
    } else {
      i++;
    }
  }
  return indexes;
}
