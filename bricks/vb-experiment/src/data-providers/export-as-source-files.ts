import type { Storyboard, MicroApp, StoryboardMeta } from "@next-core/types";
import { createProviderClass } from "@next-core/utils/general";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "prettier/standalone.js";
import parserBabel from "prettier/parser-babel.js";
import {
  ExtractState,
  PLACEHOLDER_PREFIX,
  extractRoutes,
  extractTemplates,
} from "./utils/extract.js";
import {
  SourceFileOrFolder,
  buildFileStructure,
} from "./utils/buildFileStructure.js";
import { printWithPlaceholders } from "./utils/printWithPlaceholders.js";

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
    workflows?: unknown[];
  };
  const customTemplates = meta.customTemplates ?? [];
  delete meta.customTemplates;
  delete meta.workflows;
  delete meta.mocks;

  const extractedTemplates = extractTemplates(
    customTemplates,
    [],
    extractState
  );

  const fileStructure = buildFileStructure(extractState.extracts);

  src.file(
    "meta.js",
    formatJs(
      printWithPlaceholders(
        {
          ...meta,
          customTemplates: extractedTemplates,
        },
        fileStructure
      )
    )
  );

  src.file(
    "index.js",
    formatJs(
      printWithPlaceholders(
        {
          app: `${PLACEHOLDER_PREFIX}app`,
          routes: extractedRoutes,
          meta: `${PLACEHOLDER_PREFIX}meta`,
        },
        fileStructure
      )
    )
  );

  printFileStructure(fileStructure, src);

  const packageJsonContent = JSON.stringify(
    {
      name: projectDetail.appId,
      private: true,
      type: "module",
      scripts: {
        build: "node scripts/build.js",
        start: "node --watch scripts/build.js",
        serve: `brick-container-serve --local-micro-apps=${JSON.stringify(
          projectDetail.appId
        )}`,
      },
      engines: {
        node: ">=16",
      },
      devDependencies: {
        "@next-core/brick-container": "^3.5.2",
        "@types/node": "^16.18.14",
        "js-yaml": "^3.14.1",
      },
    },
    null,
    2
  );

  project.file("package.json", packageJsonContent);

  const scripts = project.folder("scripts")!;

  const appRelativeDir = JSON.stringify(
    `../mock-micro-apps/${projectDetail.appId}`
  );

  scripts.file(
    "build.js",
    `import path from "node:path";
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import yaml from "js-yaml";
import storyboard from "../src/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { safeDump, JSON_SCHEMA } = yaml;

await writeFile(
  path.resolve(__dirname, ${appRelativeDir}, "storyboard.yaml"),
  safeDump(storyboard, {
    indent: 2,
    schema: JSON_SCHEMA,
    skipInvalid: true,
    noRefs: true,
    noCompatMode: true,
  })
);

await writeFile(
  path.resolve(__dirname, ${appRelativeDir}, "storyboard.json"),
  JSON.stringify(storyboard, null, 2)
);`
  );

  const appDir = project
    .folder("mock-micro-apps")!
    .folder(projectDetail.appId)!;
  appDir.file(".gitignore", "*\n!.gitignore");

  project.file(
    "README.md",
    `# ${projectDetail.name}

## 准备

\`\`\`bash
yarn
\`\`\`

## 开发模式

打开两个终端，分别运行 \`yarn start\` 和 \`yarn serve\`。

提示：
- 使用 \`yarn start\` 需要 node >= 18.11 。
- 运行 \`yarn serve\` 时按需使用 \`--subdir\` 和 \`--server\` 等参数。
- 修改文件后，需手动刷新浏览器。

## 生产模式

\`\`\`bash
yarn build && yarn serve
\`\`\`
`
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
        `${item.name}.js`,
        formatJs(printWithPlaceholders(item.node, items))
      );
    }
  }
}

customElements.define(
  "vb-experiment.export-as-source-files",
  createProviderClass(exportAsSourceFiles)
);
