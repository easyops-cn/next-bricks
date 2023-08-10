import { PLACEHOLDER_PREFIX_REGEXP } from "../extract.js";

export function generateOthers(node: unknown) {
  let content = generatePlain(node);

  const usedVarNames = new Set<string>();
  const imports: string[] = [];

  content = content.replace(PLACEHOLDER_PREFIX_REGEXP, (m, p1: string) => {
    const path = p1.split("/");
    const name = path[path.length - 1];
    const baseName = name.replaceAll("-", "_").replace(/^(\d)/, "_$1");

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

export function generatePlain(node: unknown) {
  return `export default ${JSON.stringify(node)};`;
}
