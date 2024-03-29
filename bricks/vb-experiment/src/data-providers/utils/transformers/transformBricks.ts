import * as t from "@babel/types";
import type { BrickNode, BrickNormalNode, ImportInfo } from "../interfaces.js";
import { addImport } from "../handleImports.js";
import { transformJsxAttributes } from "./transformJsxAttributes.js";
import { transformRoute } from "./transformRoute.js";
import { transformJsxChild } from "./transformJsxChild.js";
import { transformExpressionString } from "./transformExpressionString.js";

export function transformBricks(
  node: BrickNode[],
  imports: ImportInfo,
  path: string[]
): t.StringLiteral | t.JSXElement | t.JSXFragment {
  const bricks = node.map((n) => transformBrick(n, imports, path));
  return bricks.length === 1
    ? bricks[0]
    : t.jsxFragment(
        t.jsxOpeningFragment(),
        t.jsxClosingFragment(),
        bricks.map(transformJsxChild)
      );
}

export function transformBrick(
  node: BrickNode,
  imports: ImportInfo,
  path: string[]
): t.StringLiteral | t.JSXElement {
  if (typeof node === "string") {
    return t.stringLiteral(node);
  }
  if (node.template) {
    return transformLegacyTemplate(node, imports, path);
  }
  const {
    brick,
    children,
    properties,
    events,
    lifeCycle,
    if: _if,
    portal,
    ref,
    slot: _slot,
    ...restNode
  } = node;
  if (typeof brick === "string") {
    let tagName: string;
    let isControlNode = true;
    switch (brick) {
      case ":forEach":
      case ":if":
      case ":switch":
        tagName = `${brick[1].toUpperCase()}${brick.substring(2)}`;
        addImport(imports, "next-jsx", tagName);
        break;
      default:
        isControlNode = false;
        tagName = brick.replaceAll(".", "_");
    }
    let controlDataSource: unknown;
    if (isControlNode) {
      controlDataSource = restNode.dataSource;
      delete restNode.dataSource;
    }
    const slot = _slot === "" ? undefined : _slot;
    const props = properties ?? {};
    const {
      textContent,
      children: prop_children,
      events: prop_events,
      lifeCycle: prop_lifeCycle,
      if: prop_if,
      ref: prop_ref,
      id: prop_id,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      slot: prop_slot,
      ...restProps
    } = props;
    const hasTextContent = typeof textContent === "string";

    const selfClosing = children.length === 0 && !hasTextContent;

    if (children.length > 0 && hasTextContent) {
      // eslint-disable-next-line no-console
      console.warn(
        "Invalid brick: mix slotted children and textContent:",
        node
      );
    }

    const opening = t.jsxOpeningElement(
      t.jsxIdentifier(tagName),
      [
        ...transformJsxAttributes(
          {
            if: _if === true ? undefined : _if,
            slot,
            ref,
            id: prop_id,
            ...(isControlNode
              ? {
                  value: controlDataSource,
                }
              : null),
          },
          imports,
          path
        ),
        ...transformJsxAttributes(
          restProps,
          imports,
          path,
          undefined,
          undefined,
          true
        ),
        ...transformJsxAttributes(
          {
            events,
            lifeCycle,
            portal,
          },
          imports,
          path
        ),
        ...transformJsxAttributes(
          {
            children: prop_children,
            events: prop_events,
            lifeCycle: prop_lifeCycle,
            if: prop_if,
            ref: prop_ref,
          },
          imports,
          path,
          undefined,
          "prop"
        ),
        ...transformJsxAttributes(restNode, imports, path, undefined, "conf"),
      ],
      selfClosing
    );

    const closing = selfClosing
      ? null
      : t.jsxClosingElement(t.jsxIdentifier(tagName));

    let childElements: (
      | t.JSXText
      | t.JSXExpressionContainer
      | t.JSXSpreadChild
      | t.JSXElement
      | t.JSXFragment
    )[];
    if (selfClosing) {
      childElements = [];
    } else if (children.length > 0) {
      childElements = children.map((child) =>
        typeof child !== "string" && child._isRoute
          ? transformRoute(child, imports, path)
          : transformJsxChild(transformBrick(child, imports, path))
      );
    } else {
      childElements = [transformJsxText(textContent as string, imports, path)];
    }

    return t.jsxElement(opening, closing, childElements, selfClosing);
  }

  throw new Error(`Unexpected brick node: ${JSON.stringify(node)}`);
}

function transformLegacyTemplate(
  node: BrickNormalNode,
  imports: ImportInfo,
  path: string[]
) {
  addImport(imports, "next-jsx", "LegacyTemplate");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...restNode } = node;

  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("LegacyTemplate"),
      transformJsxAttributes(restNode, imports, path),
      true
    ),
    null,
    [],
    true
  );
}

function transformJsxText(text: string, imports: ImportInfo, path: string[]) {
  const expr = transformExpressionString(text, imports, path);
  if (expr) {
    return t.jsxExpressionContainer(expr);
  }
  if (/[{}<>]|&(?:[a-zA-Z0-9]+|#\d+|#x[\da-fA-F]+);/.test(text)) {
    return t.jsxExpressionContainer(t.stringLiteral(text));
  }
  return t.jsxText(text);
}
