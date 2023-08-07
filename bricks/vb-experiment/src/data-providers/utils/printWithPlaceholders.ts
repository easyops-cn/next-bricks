import { NodeType, PLACEHOLDER_PREFIX } from "./extract.js";

export function printWithPlaceholders(node: unknown, nodeType: NodeType) {
  let content = `export default ${JSON.stringify(node, null, 2)}`;
  const regexp = new RegExp(
    `"${PLACEHOLDER_PREFIX}((?:[-\\w]+/)*[-\\w]+)"`,
    "g"
  );

  const usedVarNames = new Set<string>();
  const imports: string[] = [];

  content = content.replace(regexp, (m, p1: string) => {
    const path = p1.split("/");
    const name = path[path.length - 1];
    const baseName = (
      nodeType === "routes" && name === "context" && path.length > 1
        ? `${path[path.length - 2]}_${name}`
        : name
    ).replaceAll("-", "_");

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
