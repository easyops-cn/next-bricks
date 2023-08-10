import { IMPORT_DEFAULT_PREFIX } from "./constants.js";
import { ImportInfo } from "./interfaces.js";

export function addImport(
  imports: ImportInfo,
  from: string,
  name: string
): void {
  let imp = imports.get(from);
  if (!imp) {
    imp = new Set();
    imports.set(from, imp);
  }
  imp.add(name);
}

export function generateImports(imports: ImportInfo): string[] {
  return [...imports]
    .sort((a, b) => Number(a[0].startsWith(".")) - Number(b[0].startsWith(".")))
    .map(([from, names]) => {
      const importNames = [...names];
      if (
        importNames.length === 1 &&
        importNames[0].startsWith(IMPORT_DEFAULT_PREFIX)
      ) {
        return `import ${importNames[0].substring(
          IMPORT_DEFAULT_PREFIX.length
        )} from "${from}";`;
      }
      return `import { ${importNames.join(", ")} } from "${from}";`;
    });
}

export function getVarNamesByImports(imports: ImportInfo): Set<string> {
  const names = new Set<string>();
  for (const importNames of imports.values()) {
    for (const name of importNames) {
      names.add(
        name.startsWith(IMPORT_DEFAULT_PREFIX)
          ? name.substring(IMPORT_DEFAULT_PREFIX.length)
          : name
      );
    }
  }
  return names;
}
