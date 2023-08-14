// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import { get, set } from "idb-keyval";
import { dirHandleStorageKey } from "../constants.js";

interface Params {
  action: "get" | "set";
}

export async function chooseDirectory(params: Params): Promise<unknown> {
  if (params?.action === "get") {
    return get(dirHandleStorageKey);
  }

  const directoryHandle = await window.showDirectoryPicker?.({
    mode: "readwrite",
  });

  set(dirHandleStorageKey, directoryHandle);

  return directoryHandle;
}

customElements.define(
  "ui-test.choose-directory",
  createProviderClass(chooseDirectory)
);
