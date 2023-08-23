// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import { transformFromAst } from "@babel/standalone";
import * as t from "@babel/types";
import { get, set } from "idb-keyval";
import { processNodeItem } from "../utils/parseNodeItem.js";
import { NodeItem } from "../interface.js";
import { dirHandleStorageKey, fileHandleStorageKey } from "../constants.js";

let dirHandle;
let fileHandle;

export async function exportAsFile(specDataList: NodeItem[]): Promise<boolean> {
  try {
    dirHandle = await get(dirHandleStorageKey);

    if (!dirHandle) {
      dirHandle = await window.showDirectoryPicker?.({ mode: "readwrite" });

      await set(dirHandleStorageKey, dirHandle);
    }

    const name = `${specDataList[0]?.name}.spec.js`;

    const fileHandleKey = `${dirHandle.name}-${fileHandleStorageKey}-${name}`;
    fileHandle = await get(fileHandleKey);

    if (!fileHandle) {
      fileHandle = await dirHandle?.getFileHandle?.(name, {
        create: true,
      });

      await set(fileHandleKey, fileHandle);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return false;
  }

  const writable = await fileHandle?.createWritable?.();

  const program = t.program(
    specDataList.map((item) => processNodeItem(item)),
    undefined,
    "module"
  );

  const generatedCode = transformFromAst(program, undefined, {}).code;

  await writable.write(generatedCode);

  await writable.close();

  return true;
}

customElements.define(
  "ui-test.export-as-file",
  createProviderClass(exportAsFile)
);
