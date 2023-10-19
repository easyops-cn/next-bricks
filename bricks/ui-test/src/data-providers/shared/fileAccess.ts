import { get, set } from "idb-keyval";
import { dirHandleStorageKey } from "../../constants.js";

let dirHandle: any;
let fileHandle: any;
export async function getTestDirHandle() {
  dirHandle = await get(dirHandleStorageKey);

  if (!dirHandle) {
    dirHandle = await window.showDirectoryPicker?.({ mode: "readwrite" });

    await set(dirHandleStorageKey, dirHandle);
  }

  return dirHandle;
}

export async function getAppDirHandle(
  dirHandle: any,
  { appId }: { appId: string }
) {
  const cypressDirectory = await dirHandle.getDirectoryHandle("cypress", {
    create: true,
  });

  const e2eDirectory = await cypressDirectory.getDirectoryHandle("e2e", {
    create: true,
  });

  const appIdDirectory = await e2eDirectory.getDirectoryHandle(`${appId}`, {
    create: true,
  });

  return appIdDirectory;
}

export async function getCaseFileHandle(
  dirHandle: any,
  {
    caseName,
    appId,
  }: {
    caseName: string;
    appId: string;
  }
) {
  const name = `${caseName}.spec.js`;
  const fileHandleKey = `${dirHandle.name}-${appId}-${name}`;
  fileHandle = await get(fileHandleKey);

  if (!fileHandle) {
    const appIdDirectory = await getAppDirHandle(dirHandle, { appId });

    fileHandle = await appIdDirectory?.getFileHandle?.(name, {
      create: true,
    });

    await set(fileHandleKey, fileHandle);
  }

  return fileHandle;
}
