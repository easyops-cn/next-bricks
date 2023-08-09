import * as t from "@babel/types";
import { transform, transformFromAst } from "@babel/standalone";
import { isObject } from "@next-core/utils/general";
import {
  NodeType,
  PLACEHOLDER_PREFIX,
  PLACEHOLDER_PREFIX_REGEXP,
} from "./extract.js";

const REVERSED_ROUTE_KEYS: string[] = ["context", "exact", "path", "slot"];
const REVERSED_BRICK_KEYS: string[] = ["id", "ref", "slot"];
const REVERSED_TEMPLATE_KEYS: string[] = ["proxy", "state", "name"];

const IMPORT_DEFAULT_PREFIX = "default:";
type ImportInfo = Map<string, Set<string>>;

export function printWithPlaceholders(
  node: any,
  nodeType: NodeType,
  path: string[]
) {
  switch (nodeType) {
    case "routes":
      return printRoutes(node, path);
    case "bricks":
      return printBricks(node, path);
    case "template":
      return printTemplate(node, path);
    case "context":
    case "menu":
      return printWithExpressions(node, path);
    case "plain": // Template proxy
      return printPlain(node);
    case "others": // Templates index
      return printOthers(node);
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }
}

function printRoutes(node: any[], path: string[]) {
  const imports: ImportInfo = new Map();
  const fragment = t.jsxFragment(
    t.jsxOpeningFragment(),
    t.jsxClosingFragment(),
    node.map((n) => printRoute(n, imports, path))
  );

  return printJsx(fragment, imports);
}

function printJsx(expression: t.Expression, imports: ImportInfo) {
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

  const usedVarNames = getVarNamesByImports(imports);
  const allImports = printImports(imports);

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

function addImport(imports: ImportInfo, from: string, name: string): void {
  let imp = imports.get(from);
  if (!imp) {
    imp = new Set();
    imports.set(from, imp);
  }
  imp.add(name);
}

function printImports(imports: ImportInfo): string[] {
  return [...imports]
    .sort((a, b) => Number(a[0].startsWith(".")) - Number(b[0].startsWith(".")))
    .map(([from, names]) => {
      const importNames = [...names];
      if (
        importNames.length === 1 &&
        importNames[0].startsWith(IMPORT_DEFAULT_PREFIX)
      ) {
        return `import ${importNames[0].substring(
          IMPORT_DEFAULT_PREFIX.length
        )} from "${from}";`;
      }
      return `import { ${importNames.join(", ")} } from "${from}";`;
    });
}

function getVarNamesByImports(imports: ImportInfo): Set<string> {
  const names = new Set<string>();
  for (const importNames of imports.values()) {
    for (const name of importNames) {
      names.add(
        name.startsWith(IMPORT_DEFAULT_PREFIX)
          ? name.substring(IMPORT_DEFAULT_PREFIX.length)
          : name
      );
    }
  }
  return names;
}

function printRoute(node: any, imports: ImportInfo, path: string[]) {
  addImport(imports, "jsx", "Route");
  const { children: _children, slot: _slot, _isRoute, ...restNode } = node;
  const children = _children ?? [];
  const slot = _slot === "" ? undefined : _slot;
  const selfClosing = children.length === 0;
  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("Route"),
      printJsxAttributes(
        { ...restNode, slot },
        imports,
        path,
        REVERSED_ROUTE_KEYS
      ),
      selfClosing
    ),
    selfClosing ? null : t.jsxClosingElement(t.jsxIdentifier("Route")),
    children.map((child: any) => printRoute(child, imports, path)),
    selfClosing
  );
}

function printBricks(node: any, path: string[]) {
  const imports: ImportInfo = new Map();
  let expression: t.Expression;
  if (Array.isArray(node)) {
    const bricks = node
      .map((n) => printBrick(n, imports, path))
      .filter(Boolean) as t.JSXElement[];
    expression =
      bricks.length === 1
        ? bricks[0]
        : t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), bricks);
  } else {
    expression = printBrick(node, imports, path) as t.JSXElement;
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

function printBrick(node: any, imports: ImportInfo, path: string[]) {
  if (typeof node === "string") {
    return t.jsxExpressionContainer(t.stringLiteral(node));
  }
  if (node.template) {
    return printLegacyTemplate(node, imports, path);
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
        addImport(imports, "jsx", tagName);
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
            imports,
            path,
            REVERSED_BRICK_KEYS
          ),
          ...printJsxAttributes(
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
          ...printJsxAttributes(restNode, imports, path, undefined, "conf"),
        ],
        selfClosing
      ),
      selfClosing ? null : t.jsxClosingElement(t.jsxIdentifier(tagName)),
      selfClosing
        ? []
        : children.length > 0
        ? children.map((child: any) => printBrickOrRoute(child, imports, path))
        : [parseJsxText(textContent)],
      selfClosing
    );
  }

  throw new Error(`Unexpected brick node: ${JSON.stringify(node)}`);
}

function printBrickOrRoute(node: any, imports: ImportInfo, path: string[]) {
  return (node._isRoute ? printRoute : printBrick)(node, imports, path);
}

