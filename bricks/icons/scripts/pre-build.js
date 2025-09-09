/**
 * - 拷贝 @next-shared/icons
 * - 生成 FontAwesome 图标数据以便使用 dynamic imports
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import antdIcons from "@ant-design/icons-svg";
import antdIconsHelpers from "@ant-design/icons-svg/lib/helpers.js";
import _ from "lodash";

const { renderIconDefinitionToSVGElement } = antdIconsHelpers;

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {Promises<unknown>[]} */
const tasks = [];

{
  // --- EasyOps Icons start ---
  const legacyEasyOpsIconsPath = path.resolve(
    require.resolve("@next-shared/icons/package.json"),
    "../src/icons"
  );
  const newEasyOpsIconsPath = path.resolve(
    __dirname,
    "../src/easyops-icon/generated"
  );
  if (existsSync(newEasyOpsIconsPath)) {
    rmSync(newEasyOpsIconsPath, { recursive: true, force: true });
  }
  mkdirSync(newEasyOpsIconsPath);

  const allIcons = {
    default: [],
  };

  tasks.push(
    (async () => {
      const list = await readdir(legacyEasyOpsIconsPath, {
        withFileTypes: true,
      });

      await Promise.all(
        list.map(async (item) => {
          if (item.isDirectory() && /\w/.test(item.name)) {
            const categoryDir = path.resolve(legacyEasyOpsIconsPath, item.name);
            if (!_.has(allIcons, item.name)) {
              allIcons[item.name] = [];
            }
            const icons = await readdir(categoryDir);
            for (const icon of icons) {
              const [_m, iconName, ext] = icon.match(/^(.*?)(\.[^.]+)?$/);
              if (item.name === "image") {
                if ([".png", ".gif"].includes(ext)) {
                  allIcons[item.name].push(
                    `${iconName}${ext.replace(".", "-")}`
                  );
                }
              } else if (ext === ".svg") {
                allIcons[item.name].push(iconName);
              }
            }
          } else if (item.name.endsWith(".svg")) {
            const iconName = item.name.substring(0, item.name.length - 4);
            allIcons.default.push(iconName);
          }
        })
      );

      await writeFile(
        path.resolve(newEasyOpsIconsPath, "icons.json"),
        JSON.stringify(allIcons)
      );
    })()
  );
}

{
  // --- FontAwesome Icons start ---
  const generatedDir = path.resolve(__dirname, "../src/fa-icon/generated");
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
  }
  mkdirSync(generatedDir);

  const iconCategories = {
    far,
    fas,
    fab,
  };
  const aliasMapByCategory = {};
  const allIcons = {};

  for (const category of Object.keys(iconCategories)) {
    mkdirSync(path.resolve(generatedDir, category));
    allIcons[category] = [];
  }

  tasks.push(
    (async () => {
      await Promise.all(
        Object.entries(iconCategories).map(async ([category, pack]) => {
          const aliasMap = (aliasMapByCategory[category] = {});
          await Promise.all(
            Object.values(pack).flatMap((item) => {
              const aliases = item.icon[2].filter(
                (alias) => typeof alias === "string"
              );
              allIcons[category].push(item.iconName);
              for (const alias of aliases) {
                // allIcons[category].push(alias);
                aliasMap[alias] = item.iconName;
              }
              const content = JSON.stringify(item);
              return writeFile(
                path.resolve(generatedDir, `${category}/${item.iconName}.json`),
                content
              );
            })
          );
        })
      );

      await Promise.all([
        writeFile(
          path.resolve(generatedDir, "alias.json"),
          JSON.stringify(aliasMapByCategory)
        ),
        writeFile(
          path.resolve(generatedDir, "icons.json"),
          JSON.stringify(allIcons)
        ),
      ]);
    })()
  );
}

{
  // --- AntDesign Icons start ---
  const generatedDir = path.resolve(__dirname, "../src/antd-icon/generated");
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
  }
  mkdirSync(generatedDir);

  const allIcons = {};
  const themes = ["outlined", "filled", "twotone"];
  for (const theme of themes) {
    const themeDir = path.resolve(generatedDir, theme);
    mkdirSync(themeDir);
    allIcons[theme] = [];
  }

  tasks.push(
    (async () => {
      await Promise.all(
        Object.values(antdIcons).map((icon) => {
          if (!themes.includes(icon.theme)) {
            return;
          }
          allIcons[icon.theme].push(icon.name);
          const svg = renderIconDefinitionToSVGElement(icon, {
            extraSVGAttrs: { fill: "currentColor" },
            placeholders: {
              primaryColor: "#1890ff",
              secondaryColor: "#e6f7ff",
            },
          });

          return writeFile(
            path.resolve(generatedDir, icon.theme, `${icon.name}.svg`),
            svg
          );
        })
      );

      await writeFile(
        path.resolve(generatedDir, "icons.json"),
        JSON.stringify(allIcons)
      );
    })()
  );
}

{
  // --- Lucide Icons start ---
  const lucideIconsPath = path.resolve(
    require.resolve("lucide-static/package.json"),
    "../icons"
  );
  const generatedDir = path.resolve(__dirname, "../src/lucide-icon/generated");
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
  }
  mkdirSync(generatedDir);

  const defaultCategory = "default";
  const allIcons = {
    [defaultCategory]: [],
  };

  const iconsWithPath = [];

  tasks.push(
    (async () => {
      const icons = await readdir(lucideIconsPath);
      for (const icon of icons) {
        const [_m, iconName, ext] = icon.match(/^(.*?)(\.[^.]+)?$/);
        if (ext === ".svg") {
          allIcons[defaultCategory].push(iconName);
          iconsWithPath.push([
            defaultCategory,
            path.join(lucideIconsPath, icon),
          ]);
        }
      }

      await writeFile(
        path.resolve(generatedDir, "icons.json"),
        JSON.stringify(allIcons)
      );
    })()
  );
}

Promise.all(tasks).then(
  () => {
    console.log("Generate icon files done!");
  },
  (error) => {
    console.error("Generate icon files failed:", error);
  }
);
