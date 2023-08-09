import * as t from "@babel/types";
import { transformFromAst } from "@babel/standalone";
import { parseExpression } from "@babel/parser";
import {
  NodeType,
  PLACEHOLDER_PREFIX,
  PLACEHOLDER_PREFIX_REGEXP,
} from "./extract.js";

const REVERSED_ROUTE_KEYS: string[] = ["context", "exact", "path", "slot"];
const REVERSED_BRICK_KEYS: string[] = ["id", "ref", "slot"];
const REVERSED_TEMPLATE_KEYS: string[] = ["proxy", "state", "name"];

export function printWithPlaceholders(node: any, nodeType: NodeType) {
  switch (nodeType) {
    case "routes":
      return printRoutes(node);
    case "bricks":
      return printBricks(node);
    case "template":
      return printTemplate(node);
    default:
      return printOthers(node);
  }
}

function printRoutes(node: any[]) {
  const imports = new Set<string>();
  const fragment = t.jsxFragment(
    t.jsxOpeningFragment(),
    t.jsxClosingFragment(),
    node.map((n) => printRoute(n, imports))
  );

  return printJsx(fragment, imports);
}

function printJsx(expression: t.Expression, imports: Set<string>) {
  const exportDefault = t.exportDefaultDeclaration(expression);

  const { code } = transformFromAst(
    t.program([exportDefault], undefined, "module"),
    undefined,
    {
      generatorOpts: {
        jsescOption: {
          minimal: true,
        },
      },
    }
  );

  const usedVarNames = new Set<string>();
  const allImports = [...imports];

  const newCode = code.replace(PLACEHOLDER_PREFIX_REGEXP, (m, p1: string) => {
    const path = p1.split("/");
    const name = path[path.length - 1];
    const baseName = (
      name === "context" && path.length === 3 && path[0] === "views"
        ? `${path[path.length - 2]}_${name}`
        : name
    )
      .replaceAll("-", "_")
      .replace(/^(\d)/, "_$1");

    let counter = 2;
    let varName = baseName;
    while (usedVarNames.has(varName)) {
      varName = `${baseName}_${counter++}`;
    }
    usedVarNames.add(varName);

    allImports.push(`import ${varName} from "./${p1}.js";`);
    return varName;
  });

  return allImports.length > 0
    ? `${allImports.join("\n")}\n\n${newCode}`
    : code;
}

function printRoute(node: any, imports: Set<string>) {
  imports.add('import { Route } from "jsx";');
  const { children: _children, slot: _slot, _isRoute, ...restNode } = node;
  const children = _children ?? [];
  const slot = _slot === "" ? undefined : _slot;
  const selfClosing = children.length === 0;
  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("Route"),
      printJsxAttributes({ ...restNode, slot }, REVERSED_ROUTE_KEYS),
      selfClosing
    ),
    selfClosing ? null : t.jsxClosingElement(t.jsxIdentifier("Route")),
    children.map((child: any) => printRoute(child, imports)),
    selfClosing
  );
}

function printBricks(node: any) {
  const imports = new Set<string>();
  let expression: t.Expression;
  if (Array.isArray(node)) {
    const bricks = node
      .map((n) => printBrick(n, imports))
      .filter(Boolean) as t.JSXElement[];
    expression =
      bricks.length === 1
        ? bricks[0]
        : t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), bricks);
  } else {
    expression = printBrick(node, imports) as t.JSXElement;
    if (expression.type !== "JSXElement") {
      expression = t.jsxFragment(
        t.jsxOpeningFragment(),
        t.jsxClosingFragment(),
        [expression]
      );
    }
  }
  return printJsx(expression, imports);
}

function printBrick(node: any, imports: Set<string>) {
  if (typeof node === "string") {
    return t.jsxExpressionContainer(t.stringLiteral(node));
  }
  if (node.template) {
    return printLegacyTemplate(node, imports);
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
        imports.add(`import { ForEach } from "jsx";`);
        tagName = "ForEach";
        break;
      case ":if":
        imports.add(`import { If } from "jsx";`);
        tagName = "If";
        break;
      case ":switch":
        imports.add(`import { Switch } from "jsx";`);
        tagName = "Switch";
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

    return t.jsxElement(
      t.jsxOpeningElement(
        t.jsxIdentifier(tagName),
        [
          ...printJsxAttributes(
            {
              ...restProps,
              slot,
              events,
              lifeCycle,
              if: _if === true ? undefined : _if,
              portal,
              ref,
              ...(isControlNode
                ? {
                    value: controlDataSource,
                  }
                : null),
            },
            REVERSED_BRICK_KEYS
          ),
          ...printJsxNamespaceAttributes(
            {
              children: prop_children,
              events: prop_events,
              lifeCycle: prop_lifeCycle,
              if: prop_if,
              ref: prop_ref,
            },
            "prop"
          ),
          ...printJsxNamespaceAttributes(restNode, "conf"),
        ],
        selfClosing
      ),
      selfClosing ? null : t.jsxClosingElement(t.jsxIdentifier(tagName)),
      selfClosing
        ? []
        : children.length > 0
        ? children.map((child: any) => printBrickOrRoute(child, imports))
        : [parseJsxText(textContent)],
      selfClosing
    );
  }

  throw new Error(`Unexpected brick node: ${JSON.stringify(node)}`);
}

