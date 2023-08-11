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
    // Turn `"<% CTX.abc %>"` into `use(() => CTX.abc)`
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

      // Transfer
      let firstExpr: t.Expression;
      if (
        !flag &&
        ast.type === "SequenceExpression" &&
        ((firstExpr = ast.expressions[0]),
        firstExpr.type === "StringLiteral") &&
        (firstExpr.value === "track context" ||
          firstExpr.value === "track state")
      ) {
        flag = "=";
        ast =
          ast.expressions.length > 2
            ? t.sequenceExpression(ast.expressions.slice(1))
            : ast.expressions[1];
      }

      const node = t.callExpression(t.identifier("use"), [
        ...(flag ? [t.stringLiteral(flag)] : []),
        t.arrowFunctionExpression([], ast),
      ]);

      addImport(imports, "jsx", "use");

      for (const name of inferredImports) {
        switch (name) {
          case "FN": {
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
            break;
          }
          case "_":
            addImport(imports, "lodash", "default:_");
            break;
          case "moment":
            addImport(imports, "moment", "default:moment");
            break;
          case "PIPES":
            addImport(
              imports,
              "@easyops-cn/brick-next-pipes",
              "pipes as PIPES"
            );
            break;
        }
      }

      return node;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn("Parse expression failed:", value, e);
    }
  }
  return null;
}
