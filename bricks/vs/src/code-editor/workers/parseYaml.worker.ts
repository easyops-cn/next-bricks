import type { MemberExpression, Identifier } from "@babel/types";
import type * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import BrickNextYamlSourceMap, { Token } from "../utils/brickNextSourceMap.js";
import type { Marker } from "../index.jsx";
import { EVALUATE_KEYWORD, Level } from "../utils/constants.js";

async function init() {
  const yaml = await import("js-yaml");
  const { preevaluate } = await import("@next-core/cook");

  // eslint-disable-next-line no-console
  console.log("init worker!");
  return {
    yaml,
    preevaluate,
  };
}

const { yaml, preevaluate } = await init();

self.onmessage = onMessage;

function onMessage(message: MessageEvent): void {
  const { token, data, id } = message.data;
  switch (token) {
    case "parse_yaml": {
      const result = parseYaml(data.value, data.links, data.markers);
      self.postMessage({
        token: "parse_yaml",
        data: result,
        id,
      });
      break;
    }
  }
}

function parseYaml(value: string, links: string[], markers: Marker[]) {
  const map = new BrickNextYamlSourceMap();
  let parseValue = undefined;
  let modelMarkers: monaco.editor.IMarkerData[] = [];
  const tokens: Omit<Token & { token: string; property: string }, "source">[] =
    [];
  try {
    parseValue = yaml.load(value, {
      listener: map.listen(),
    });

    if (links || markers) {
      map.getTokens().forEach((item) => {
        const { startLineNumber, endLineNumber, startColumn } = item;
        const globalNodes: MemberExpression[] = [];
        const result = preevaluate(item.source, {
          hooks: {
            beforeVisit(node) {
              if (
                node.type === "MemberExpression" &&
                node.object.type === "Identifier" &&
                EVALUATE_KEYWORD.includes(node.object.name) &&
                node.property.type === "Identifier"
              ) {
                globalNodes.push(node);
              }
            },
          },
        });

        globalNodes.forEach((node) => {
          const { start, end, loc } = node;
          if (item.startLineNumber !== item.endLineNumber) {
            const hadWrap = /<%[ ]+/.test(result.prefix);
            tokens.push({
              token: (node.object as Identifier)?.name,
              property: (node.property as Identifier).name,
              startLineNumber:
                item.startLineNumber +
                (loc?.start?.line as number) -
                Number(hadWrap),
              endLineNumber:
                item.startLineNumber +
                (loc?.end?.line as number) -
                Number(hadWrap),
              startColumn:
                (hadWrap && loc?.start.line === 1 ? result.prefix.length : 0) +
                (loc?.start?.column as number) +
                1,
              endColumn:
                (hadWrap && loc?.start.line === 1 ? result.prefix.length : 0) +
                (loc?.end?.column as number) +
                1,
            });
          } else {
            tokens.push({
              token: (node.object as Identifier)?.name,
              property: (node.property as Identifier).name,
              startLineNumber,
              endLineNumber,
              startColumn:
                startColumn +
                (start as number) +
                result.prefix?.length +
                Number(!item.isString),
              endColumn:
                startColumn +
                (end as number) +
                result.prefix?.length +
                Number(!item.isString),
            });
          }
        });
      });

      if (markers) {
        modelMarkers = tokens
          .map((token) => {
            const matchTokenConf = markers.find(
              (item) => item.token === token.token
            );
            const hadProperty = matchTokenConf?.params
              ? matchTokenConf.params?.includes(token.property)
              : true;
            if (!hadProperty) {
              return {
                severity: Level.warn,
                message: "Miss Property",
                startLineNumber: token.startLineNumber,
                endLineNumber: token.endLineNumber,
                startColumn: token.startColumn,
                endColumn: token.endColumn,
              };
            }
            if (matchTokenConf && matchTokenConf.message) {
              return {
                severity: Level[matchTokenConf?.level ?? "warn"],
                message: matchTokenConf.message,
                ...(matchTokenConf.code
                  ? {
                      code: {
                        value: matchTokenConf.code.value,
                        target: matchTokenConf.code.target,
                      },
                    }
                  : {}),
                startLineNumber: token.startLineNumber,
                endLineNumber: token.endLineNumber,
                startColumn: token.startColumn,
                endColumn: token.endColumn,
              };
            }
          })
          .filter(Boolean) as monaco.editor.IMarkerData[];
      }
    }
  } catch {
    self.postMessage({
      token: "parse_yaml_error",
    });
  }
  return {
    value: parseValue,
    tokens: tokens.filter((token) => links?.includes(token.token)),
    markers: modelMarkers,
  };
}
