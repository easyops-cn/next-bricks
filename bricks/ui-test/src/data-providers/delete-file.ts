import { createProviderClass } from "@next-core/utils/general";
import { get } from "idb-keyval";
import { NodeItem } from "../interface.js";
import { dirHandleStorageKey } from "../constants.js";
import { handleHttpError } from "@next-core/runtime";

let dirHandle: any;
async function deleteCaseFile(
  suiteData: NodeItem,
  appId: string
): Promise<undefined> {
  dirHandle = await get(dirHandleStorageKey);

  const cypressDirectory = await dirHandle.getDirectoryHandle("cypress", {
    create: true,
  });

  const e2eDirectory = await cypressDirectory.getDirectoryHandle("e2e", {
    create: true,
  });

  const appIdDirectory = await e2eDirectory.getDirectoryHandle(`${appId}`, {
    create: true,
  });

  await appIdDirectory.removeEntry(`${suiteData.name}.spec.js`);
}

export async function deleteFile(
  suiteData: NodeItem,
  appId: string
): Promise<undefined> {
  try {
    await deleteCaseFile(suiteData, appId);
  } catch (error) {
    if ((error as any).name === "NotAllowedError") {
      await dirHandle.requestPermission({ mode: "readwrite" });
      await deleteCaseFile(suiteData, appId);
    } else {
      handleHttpError(error);
    }
  }
}

customElements.define("ui-test.delete-file", createProviderClass(deleteFile));
