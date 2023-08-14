import * as t from "@babel/types";
import { isObject } from "@next-core/utils/general";
import type { BrickNode, ImportInfo } from "../interfaces.js";
import { transformBrick, transformBricks } from "./transformBricks.js";
import { transformExpressionString } from "./transformExpressionString.js";

export function transformJsonWithExpressions(
  value: unknown,
  imports: ImportInfo,
  path: string[],
  transformUseBrick?: boolean,
  key?: string
) {
  return (
    lowLevelTransformJsonWithExpressions(
      value,
      imports,
      path,
      transformUseBrick,
      key
    ) ?? t.nullLiteral()
  );
}

export function lowLevelTransformJsonWithExpressions(
  value: unknown,
  imports: ImportInfo,
  path: string[],
  transformUseBrick?: boolean,
  key?: string
): t.Expression | null {
  if (transformUseBrick && key === "useBrick") {
    if (Array.isArray(value)) {
      return transformBricks(value, imports, path);
    } else if (isObject(value)) {
      return transformBrick(value as unknown as BrickNode, imports, path);
    }
  }

  if (Array.isArray(value)) {
    return t.arrayExpression(
      value.map((v: unknown) =>
        lowLevelTransformJsonWithExpressions(
          v,
          imports,
          path,
          transformUseBrick
        )
      )
    );
  }

  if (typeof value === "function") {
    return null;
  }

  if (isObject(value)) {
    return t.objectExpression(
      Object.entries(value)
        .map(([k, v]) => {
          const vNode = lowLevelTransformJsonWithExpressions(
            v,
            imports,
            path,
            transformUseBrick,
            k
          );
          if (vNode !== null) {
            return t.objectProperty(t.stringLiteral(k), vNode);
          }
          return null;
        })
        .filter(Boolean) as t.ObjectProperty[]
    );
  }

  if (typeof value === "string") {
    const node = transformExpressionString(value, imports, path);
    return node ?? t.stringLiteral(value);
  }

  if (typeof value === "number") {
    return t.numericLiteral(value);
  }

  if (typeof value === "boolean") {
    return t.booleanLiteral(value);
  }

  if (value === null) {
    return t.nullLiteral();
  }

  return null;
}
