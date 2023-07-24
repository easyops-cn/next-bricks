import type { Storyboard, MicroApp, StoryboardMeta } from "@next-core/types";
import { createProviderClass } from "@next-core/utils/general";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import * as changeCase from "change-case";

export interface StoryboardAssemblyResult {
  storyboard: Storyboard;

  projectDetail: {
    appId: string;
    name: string;
    appSetting: {
      homepage: string;
      layoutType?: string;
      theme?: MicroApp["theme"];
    };
  };
}

export async function exportAsSourceFiles({
  projectDetail,
  storyboard,
}: StoryboardAssemblyResult): Promise<void> {
  const routeNames = new Set<string>();

  let count = 1;
  const getRouteName = (alias?: string) => {
    const aliasIsOk =
      typeof alias === "string" && /^\w+$/.test(alias) && alias !== "index";
    if (aliasIsOk) {
      if (!routeNames.has(alias)) {
        return alias;
      }
    }
    const prefix = aliasIsOk ? alias : "route";
    let name: string;
    while (routeNames.has((name = `${prefix}_${count}`))) {
      count++;
    }
    return name;
  };

  const zip = new JSZip();
  const project = zip.folder("project")!;
  const src = project.folder("src")!;
  const routes = src.folder("routes")!;
  const templates = src.folder("templates")!;

  for (const route of storyboard.routes) {
    const name = getRouteName(route.alias);
    routeNames.add(name);
    const filename = `${name}.js`;
    const content = `export default ${JSON.stringify(route, null, 2)};`;
    routes.file(filename, content);
  }

  routes.file(
    "index.js",
    [
      ...[...routeNames].map((name) => `import ${name} from "./${name}";`),
      "",
      `export default [
${[...routeNames].map((name) => `  ${name},`).join("\n")}
];`,
    ].join("\n")
  );

  const app: MicroApp & { layoutType?: string } = {
    id: projectDetail.appId,
    name: projectDetail.name,
    homepage: projectDetail.appSetting.homepage,
    layoutType: projectDetail.appSetting.layoutType,
    theme: projectDetail.appSetting.theme,
  };
  src.file("app.js", `export default ${JSON.stringify(app, null, 2)};`);

  const meta = (storyboard.meta ?? {}) as StoryboardMeta & {
    workflows?: unknown[];
  };
  const customTemplates = meta.customTemplates ?? [];
  delete meta.customTemplates;
  delete meta.workflows;
  delete meta.mocks;
  for (const tpl of customTemplates) {
    const filename = `${tpl.name}.js`;
    const content = `export default ${JSON.stringify(tpl, null, 2)};`;
    templates.file(filename, content);
  }

  templates.file(
    "index.js",
    [
      ...[...customTemplates].map(
        (tpl) =>
          `import ${changeCase.camelCase(tpl.name)} from "./${tpl.name}";`
      ),
      "",
      `export default [
${[...customTemplates]
  .map((tpl) => `  ${changeCase.camelCase(tpl.name)},`)
  .join("\n")}
];`,
    ].join("\n")
  );

  src.file(
    "meta.js",
    [
      `import customTemplates from "./templates";`,
      `const meta = ${JSON.stringify(storyboard.meta, null, 2)};`,
      `meta.customTemplates = customTemplates;`,
      `export default meta;`,
    ].join("\n")
  );

  src.file(
    "index.js",
    [
      'import app from "./app";',
      'import routes from "./routes";',
      'import meta from "./meta";',
      "",
      `export default {
  app,
  routes,
  meta,
};`,
    ].join("\n")
  );

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, "project.zip");
}

customElements.define(
  "vb-experiment.export-as-source-files",
  createProviderClass(exportAsSourceFiles)
);
