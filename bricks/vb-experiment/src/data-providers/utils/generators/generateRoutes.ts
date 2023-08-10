import * as t from "@babel/types";
import type { ImportInfo } from "../interfaces.js";
import { transformRoute } from "../transformers/transformRoute.js";
import { generateJsx } from "./generateJsx.js";

export function generateRoutes(node: any[], path: string[]) {
  const imports: ImportInfo = new Map();
  const fragment = t.jsxFragment(
    t.jsxOpeningFragment(),
    t.jsxClosingFragment(),
    node.map((n) => transformRoute(n, imports, path))
  );

  return generateJsx(fragment, imports);
}
