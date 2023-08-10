import * as t from "@babel/types";
import type { ImportInfo, RouteNode } from "../interfaces.js";
import { addImport } from "../handleImports.js";
import { transformJsxAttributes } from "./transformJsxAttributes.js";
import { REVERSED_ROUTE_KEYS } from "../constants.js";

export function transformRoute(
  node: RouteNode,
  imports: ImportInfo,
  path: string[]
): t.JSXElement {
  addImport(imports, "jsx", "Route");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children: _children, slot: _slot, _isRoute, ...restNode } = node;
  const children = _children ?? [];
  const slot = _slot === "" ? undefined : _slot;
  const selfClosing = children.length === 0;
  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("Route"),
      transformJsxAttributes(
        { ...restNode, slot },
        imports,
        path,
        REVERSED_ROUTE_KEYS
      ),
      selfClosing
    ),
    selfClosing ? null : t.jsxClosingElement(t.jsxIdentifier("Route")),
    children.map((child) => transformRoute(child, imports, path)),
    selfClosing
  );
}
