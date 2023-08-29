// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import { transformFromAst } from "@babel/standalone";
import * as t from "@babel/types";
import { get, set } from "idb-keyval";
import { parseSuiteAst } from "../utils/parseSuiteAst.js";
import { NodeItem } from "../interface.js";
import { dirHandleStorageKey } from "../constants.js";

let dirHandle;
let fileHandle;

export async function exportAsFile(
  suiteData: NodeItem,
  appId: string
): Promise<boolean> {
  try {
    dirHandle = await get(dirHandleStorageKey);

    if (!dirHandle) {
      dirHandle = await window.showDirectoryPicker?.({ mode: "readwrite" });

      await set(dirHandleStorageKey, dirHandle);
    }

    const name = `${suiteData.name}.spec.js`;

    const fileHandleKey = `${dirHandle.name}-${appId}-${name}`;
    fileHandle = await get(fileHandleKey);

    if (!fileHandle) {
      const cypressDirectory = await dirHandle.getDirectoryHandle("cypress", {
        create: true,
      });

      const e2eDirectory = await cypressDirectory.getDirectoryHandle("e2e", {
        create: true,
      });

      const appIdDirectory = await e2eDirectory.getDirectoryHandle(`${appId}`, {
        create: true,
      });

      fileHandle = await appIdDirectory?.getFileHandle?.(name, {
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

  const program = t.program(parseSuiteAst(suiteData), undefined, "module");

  const generatedCode = transformFromAst(program, undefined, {}).code;

  await writable.write(generatedCode);

  await writable.close();

  return true;
}

customElements.define(
  "ui-test.export-as-file",
  createProviderClass(exportAsFile)
);
