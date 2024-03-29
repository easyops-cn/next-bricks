/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Storyboard, MicroApp, StoryboardMeta } from "@next-core/types";
import { createProviderClass } from "@next-core/utils/general";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "prettier/standalone";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import { transform } from "@babel/standalone";
import {
  ExtractState,
  extractRoutes,
  extractTemplates,
} from "./utils/extract.js";
import {
  SourceFileOrFolder,
  buildFileStructure,
} from "./utils/buildFileStructure.js";
import { generate } from "./utils/generators/generate.js";
import srcResourcesIndexJs from "./raws/src/resources/index.js.txt";
import srcIndexJs from "./raws/src/index.js.txt";
import editorConfig from "./raws/.editorconfig.txt";
import gitIgnore from "./raws/.gitignore.txt";
import declarationsDTs from "./raws/declarations.d.ts.txt";
import devConfigMjs from "./raws/dev.config.mjs.txt";
import jsconfigJson from "./raws/jsconfig.json.txt";
import nextJsxConfigJs from "./raws/next-jsx.config.js.txt";
import packageJson from "./raws/package.json.txt";
import readmeMd from "./raws/README.md.txt";
import { JS_RESERVED_WORDS } from "./utils/constants.js";
import TransformStoryboardFunction from "./utils/plugins/storyboard-function.js";
import SmartImports from "./utils/plugins/smart-imports.js";

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
      defaultConfig?: string;
      icon?: string;
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
    defaultConfig: JSON.parse(projectDetail.appSetting.defaultConfig || "{}"),
    menuIcon: JSON.parse(projectDetail.appSetting.icon || "null"),
    standaloneMode: true,
  };
  src.file(
    "app.js",
    await formatJs(`export default ${JSON.stringify(app, null, 2)};`)
  );

  const meta = (storyboard.meta ?? {}) as StoryboardMeta & {
    workflows?: unknown;
    userGroups?: unknown;
  };
  const customTemplates = meta.customTemplates ?? [];
  const functions = meta.functions ?? [];
  const menus = meta.menus ?? [];
  const contracts = meta.contracts ?? [];
  const i18n = meta.i18n ?? {};
  delete meta.customTemplates;
  delete meta.functions;
  delete meta.menus;
  delete meta.contracts;
  delete meta.i18n;
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
    "routes.jsx",
    await formatJs(generate(extractedRoutes, "routes", ["routes.jsx"]))
  );

  const resources = src.folder("resources")!;

  // Functions
  const fnDir = resources.folder("functions")!;
  const fnNames: string[] = [];
  const fnImports: string[] = [];
  for (const fn of functions) {
    if (fn.name === "index") {
      throw new Error('Unexpected function name: "index"');
    }

    // Prepend with `export default` for functions
    const inferredImports = new Set<string>();
    let { code } = transform(fn.source, {
      filename: `expr.${fn.typescript ? "ts" : "js"}`,
      plugins: [
        ...(fn.typescript ? ["syntax-typescript"] : []),
        TransformStoryboardFunction,
        [
          SmartImports,
          {
            imports: inferredImports,
          },
        ],
      ],
    }) as { code: string };
    const hasFN = inferredImports.has("FN");
    if (hasFN) {
      inferredImports.delete("FN");
    }
    const importStrings: string[] = [];
    if (inferredImports.size > 0) {
      importStrings.push(
        `import { ${[...inferredImports].join(", ")} } from "next-jsx/runtime";`
      );
    }
    if (hasFN) {
      importStrings.push(`import FN from "./index.js";`);
    }
    if (importStrings.length > 0) {
      code = `${importStrings.join("\n")}\n\n${code}`;
    }

    fnDir.file(`${fn.name}.${fn.typescript ? "ts" : "js"}`, code);
    fnImports.push(`import ${fn.name} from "./${fn.name}.js";`);
    fnNames.push(fn.name);
  }
  fnDir.file(
    "index.js",
    await formatJs(
      `${fnImports.join("\n")}\n\nconst FN = { ${fnNames.join(
        ","
      )} };\n\nexport default FN;`
    )
  );

  // Menus
  const menusDir = resources.folder("menus")!;
  const menuNames: string[] = [];
  const menuImports: string[] = [];
  for (const menu of menus) {
    cleanMenu(menu);
    if (menu.menuId === "index") {
      throw new Error('Unexpected menu id: "index"');
    }
    const filename = `${menu.menuId}.js`;
    menusDir.file(
      filename,
      await formatJs(generate(menu, "menu", ["resources", "menus", filename]))
    );
    let name = menu.menuId.replace(/^\d+|[^\w]+/g, "_");
    if (JS_RESERVED_WORDS.has(name)) {
      name = `${name}__2`;
    }
    menuImports.push(`import ${name} from "./${filename}";`);
    menuNames.push(name);
  }
  menusDir.file(
    "index.js",
    await formatJs(
      `${menuImports.join("\n")}\n\nexport default [${menuNames.join(",")}]`
    )
  );

  // Contracts
  const contractsDir = resources.folder("contracts")!;
  const contractImports: string[] = [];
  const contractNames = new Set<string>();
  for (const contract of contracts) {
    const baseName = contract.name.replace(/^\d+|[^\w]+/g, "_");
    let counter = 2;
    let varName = baseName;
    while (
      contractNames.has(varName) ||
      JS_RESERVED_WORDS.has(varName) ||
      varName === "index"
    ) {
      varName = `${baseName}_${counter++}`;
    }
    contractNames.add(varName);

    contractsDir.file(
      `${varName}.js`,
      await formatJs(`export default ${JSON.stringify(contract)};`)
    );
    contractImports.push(`import ${varName} from "./${varName}.js";`);
  }
  contractsDir.file(
    "index.js",
    await formatJs(
      `${contractImports.join("\n")}\n\nexport default [${[
        ...contractNames,
      ].join(",")}]`
    )
  );

  resources
    .folder("i18n")!
    .file(
      "index.js",
      await formatJs(`export default ${JSON.stringify(i18n)};`)
    );
  resources.file(
    "meta.js",
    await formatJs(`export default ${JSON.stringify(meta, null, 2)};`)
  );
  resources.file("index.js", srcResourcesIndexJs);

  await generateByFileStructure(fileStructure, src, []);

  const appDir = project
    .folder("mock-micro-apps")!
    .folder(projectDetail.appId)!;
  appDir.file(".gitignore", "*\n!.gitignore");

  project.file(".editorconfig", editorConfig);
  project.file(".gitignore", gitIgnore);
  project.file("dev.config.mjs", devConfigMjs);
  project.file("declarations.d.ts", declarationsDTs);
  project.file("jsconfig.json", jsconfigJson);
  project.file(
    "next-jsx.config.js",
    nextJsxConfigJs.replaceAll("__APP_ID__", projectDetail.appId)
  );
  project.file(
    "package.json",
    packageJson.replaceAll("__APP_ID__", projectDetail.appId)
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

async function formatJs(
  source: string,
  { typescript, semi = true, printWidth }: FormatJsOptions = {}
): Promise<string> {
  return await format(source, {
    parser: typescript ? "babel-ts" : "babel",
    plugins: [prettierPluginBabel, prettierPluginEstree as any],
    semi,
    printWidth,
    trailingComma: "es5",
  });
}

async function generateByFileStructure(
  items: SourceFileOrFolder[],
  folder: JSZip,
  path: string[]
) {
  for (const item of items) {
    const childPath = [...path, item.name];
    if (item.type === "folder") {
      const childFolder = folder.folder(item.name)!;
      await generateByFileStructure(item.items, childFolder, childPath);
    } else {
      folder.file(
        `${item.name}.js${
          item.nodeType === "routes" ||
          item.nodeType === "bricks" ||
          item.nodeType === "template"
            ? "x"
            : ""
        }`,
        await formatJs(generate(item.node, item.nodeType, childPath))
      );
    }
  }
}

function cleanMenu(menu: Record<string, any>) {
  for (const [key, value] of Object.entries(menu)) {
    switch (key) {
      case "items":
        if (Array.isArray(value)) {
          for (const item of value) {
            cleanMenuItem(item);
          }
        }
        break;
      case "type":
        if (value === "main") {
          delete menu[key];
        }
        break;
      case "if":
        break;
      case "i18n":
        if (Object.keys(value).length === 0) {
          delete menu[key];
        }
        break;
      default:
        if (value === null || value === false) {
          delete menu[key];
        }
    }
  }
}

function cleanMenuItem(menuItem: Record<string, any>) {
  for (const [key, value] of Object.entries(menuItem)) {
    switch (key) {
      case "children":
        if (Array.isArray(value) && value.length > 0) {
          cleanMenuItem(value);
        }
        break;
      case "if":
        break;
      case "activeExcludes":
      case "activeIncludes":
        if (Array.isArray(value) && value.length === 0) {
          delete menuItem[key];
        }
        break;
      default:
        if (value === null || value === false) {
          delete menuItem[key];
        }
    }
  }
}

customElements.define(
  "vb-experiment.export-as-source-files",
  createProviderClass(exportAsSourceFiles)
);
