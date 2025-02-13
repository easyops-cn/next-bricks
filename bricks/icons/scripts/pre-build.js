/**
 * - 拷贝 @next-shared/icons
 * - 生成 FontAwesome 图标数据以便使用 dynamic imports
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { createHash } from "node:crypto";
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

  const ranges = {};
  const allSvg = [];
  const iconsWithPath = [];
  let cursor = -2;

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
                iconsWithPath.push([
                  item.name,
                  path.join(legacyEasyOpsIconsPath, item.name, icon),
                ]);
              }
            }
          } else if (item.name.endsWith(".svg")) {
            const iconName = item.name.substring(0, item.name.length - 4);
            allIcons.default.push(iconName);
            iconsWithPath.push([
              "default",
              path.join(legacyEasyOpsIconsPath, item.name),
            ]);
          }
        })
      );

      const hashes = [];

      // Have to be sequential
      for (const [category, iconPath] of iconsWithPath) {
        const svg = await readFile(iconPath);
        allSvg.push(svg);

        let groupRanges = ranges[category];
        if (!_.has(ranges, category)) {
          groupRanges = ranges[category] = [];
        }
        cursor += svg.length + 1;
        groupRanges.push(cursor);

        const sha1 = createHash("sha1");
        sha1.update(svg);
        hashes.push(sha1.digest("hex").substring(0, 8));
      }

      // Let final hash to be irrelevant to the order of icons
      hashes.sort();
      const sha1 = createHash("sha1");
      sha1.update(hashes.join(""));
      ranges._hash = sha1.digest("hex").substring(0, 8);

      await Promise.all([
        writeFile(
          path.resolve(newEasyOpsIconsPath, "icons.json"),
          JSON.stringify(allIcons)
        ),
        writeFile(
          path.resolve(newEasyOpsIconsPath, "ranges.json"),
          JSON.stringify(ranges)
        ),
        writeFile(
          path.resolve(newEasyOpsIconsPath, `all.${ranges._hash}.svg`),
          allSvg.join("\n")
        ),
      ]);
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

  const ranges = {};
  const allJson = [];
  let cursor = -2;

  tasks.push(
    (async () => {
      const hashes = [];

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

              let groupRanges = ranges[category];
              if (!_.has(ranges, category)) {
                groupRanges = ranges[category] = [];
              }
              cursor += content.length + 1;
              groupRanges.push(cursor);

              allJson.push(content);

              const sha1 = createHash("sha1");
              sha1.update(content);
              hashes.push(sha1.digest("hex").substring(0, 8));

              return writeFile(
                path.resolve(generatedDir, `${category}/${item.iconName}.json`),
                content
              );
            })
          );
        })
      );

      hashes.sort();
      const sha1 = createHash("sha1");
      sha1.update(hashes.join(""));
      ranges._hash = sha1.digest("hex").substring(0, 8);

      await Promise.all([
        writeFile(
          path.resolve(generatedDir, "alias.json"),
          JSON.stringify(aliasMapByCategory)
        ),
        writeFile(
          path.resolve(generatedDir, "icons.json"),
          JSON.stringify(allIcons)
        ),
        writeFile(
          path.resolve(generatedDir, "ranges.json"),
          JSON.stringify(ranges)
        ),
        writeFile(
          path.resolve(generatedDir, `all.${ranges._hash}.json`),
          allJson.join("\n")
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

  const ranges = {};
  const allSvg = [];
  let cursor = -2;

  tasks.push(
    (async () => {
      const hashes = [];

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

          let groupRanges = ranges[icon.theme];
          if (!_.has(ranges, icon.theme)) {
            groupRanges = ranges[icon.theme] = [];
          }
          cursor += svg.length + 1;
          groupRanges.push(cursor);

          allSvg.push(svg);

          const sha1 = createHash("sha1");
          sha1.update(svg);
          hashes.push(sha1.digest("hex").substring(0, 8));

          return writeFile(
            path.resolve(generatedDir, icon.theme, `${icon.name}.svg`),
            svg
          );
        })
      );

      hashes.sort();
      const sha1 = createHash("sha1");
      sha1.update(hashes.join(""));
      ranges._hash = sha1.digest("hex").substring(0, 8);

      await Promise.all([
        writeFile(
          path.resolve(generatedDir, "icons.json"),
          JSON.stringify(allIcons)
        ),
        writeFile(
          path.resolve(generatedDir, "ranges.json"),
          JSON.stringify(ranges)
        ),
        writeFile(
          path.resolve(generatedDir, `all.${ranges._hash}.svg`),
          allSvg.join("\n")
        ),
      ]);
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
