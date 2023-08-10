import type { BrickNode, ImportInfo } from "../interfaces.js";
import {
  transformBrick,
  transformBricks,
} from "../transformers/transformBricks.js";
import { generateJsx } from "./generateJsx.js";

export function generateBricks(node: BrickNode | BrickNode[], path: string[]) {
  const imports: ImportInfo = new Map();
  const expression = Array.isArray(node)
    ? transformBricks(node, imports, path)
    : transformBrick(node, imports, path);
  return generateJsx(expression, imports);
}
