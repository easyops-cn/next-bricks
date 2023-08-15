import { createProviderClass } from "@next-core/utils/general";
import { transformFromAst } from "@babel/standalone";
import * as t from "@babel/types";
import { saveAs } from "file-saver";
import { mockDataList } from "./mock-data.js";
import { processNodeItem } from "../utils/parseNodeItem.js";
import { NodeItem } from "../interface.js";

export async function exportAsFile(specData: NodeItem[]): void {
  const program = t.program(
    mockDataList.map((item) => processNodeItem(item)),
    undefined,
    "module"
  );

  const generatedCode = transformFromAst(program, undefined, {}).code;

  const blob = new Blob([generatedCode], { type: "application/javascript" });
  saveAs(blob, "demo.spec.js");
}

customElements.define(
  "ui-test.export-as-file",
  createProviderClass(exportAsFile)
);
