import * as t from "@babel/types";
import type { ImportInfo } from "../interfaces.js";
import { generateJsx } from "./generateJsx.js";
import { addImport } from "../handleImports.js";
import { transformJsxAttributes } from "../transformers/transformJsxAttributes.js";
import { REVERSED_TEMPLATE_KEYS } from "../constants.js";
import { transformBrick } from "../transformers/transformBricks.js";
import { transformJsxChild } from "../transformers/transformJsxChild.js";

export function generateTemplate(node: any, path: string[]) {
  const imports: ImportInfo = new Map();
  addImport(imports, "next-jsx", "Component");

  const { bricks, name, state, proxy } = node;

  const tpl = t.jsxElement(
    t.jsxOpeningElement(
      t.jsxIdentifier("Component"),
      transformJsxAttributes(
        { name, state, proxy },
        imports,
        path,
        REVERSED_TEMPLATE_KEYS
      )
    ),
    t.jsxClosingElement(t.jsxIdentifier("Component")),
    (bricks ?? []).map((brick: any) =>
      transformJsxChild(transformBrick(brick, imports, path))
    )
  );

  return generateJsx(tpl, imports);
}
