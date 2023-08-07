import type { Storyboard, MicroApp, StoryboardMeta } from "@next-core/types";
import { createProviderClass } from "@next-core/utils/general";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "prettier/standalone.js";
import parserBabel from "prettier/parser-babel.js";
import {
  ExtractState,
  extractRoutes,
  extractTemplates,
} from "./utils/extract.js";
import {
  SourceFileOrFolder,
  buildFileStructure,
} from "./utils/buildFileStructure.js";
import { printWithPlaceholders } from "./utils/printWithPlaceholders.js";
import jsxConstantsJs from "./raws/jsx/constants.js.txt";
import jsxIndexJs from "./raws/jsx/index.js.txt";
import jsxJsxRuntimeJs from "./raws/jsx/jsx-runtime.js.txt";
import jsxPackageJson from "./raws/jsx/package.json.txt";
import jsxStylesJs from "./raws/jsx/Style.js.txt";
import scriptsBuildJs from "./raws/scripts/build.js.txt";
import scriptsTranspileJs from "./raws/scripts/transpile.js.txt";
import srcIndexJs from "./raws/src/index.js.txt";
import editorConfig from "./raws/.editorconfig.txt";
import gitIgnore from "./raws/.gitignore.txt";
import babelConfigJs from "./raws/babel.config.js.txt";
import packageJson from "./raws/package.json.txt";
import readmeMd from "./raws/README.md.txt";

export interface StoryboardAssemblyResult {
  storyboard: Storyboard;

  projectDetail: {
    appId: string;
    name: string;
    appSetting: Pick<
      MicroApp,
      "homepage" | "theme" | "locales" | "noAuthGuard"
    > & {
      layoutType?: string;
    };
    brickNextVersion?: number;
  };
}

export async function exportAsSourceFiles({
  projectDetail,
  storyboard,
}: StoryboardAssemblyResult): Promise<void> {
  const zip = new JSZip();
  const project = zip.folder("project")!;
  const src = project.folder("src")!;

  const extractState: ExtractState = {
    extracts: [],
    namePool: new Map(),
  };
  const extractedRoutes = extractRoutes(storyboard.routes, [], extractState);

  const app: MicroApp & { layoutType?: string } = {
    id: projectDetail.appId,
    name: projectDetail.name,
    homepage: projectDetail.appSetting.homepage,
    layoutType: projectDetail.appSetting.layoutType,
    theme: projectDetail.appSetting.theme,
    noAuthGuard: projectDetail.appSetting.noAuthGuard,
    locales: projectDetail.appSetting.locales,
    standaloneMode: true,
  };
  src.file(
    "app.js",
    formatJs(`export default ${JSON.stringify(app, null, 2)};`)
  );

  const meta = (storyboard.meta ?? {}) as StoryboardMeta & {
    workflows?: unknown;
    userGroups?: unknown;
  };
  const customTemplates = meta.customTemplates ?? [];
  delete meta.customTemplates;
  delete meta.workflows;
  delete meta.mocks;
  delete meta.userGroups;

  const extractedTemplates = extractTemplates(
    customTemplates,
    ["components"],
    extractState
  );
  extractState.extracts.push({
    name: "index",
    path: ["components"],
    node: extractedTemplates,
    nodeType: "others",
  });

  const fileStructure = buildFileStructure(extractState.extracts);

  src.file("index.js", srcIndexJs);

  src.file(
    "meta.js",
    formatJs(`export default ${JSON.stringify(meta, null, 2)};`)
  );

  src.file(
    "routes.jsx",
    formatJs(printWithPlaceholders(extractedRoutes, "routes"))
  );

  printFileStructure(fileStructure, src);

  const appRelativeDir = JSON.stringify(
    `../mock-micro-apps/${projectDetail.appId}`
  );

  const scripts = project.folder("scripts")!;
  scripts.file(
    "build.js",
    scriptsBuildJs.replaceAll("__APP_RELATIVE_DIR__", appRelativeDir)
  );
  scripts.file("transpile.js", scriptsTranspileJs);

  const appDir = project
    .folder("mock-micro-apps")!
    .folder(projectDetail.appId)!;
  appDir.file(".gitignore", "*\n!.gitignore");

  const jsxDir = project.folder("jsx")!;
  jsxDir.file("constants.js", jsxConstantsJs);
  jsxDir.file("index.js", jsxIndexJs);
  jsxDir.file("jsx-runtime.js", jsxJsxRuntimeJs);
  jsxDir.file("package.json", jsxPackageJson);
  jsxDir.file("Style.js", jsxStylesJs);

  project.file(".editorconfig", editorConfig);
  project.file(".gitignore", gitIgnore);
  project.file("babel.config.js", babelConfigJs);
  project.file(
    "package.json",
    packageJson.replaceAll("__PROJECT_ID__", projectDetail.appId)
  );
  project.file(
    "README.md",
    readmeMd
      .replaceAll("__PROJECT_NAME__", projectDetail.name)
      .replaceAll("__PROJECT_HOMEPAGE__", projectDetail.appSetting.homepage)
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "project.zip");
}

interface FormatJsOptions {
  typescript?: boolean;
  semi?: boolean;
  printWidth?: number;
}

function formatJs(
  source: string,
  { typescript, semi = true, printWidth }: FormatJsOptions = {}
): string {
  return format(source, {
    parser: typescript ? "babel-ts" : "babel",
    plugins: [parserBabel],
    semi,
    printWidth,
  });
}

function printFileStructure(items: SourceFileOrFolder[], folder: JSZip) {
  for (const item of items) {
    if (item.type === "folder") {
      const childFolder = folder.folder(item.name)!;
      printFileStructure(item.items, childFolder);
    } else {
      folder.file(
        `${item.name}.js${item.nodeType === "others" ? "" : "x"}`,
        formatJs(printWithPlaceholders(item.node, item.nodeType))
      );
    }
  }
}

customElements.define(
  "vb-experiment.export-as-source-files",
  createProviderClass(exportAsSourceFiles)
);
