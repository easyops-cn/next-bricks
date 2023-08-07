import type { ExtractedItem, NodeType } from "./extract.js";

export interface SourceFile {
  type: "file";
  name: string;
  node: unknown;
  nodeType: NodeType;
}

export interface SourceFolder {
  type: "folder";
  name: string;
  items: SourceFileOrFolder[];
}

export type SourceFileOrFolder = SourceFile | SourceFolder;

export function buildFileStructure(extracts: ExtractedItem[]) {
  const rootItems: SourceFileOrFolder[] = [];
  for (const item of extracts) {
    makeFileWithFolders(item, rootItems);
  }
  return rootItems;
}

function makeFileWithFolders(
  { name, path, node, nodeType }: ExtractedItem,
  rootItems: SourceFileOrFolder[]
) {
  let items = rootItems;
  for (const dir of path) {
    const found = items.find(
      (item) => item.name === dir && item.type === "folder"
    ) as SourceFolder | undefined;
    if (found) {
      items = found.items;
      continue;
    }

    const folder: SourceFolder = {
      type: "folder",
      name: dir,
      items: [],
    };
    items.push(folder);
    items = folder.items;
  }

  const file: SourceFile = {
    type: "file",
    name,
    node,
    nodeType,
  };
  items.push(file);
}
