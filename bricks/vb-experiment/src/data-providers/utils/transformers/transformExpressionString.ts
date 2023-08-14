import * as t from "@babel/types";
import { transform } from "@babel/standalone";
import type { ImportInfo } from "../interfaces.js";
import { addImport } from "../handleImports.js";
import TransformPipelineOperatorMinimal from "../plugins/pipeline-operator-minimal.js";
import SmartImports from "../plugins/smart-imports.js";

export function transformExpressionString(
  value: string,
  imports: ImportInfo,
  path: string[]
) {
  if (/^\s*<%[~=]?\s/.test(value) && /\s%>\s*$/.test(value)) {
    try {
      // Turn `"<% CTX.abc %>"` into `CTX.abc`
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

      let bind = flag === "=";
      const recursive = flag === "~";

      const inferredImports = new Set<string>();
      const file = transform(`(${source})`, {
        ast: true,
        code: false,
        plugins: [
          [TransformPipelineOperatorMinimal, { proposal: "minimal" }],
          [SmartImports, { imports: inferredImports }],
        ],
      }).ast as t.File;
      let ast = (file.program.body[0] as t.ExpressionStatement).expression;

      let firstExpr: t.Expression;
      if (
        ast.type === "SequenceExpression" &&
        ((firstExpr = ast.expressions[0]),
        firstExpr.type === "StringLiteral") &&
        (firstExpr.value === "track context" ||
          firstExpr.value === "track state")
      ) {
        if (!bind) {
          bind = true;
          ast =
            ast.expressions.length > 2
              ? t.sequenceExpression(ast.expressions.slice(1))
              : ast.expressions[1];
        }
      }

      if (
        bind &&
        !inferredImports.has("STATE") &&
        !inferredImports.has("CTX")
      ) {
        bind = false;
      }

      for (const name of inferredImports) {
        if (name === "FN") {
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
        } else {
          addImport(imports, "next-jsx/runtime", name);
        }
      }

      if (recursive) {
        addImport(imports, "next-jsx/runtime", "recursive");
        ast = t.callExpression(t.identifier("recursive"), [ast]);
      }

      if (bind) {
        addImport(imports, "next-jsx/runtime", "bind");
        ast = t.callExpression(t.identifier("bind"), [ast]);
      }

      return ast;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Parse expression failed:", value, e);
    }
  }
  return null;
}