function printBrickOrRoute(node: any, imports: Set<string>) {
  return node._isRoute ? printRoute(node, imports) : printBrick(node, imports);
}

function printTemplate(node: any) {
  const imports = new Set<string>(['import { Component } from "jsx";']);

  const { bricks, name, state, proxy } = node;

  const tpl = t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("Component"),
      printJsxAttributes({ name, state, proxy }, REVERSED_TEMPLATE_KEYS)
    ),
    t.jsxClosingElement(t.jsxIdentifier("Component")),
    (bricks ?? []).map((brick: any) => printBrick(brick, imports))
  );

  return printJsx(tpl, imports);
}

function printLegacyTemplate(node: any, imports: Set<string>) {
  imports.add('import { LegacyTemplate } from "jsx";');
  const { children, ...restNode } = node;

  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("LegacyTemplate"),
      printJsxAttributes(restNode),
      true
    ),
    null,
    [],
    true
  );
}

function printJsxAttributes(object: object, sortKeys?: string[]) {
  const entries = Object.entries(object).filter(
    (entry) => entry[1] !== undefined
  );
  return (sortKeys ? entries.sort(getSorterByKeys(sortKeys)) : entries).map(
    ([k, v]) => {
      return t.jsxAttribute(t.jsxIdentifier(k), parseJsxAttributeValue(v));
    }
  );
}

function printJsxNamespaceAttributes(object: object, namespace: string) {
  return Object.entries(object)
    .filter((entry) => entry[1] !== undefined)
    .map(([k, v]) => {
      return t.jsxAttribute(
        t.jsxNamespacedName(t.jsxIdentifier(namespace), t.jsxIdentifier(k)),
        parseJsxAttributeValue(v)
      );
    });
}

function parseJsxAttributeValue(value: unknown) {
  if (typeof value === "string") {
    if (
      value.includes("\n") &&
      /^\s*<%[=~]?\s/.test(value) &&
      /\s%>\s*$/.test(value)
    ) {
      // Multiline expressions
      return t.jsxExpressionContainer(
        t.templateLiteral(
          [
            t.templateElement(
              {
                raw: getTemplateElementRaw(value),
              },
              true
            ),
          ],
          []
        )
      );
    } else {
      const stringLiteral = t.stringLiteral(value);
      return value.includes(PLACEHOLDER_PREFIX) ||
        JSON.stringify(value).replaceAll('\\"', "").includes("\\")
        ? t.jsxExpressionContainer(stringLiteral)
        : stringLiteral;
    }
  }
  if (value === true) {
    return null;
  }
  const expr = parseExpression(JSON.stringify(value));
  return t.jsxExpressionContainer(expr);
}

function parseJsxText(text: string) {
  if (/>|<|&(?:[a-zA-Z0-9]+|#\d+|#x[\da-fA-F]+);/.test(text)) {
    return t.jsxExpressionContainer(t.stringLiteral(text));
  }
  return t.jsxText(text);
}

function getTemplateElementRaw(cooked: string): string {
  const chunks: string[] = [];
  const cookedChars = [...cooked];
  let i = 0;
  for (const char of cookedChars) {
    if (
      char === "`" ||
      char === "\\" ||
      (char === "$" && cookedChars[i + 1] === "{")
    ) {
      chunks.push(`\\${char}`);
    } else {
      chunks.push(char);
    }
    i++;
  }
  return chunks.join("");
}

function printOthers(node: unknown) {
  let content = `export default ${JSON.stringify(node, null, 2)}`;
  const usedVarNames = new Set<string>();
  const imports: string[] = [];

  content = content.replace(PLACEHOLDER_PREFIX_REGEXP, (m, p1: string) => {
    const path = p1.split("/");
    const name = path[path.length - 1];
    const baseName = name.replaceAll("-", "_").replace(/^(\d)/, "_$1");

    let counter = 2;
    let varName = baseName;
    while (usedVarNames.has(varName)) {
      varName = `${baseName}_${counter++}`;
    }
    usedVarNames.add(varName);

    imports.push(`import ${varName} from "./${p1}.js";`);
    return varName;
  });

  if (imports.length > 0) {
    content = `${imports.join("\n")}\n\n${content}`;
  }

  return content;
}

function getSorterByKeys(keys: string[]) {
  return function sorter(a: [string, unknown], b: [string, unknown]) {
    return keys.indexOf(b[0]) - keys.indexOf(a[0]);
  };
}
