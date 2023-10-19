import { createProviderClass } from "@next-core/utils/general";
import { NodeItem } from "../interface.js";
import { getTestDirHandle, getAppDirHandle } from "./shared/fileAccess.js";

let dirHandle: any;
async function deleteCaseFile(
  suiteData: NodeItem,
  appId: string
): Promise<undefined> {
  dirHandle = await getTestDirHandle();

  const appIdDirectory = await getAppDirHandle(dirHandle, { appId });

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
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}

customElements.define("ui-test.delete-file", createProviderClass(deleteFile));
