import * as t from "@babel/types";
import { transformFromAst } from "@babel/standalone";
import type { ImportInfo } from "../interfaces.js";
import { PLACEHOLDER_PREFIX_REGEXP } from "../extract.js";
import { generateImports, getVarNamesByImports } from "../handleImports.js";
import { JS_RESERVED_WORDS } from "../constants.js";

export function generateJsx(
  expression: t.Expression,
  imports: ImportInfo
): string {
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
      cloneInputAst: false,
    }
  ) as { code: string };

  const usedVarNames = getVarNamesByImports(imports);
  const allImports = generateImports(imports);

  const newCode = code!.replace(PLACEHOLDER_PREFIX_REGEXP, (m, p1: string) => {
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
    while (usedVarNames.has(varName) || JS_RESERVED_WORDS.has(varName)) {
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
