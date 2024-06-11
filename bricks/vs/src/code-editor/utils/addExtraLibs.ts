import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import { ExtraLib } from "../interfaces.js";

const extraLibsMap = new Map<string, monaco.IDisposable[]>();

export function addExtraLibs(
  libs: ExtraLib[],
  options: {
    languageDefaults?: string;
  }
): monaco.IDisposable[] {
  return libs.flatMap((lib) => {
    const uri = monaco.Uri.file(`libs/${lib.filePath}`);
    const uriString = uri.toString();
    const previousLibs = extraLibsMap.get(uriString);
    if (previousLibs) {
      previousLibs.forEach((lib) => lib.dispose());
    }
    // Add libs for both js and ts.
    const disposables = (
      [options.languageDefaults] as Array<
        "javascriptDefaults" | "typescriptDefaults"
      >
    ).map((key) =>
      monaco.languages.typescript[key].addExtraLib(lib.content, uriString)
    );

    extraLibsMap.set(uriString, disposables);
    return disposables;
  });
}
