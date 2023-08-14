import { NodeType } from "../extract.js";
import { generateBricks } from "./generateBricks.js";
import { generateJsWithExpressions } from "./generateJsWithExpressions.js";
import { generateOthers, generatePlain } from "./generateOthers.js";
import { generateRoutes } from "./generateRoutes.js";
import { generateTemplate } from "./generateTemplate.js";

export function generate(
  node: any,
  nodeType: NodeType,
  path: string[]
): string {
  switch (nodeType) {
    case "routes":
      return generateRoutes(node, path);
    case "bricks":
      return generateBricks(node, path);
    case "template":
      return generateTemplate(node, path);
    case "context":
    case "menu":
      return generateJsWithExpressions(node, path);
    case "plain": // Template proxy
      return generatePlain(node);
    case "others": // Templates index
      return generateOthers(node);
    default:
      throw new Error(`Unknown node type: ${nodeType}`);
  }
}
