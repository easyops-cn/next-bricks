import * as t from "@babel/types";
import { transform, registerPlugin, availablePlugins } from "@babel/standalone";
import type { ImportInfo } from "../interfaces.js";
import { addImport } from "../handleImports.js";

const PipelineOperatorMinimal = "transform-pipeline-operator-minimal";
registerPlugin(PipelineOperatorMinimal, {
  name: PipelineOperatorMinimal,
  inherits: availablePlugins["syntax-pipeline-operator"],
  visitor: {
    BinaryExpression(path) {
      const { node } = path;
      const { operator, left, right } = node;
      if (operator !== "|>") return;
      const call = t.callExpression(right, [left as t.Expression]);
      path.replaceWith(call);
    },
  },
});

export function transformExpressionString(
  value: string,
  imports: ImportInfo,
  path: string[]
) {
  if (/^\s*<%[~=]?\s/.test(value) && /\s%>\s*$/.test(value)) {
    // Turn `"<% CTX.abc %>"` into `Expr(abc)`
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
      const file = transform(`(${source})`, {
        ast: true,
        code: false,
        plugins: [[PipelineOperatorMinimal, { proposal: "minimal" }]],
      }).ast;
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
