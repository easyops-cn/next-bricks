import * as t from "@babel/types";

export function transformJsxChild(child: t.JSXElement | t.StringLiteral) {
  if (child.type === "StringLiteral") {
    return t.jsxExpressionContainer(child);
  }
  return child;
}
