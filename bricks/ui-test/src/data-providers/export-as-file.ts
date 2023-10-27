// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import { transformFromAst } from "@babel/standalone";
import * as t from "@babel/types";
import { get, set } from "idb-keyval";
import { parseSuiteAst } from "../utils/parseSuiteAst.js";
import { getCaseFileHandle, getTestDirHandle } from "./shared/fileAccess.js";
import { NodeItem } from "../interface.js";
import { dirHandleStorageKey } from "../constants.js";
import { format } from "prettier/standalone";
import parserBabel from "prettier/parser-babel";

export async function exportAsFile(
  suiteData: NodeItem,
  appId: string
): Promise<boolean> {
  let dirHandle;
  let fileHandle;

  try {
    dirHandle = await getTestDirHandle();

    fileHandle = await getCaseFileHandle(dirHandle, {
      caseName: suiteData.name,
      appId,
    });
  } catch (error) {
    if ((error as any).name === "NotAllowedError") {
      const storedDirHandle = await getTestDirHandle();
      await storedDirHandle.requestPermission({ mode: "readwrite" });
      fileHandle = await getCaseFileHandle(dirHandle, {
        caseName: suiteData.name,
        appId,
      });
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
      return false;
    }
  }

  const writable = await fileHandle?.createWritable?.();

  const program = t.program(parseSuiteAst(suiteData), undefined, "module");

  const generatedCode = transformFromAst(program, undefined, {
    generatorOpts: {
      jsescOption: {
        minimal: true,
      },
    },
  }).code;

  const prettyCode = await format(generatedCode as string, {
    parser: "babel-ts",
    plugins: [parserBabel],
    printWidth: 50,
  });

  await writable.write(prettyCode);

  await writable.close();

  return true;
}

customElements.define(
  "ui-test.export-as-file",
  createProviderClass(exportAsFile)
);
