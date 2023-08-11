import * as t from "@babel/types";
import { transformFromAst } from "@babel/standalone";
import type { ImportInfo } from "../interfaces.js";
import { generateImports } from "../handleImports.js";
import { transformJsonWithExpressions } from "../transformers/transformJsonWithExpressions.js";

export function generateJsWithExpressions(
  node: unknown,
  path: string[]
): string {
  const imports: ImportInfo = new Map();
  const exportDefault = t.exportDefaultDeclaration(
    transformJsonWithExpressions(node, imports, path)
  );
  const ast = t.program([exportDefault], undefined, "module");
  const allImports = generateImports(imports);
  const content = transformFromAst(ast, undefined, {
    generatorOpts: {
      jsescOption: {
        minimal: true,
      },
    },
    cloneInputAst: false,
  }).code as string;
  if (allImports.length > 0) {
    return `${allImports.join("\n")}\n\n${content}`;
  }
  return content;
}
