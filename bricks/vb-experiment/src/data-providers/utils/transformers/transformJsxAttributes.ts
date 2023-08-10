import * as t from "@babel/types";
import { isObject } from "@next-core/utils/general";
import type { BrickNode, ImportInfo } from "../interfaces.js";
import { PLACEHOLDER_PREFIX } from "../extract.js";
import { transformJsonWithExpressions } from "./transformJsonWithExpressions.js";
import { transformExpressionString } from "./transformExpressionString.js";
import { transformBrick, transformBricks } from "./transformBricks.js";

export function transformJsxAttributes(
  object: object,
  imports: ImportInfo,
  path: string[],
  sortKeys?: string[],
  namespace?: string,
  transformUseBrick?: boolean
) {
  const normalEntries: [string, unknown][] = [];
  const restProperties: t.ObjectProperty[] = [];
  for (const [k, v] of Object.entries(object)) {
    if (v !== undefined) {
      if (/^[_$a-zA-Z][$\w]*$/.test(k)) {
        normalEntries.push([k, v]);
      } else {
        restProperties.push(
          t.objectProperty(
            t.stringLiteral(namespace ? `${namespace}:${k}` : k),
            transformJsonWithExpressions(v, imports, path)
          )
        );
      }
    }
  }
  const attrs: (t.JSXAttribute | t.JSXSpreadAttribute)[] = (
    sortKeys ? normalEntries.sort(getSorterByKeys(sortKeys)) : normalEntries
  ).map(([k, v]) => {
    return t.jsxAttribute(
      namespace
        ? t.jsxNamespacedName(t.jsxIdentifier(namespace), t.jsxIdentifier(k))
        : t.jsxIdentifier(k),
      transformJsxAttributeValue(
        v,
        imports,
        path,
        transformUseBrick ? k : undefined
      )
    );
  });
  if (restProperties.length > 0) {
    attrs.push(t.jsxSpreadAttribute(t.objectExpression(restProperties)));
  }
  return attrs;
}

function transformJsxAttributeValue(
  value: unknown,
  imports: ImportInfo,
  path: string[],
  key?: string
) {
  if (typeof value === "string") {
    const expr = transformExpressionString(value, imports, path);
    if (expr) {
      return t.jsxExpressionContainer(expr);
    }

    const stringLiteral = t.stringLiteral(value);
    return value.includes(PLACEHOLDER_PREFIX) ||
      JSON.stringify(value).includes("\\")
      ? t.jsxExpressionContainer(stringLiteral)
      : stringLiteral;
  }
  if (value === true) {
    return null;
  }
  if (key === "useBrick") {
    if (Array.isArray(value)) {
      return transformJsxValue(
        transformBricks(value as BrickNode[], imports, path)
      );
    } else if (isObject(value)) {
      return transformJsxValue(
        transformBrick(value as unknown as BrickNode, imports, path)
      );
    }
  }
  const expr = transformJsonWithExpressions(value, imports, path, true);
  return t.jsxExpressionContainer(expr);
}

function transformJsxValue(
  value: t.JSXElement | t.JSXFragment | t.StringLiteral
) {
  if (value.type !== "StringLiteral") {
    return t.jsxExpressionContainer(value);
  }
  return value;
}

function getSorterByKeys(keys: string[]) {
  return function sorter(a: [string, unknown], b: [string, unknown]) {
    return keys.indexOf(b[0]) - keys.indexOf(a[0]);
  };
}
