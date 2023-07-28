import { pull } from "lodash";
import type { ExtractedItem } from "./extract.js";

export interface SourceFile {
  type: "file";
  name: string;
  node: unknown;
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
  { name, path, node }: ExtractedItem,
  rootItems: SourceFileOrFolder[]
) {
  let items = rootItems;
  for (const dir of path) {
    const found = items.find((item) => item.name === dir);
    if (found) {
      if (found.type === "folder") {
        items = found.items;
        continue;
      } else {
        pull(items, found);
      }
    }

    const folder: SourceFolder = {
      type: "folder",
      name: dir,
      items: [],
    };
    items.push(folder);
    items = folder.items;

    if (found) {
      const index: SourceFile = {
        type: "file",
        name: "index",
        node: found.node,
      };
      items.push(index);
    }
  }

  const foundFolder = items.find(
    (item) => item.name === name && item.type === "folder"
  ) as SourceFolder | undefined;
  if (foundFolder) {
    const file: SourceFile = {
      type: "file",
      name: "index",
      node,
    };
    foundFolder.items.push(file);
  } else {
    const file: SourceFile = {
      type: "file",
      name,
      node,
    };
    items.push(file);
  }
}
