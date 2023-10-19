import { createProviderClass } from "@next-core/utils/general";
import { getTestDirHandle, getCaseFileHandle } from "./shared/fileAccess.js";

let dirHandle: any;
async function renameCaseName(
  prevName: string,
  curName: string,
  appId: string
): Promise<undefined> {
  dirHandle = await getTestDirHandle();

  const fileHandle = await getCaseFileHandle(dirHandle, {
    caseName: prevName,
    appId: appId,
  });

  await fileHandle.move(`${curName}.spec.js`);
}

export async function renameFile(
  prevName: string,
  curName: string,
  appId: string
): Promise<undefined> {
  try {
    await renameCaseName(prevName, curName, appId);
  } catch (error) {
    if ((error as any).name === "NotAllowedError") {
      await dirHandle.requestPermission({ mode: "readwrite" });
      await renameCaseName(prevName, curName, appId);
    } else {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
}

customElements.define("ui-test.rename-file", createProviderClass(renameFile));
