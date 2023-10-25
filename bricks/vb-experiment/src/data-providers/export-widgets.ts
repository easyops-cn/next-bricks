import { createProviderClass } from "@next-core/utils/general";
import JSZip from "jszip";
import { saveAs } from "file-saver";

interface ExportWidgetsParams {
  name: string;
  files: FileInfo[];
}

interface FileInfo {
  path: string;
  content: string;
}

export async function exportWidgets({
  name,
  files,
}: ExportWidgetsParams): Promise<void> {
  const fs = new Map<string, JSZip>();
  const zip = new JSZip();
  const widgets = zip.folder("widgets")!;
  const project = widgets.folder(name)!;

  for (const { path, content } of files) {
    const segments = path.split("/");
    const filename = segments.pop()!;
    let handle = project;
    let i = 1;
    for (const segment of segments) {
      const current = segments.slice(0, i).join("/");
      const found = fs.get(current);
      if (found) {
        handle = found;
      } else {
        handle = handle.folder(segment)!;
        fs.set(current, handle);
      }
      i++;
    }
    handle.file(filename, content);
  }

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${name}.zip`);
}

customElements.define(
  "vb-experiment.export-widgets",
  createProviderClass(exportWidgets)
);
