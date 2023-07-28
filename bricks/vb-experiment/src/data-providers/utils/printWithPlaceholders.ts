import type { SourceFileOrFolder, SourceFolder } from "./buildFileStructure.js";
import { PLACEHOLDER_PREFIX } from "./extract.js";

export function printWithPlaceholders(
  node: unknown,
  siblings: SourceFileOrFolder[]
) {
  let content = `export default ${JSON.stringify(node, null, 2)}`;
  const regexp = new RegExp(
    `"${PLACEHOLDER_PREFIX}(?:([-\\w]+)/)?([-\\w]+)"`,
    "g"
  );

  const imports: string[] = [];
  content = content.replace(regexp, (m, p1: string | undefined, p2: string) => {
    const varName =
      p1 === "routes"
        ? `Route_${p2}`
        : p1 === "bricks"
        ? `Brick_${p2}`
        : p1 === "templates"
        ? p2.replaceAll("-", "_")
        : p2;
    const importFolder =
      p1 &&
      (
        siblings.find((f) => f.type === "folder" && f.name === p1) as
          | SourceFolder
          | undefined
      )?.items.some((f) => f.type === "folder" && f.name === p2);
    imports.push(
      `import ${varName} from "./${p1 ? `${p1}/` : ""}${p2}${
        importFolder ? "/index" : ""
      }.js";`
    );
    return varName;
  });

  if (imports.length > 0) {
    content = `${imports.join("\n")}\n\n${content}`;
  }

  return content;
}