function printTemplate(node: any, path: string[]) {
  const imports: ImportInfo = new Map();
  addImport(imports, "jsx", "Component");

  const { bricks, name, state, proxy } = node;

  const tpl = t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("Component"),
      printJsxAttributes(
        { name, state, proxy },
        imports,
        path,
        REVERSED_TEMPLATE_KEYS
      )
    ),
    t.jsxClosingElement(t.jsxIdentifier("Component")),
    (bricks ?? []).map((brick: any) => printBrick(brick, imports, path))
  );

  return printJsx(tpl, imports);
}

function printLegacyTemplate(node: any, imports: ImportInfo, path: string[]) {
  addImport(imports, "jsx", "LegacyTemplate");
  const { children, ...restNode } = node;

  return t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("LegacyTemplate"),
      printJsxAttributes(restNode, imports, path),
      true
    ),
    null,
    [],
    true
  );
}

function printJsxAttributes(
  object: object,
  imports: ImportInfo,
  path: string[],
  sortKeys?: string[],
  namespace?: string
) {
  const normalEntries: [string, any][] = [];
  const restProperties: t.ObjectProperty[] = [];
  for (const [k, v] of Object.entries(object)) {
    if (v !== undefined) {
      if (/^[_$a-zA-Z][$\w]*$/.test(k)) {
        normalEntries.push([k, v]);
      } else {
        restProperties.push(
          t.objectProperty(
            t.stringLiteral(namespace ? `${namespace}:${k}` : k),
            transformExpressionStringInJson(v, imports, path) ?? t.nullLiteral()
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
      parseJsxAttributeValue(v, imports, path)
    );
  });
  if (restProperties.length > 0) {
    attrs.push(t.jsxSpreadAttribute(t.objectExpression(restProperties)));
  }
  return attrs;
}

function parseJsxAttributeValue(
  value: unknown,
  imports: ImportInfo,
  path: string[]
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
  const expr =
    transformExpressionStringInJson(value, imports, path) ?? t.nullLiteral();
  return t.jsxExpressionContainer(expr);
}

function parseJsxText(text: string) {
  if (/>|<|&(?:[a-zA-Z0-9]+|#\d+|#x[\da-fA-F]+);/.test(text)) {
    return t.jsxExpressionContainer(t.stringLiteral(text));
  }
  return t.jsxText(text);
}

function printWithExpressions(node: unknown, path: string[]) {
  const imports: ImportInfo = new Map();
  const exportDefault = t.exportDefaultDeclaration(
    transformExpressionStringInJson(node, imports, path) ?? t.nullLiteral()
  );
  const ast = t.program([exportDefault], undefined, "module");
  const allImports = printImports(imports);
  const content = transformFromAst(ast, undefined, {
    generatorOpts: {
      jsescOption: {
        minimal: true,
      },
    },
  }).code;
  if (allImports.length > 0) {
    return `${allImports.join("\n")}\n\n${content}`;
  }
  return content;
}

function printPlain(node: unknown) {
  return `export default ${JSON.stringify(node)};`;
}

function printOthers(node: unknown) {
  let content = printPlain(node);

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

function transformExpressionStringInJson(
  value: unknown,
  imports: ImportInfo,
  path: string[]
):
  | t.ArrayExpression
  | t.ObjectExpression
  | t.CallExpression
  | t.StringLiteral
  | t.NumericLiteral
  | t.BooleanLiteral
  | t.NullLiteral
  | null {
  if (Array.isArray(value)) {
    return t.arrayExpression(
      value.map((v: unknown) =>
        transformExpressionStringInJson(v, imports, path)
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
          const vNode = transformExpressionStringInJson(v, imports, path);
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

function transformExpressionString(
  value: string,
  imports: ImportInfo,
  path: string[]
) {
  if (/^\s*<%[~=]?\s/.test(value) && /\s%>\s*$/.test(value)) {
    // Turn “<% CTX.abc %>” into “E`${ abc }`”
    let flag = "";
    const source = value.replace(
      /^\s*<%([~=])?\s|\s%>\s*$/g,
      (m, p1: string) => {
        if (p1) {
          flag = p1;
        }
        return "";
      }
    );

    try {
      const file = transform(`(${source})`, { ast: true }).ast;
      const ast = (file.program.body[0] as t.ExpressionStatement).expression;
      const node = t.callExpression(t.identifier("Expr"), [
        ...(flag ? [t.stringLiteral(flag)] : []),
        ...(ast.type === "SequenceExpression" ? ast.expressions : [ast]),
      ]);
      if (/\bFN\b/.test(source)) {
        const targetPath = ["resources", "functions", "index.js"];
        let relative = 0;
        for (let i = 0; i < targetPath.length && i < path.length; i++) {
          relative = i;
          if (path[i] !== targetPath[i]) {
            break;
          }
        }
        addImport(
          imports,
          `${
            path.length === 1
              ? "."
              : new Array(path.length - 1 - relative).fill("..").join("/")
          }/${targetPath.slice(relative).join("/")}`,
          "default:FN"
        );
      }
      addImport(imports, "jsx", "Expr");
      return node;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Parse expression failed:", value, e);
    }
  }
  return null;
}

function getSorterByKeys(keys: string[]) {
  return function sorter(a: [string, unknown], b: [string, unknown]) {
    return keys.indexOf(b[0]) - keys.indexOf(a[0]);
  };
}
