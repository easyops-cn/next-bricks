/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Storyboard, MicroApp, StoryboardMeta } from "@next-core/types";
import { createProviderClass } from "@next-core/utils/general";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { format } from "prettier/standalone.js";
import parserBabel from "prettier/parser-babel.js";
import * as t from "@babel/types";
import { transform, transformFromAst } from "@babel/standalone";
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
import jsxConstantsJs from "./raws/jsx/constants.js.txt";
import jsxIndexJs from "./raws/jsx/index.js.txt";
import jsxJsxRuntimeJs from "./raws/jsx/jsx-runtime.js.txt";
import jsxPackageJson from "./raws/jsx/package.json.txt";
import jsxStyleJs from "./raws/jsx/Style.js.txt";
import jsxFunctionJs from "./raws/jsx/Function.js.txt";
import scriptsBabelJs from "./raws/scripts/babel.js.txt";
import scriptsBuildJs from "./raws/scripts/build.js.txt";
import scriptsStartJs from "./raws/scripts/start.js.txt";
import scriptsTranspileJs from "./raws/scripts/transpile.js.txt";
import srcResourcesIndexJs from "./raws/src/resources/index.js.txt";
import srcIndexJs from "./raws/src/index.js.txt";
import editorConfig from "./raws/.editorconfig.txt";
import gitIgnore from "./raws/.gitignore.txt";
import babelConfigJs from "./raws/babel.config.js.txt";
import packageJson from "./raws/package.json.txt";
import jsconfigJson from "./raws/jsconfig.json.txt";
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
    formatJs(generate(extractedRoutes, "routes", ["routes.jsx"]))
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
    const ast = transform(fn.source, {
      filename: `expr.${fn.typescript ? "ts" : "js"}`,
      plugins: fn.typescript ? ["syntax-typescript"] : [],
      ast: true,
    }).ast;
    const statements = ast.program.body.map((statement) => {
      if (statement.type === "FunctionDeclaration") {
        const exportDefault = t.exportDefaultDeclaration(statement);
        if (statement.leadingComments) {
          exportDefault.leadingComments = statement.leadingComments;
          delete statement.leadingComments;
        }
        return exportDefault;
      }
      return statement;
    });
    const { code } = transformFromAst(
      t.program(statements, undefined, "module"),
      undefined,
      {}
    );

    fnDir.file(`${fn.name}.${fn.typescript ? "ts" : "js"}`, code);
    fnImports.push(`import ${fn.name} from "./${fn.name}.js";`);
    fnNames.push(fn.name);
  }
  fnDir.file(
    "index.js",
    formatJs(
      `${fnImports.join("\n")}\n\nexport default { ${fnNames.join(",")} };`
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
      formatJs(generate(menu, "menu", ["resources", "menus", filename]))
    );
    const name = menu.menuId.replace(/^\d+|[^\w]+/g, "_");
    menuImports.push(`import ${name} from "./${filename}";`);
    menuNames.push(name);
  }
  menusDir.file(
    "index.js",
    formatJs(
      `${menuImports.join("\n")}\n\nexport default [${menuNames.join(",")}]`
    )
  );

  // Contracts
  const contractsDir = resources.folder("contracts")!;
  const contractNames: string[] = [];
  const contractImports: string[] = [];
  for (const contract of contracts) {
    if (contract.name === "index") {
      throw new Error('Unexpected contract name: "index"');
    }
    contractsDir.file(
      `${contract.name}.js`,
      formatJs(`export default ${JSON.stringify(contract)};`)
    );
    const name = contract.name.replace(/^\d+|[^\w]+/g, "_");
    contractImports.push(`import ${name} from "./${contract.name}.js";`);
    contractNames.push(name);
  }
  contractsDir.file(
    "index.js",
    formatJs(
      `${contractImports.join("\n")}\n\nexport default [${contractNames.join(
        ","
      )}]`
    )
  );

  resources
    .folder("i18n")!
    .file("index.js", formatJs(`export default ${JSON.stringify(i18n)};`));
  resources.file(
    "meta.js",
    formatJs(`export default ${JSON.stringify(meta, null, 2)};`)
  );
  resources.file("index.js", srcResourcesIndexJs);

  generateByFileStructure(fileStructure, src, []);

  const appRelativeDir = JSON.stringify(
    `../mock-micro-apps/${projectDetail.appId}`
  );

  const scripts = project.folder("scripts")!;
  scripts.file(
    "build.js",
    scriptsBuildJs.replaceAll("__APP_RELATIVE_DIR__", appRelativeDir)
  );
  scripts.file("babel.js", scriptsBabelJs);
  scripts.file("start.js", scriptsStartJs);
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
  jsxDir.file("Style.js", jsxStyleJs);
  jsxDir.file("Function.js", jsxFunctionJs);

  project.file(".editorconfig", editorConfig);
  project.file(".gitignore", gitIgnore);
  project.file("babel.config.js", babelConfigJs);
  project.file("jsconfig.json", jsconfigJson);
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

function generateByFileStructure(
  items: SourceFileOrFolder[],
  folder: JSZip,
  path: string[]
) {
  for (const item of items) {
    const childPath = [...path, item.name];
    if (item.type === "folder") {
      const childFolder = folder.folder(item.name)!;
      generateByFileStructure(item.items, childFolder, childPath);
    } else {
      folder.file(
        `${item.name}.js${
          item.nodeType === "others" || item.nodeType === "context" ? "" : "x"
        }`,
        formatJs(generate(item.node, item.nodeType, childPath))
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
