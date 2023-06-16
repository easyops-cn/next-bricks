/**
 * - 拷贝 @next-core/brick-icons
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

const { renderIconDefinitionToSVGElement } = antdIconsHelpers;

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {Promises<unknown>[]} */
const tasks = [];

{
  // --- EasyOps Icons start ---
  const legacyEasyOpsIconsPath = path.resolve(
    require.resolve("@next-core/brick-icons/package.json"),
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
    readdir(legacyEasyOpsIconsPath, { withFileTypes: true })
      .then((list) =>
        Promise.all(
          list.map((item) => {
            if (item.isDirectory() && /\w/.test(item.name)) {
              const categoryDir = path.resolve(
                legacyEasyOpsIconsPath,
                item.name
              );
              if (!allIcons[item.name]) {
                allIcons[item.name] = [];
              }
              return readdir(categoryDir).then((icons) =>
                icons
                  .filter((icon) => icon.endsWith(".svg"))
                  .map((icon) => {
                    allIcons[item.name].push(
                      icon.substring(0, icon.length - 4)
                    );
                  })
              );
            } else if (item.name.endsWith(".svg")) {
              allIcons.default.push(
                item.name.substring(0, item.name.length - 4)
              );
            }
          })
        )
      )
      .then(() =>
        writeFile(
          path.resolve(newEasyOpsIconsPath, "icons.json"),
          JSON.stringify(allIcons)
        )
      )
  );
}

{
  // --- FontAwesome Icons start ---
  const generatedDir = path.resolve(__dirname, "../src/fa-icon/generated");
  if (existsSync(generatedDir)) {
    rmSync(generatedDir, { recursive: true, force: true });
  }
  mkdirSync(generatedDir);

  const iconsDir = path.resolve(generatedDir, "icons");
  mkdirSync(iconsDir);

  const iconCategories = {
    far,
    fas,
    fab,
  };
  const aliasMapByCategory = {};
  const allIcons = {};

  for (const category of Object.keys(iconCategories)) {
    mkdirSync(path.resolve(iconsDir, category));
    allIcons[category] = [];
  }

  for (const [category, pack] of Object.entries(iconCategories)) {
    const aliasMap = (aliasMapByCategory[category] = {});
    const copyIcons = Promise.all(
      Object.values(pack).flatMap((item) => {
        const aliases = item.icon[2].filter(
          (alias) => typeof alias === "string"
        );
        allIcons[category].push(item.iconName);
        for (const alias of aliases) {
          allIcons[category].push(alias);
          aliasMap[alias] = item.iconName;
        }
        return writeFile(
          path.resolve(iconsDir, `${category}/${item.iconName}.json`),
          JSON.stringify(item)
        );
      })
    );

    tasks.push(copyIcons);
  }

  tasks.push(
    writeFile(
      path.resolve(generatedDir, "alias.json"),
      JSON.stringify(aliasMapByCategory)
    )
  );

  tasks.push(
    writeFile(
      path.resolve(generatedDir, "icons.json"),
      JSON.stringify(allIcons)
    )
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

  const generateIcons = Promise.all(
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
  tasks.push(generateIcons);

  tasks.push(
    writeFile(
      path.resolve(generatedDir, "icons.json"),
      JSON.stringify(allIcons)
    )
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
