/**
 * - 拷贝 @next-core/brick-icons
 * - 生成 FontAwesome 图标数据以便使用 dynamic imports
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import antdIcons from "@ant-design/icons-svg";
import antdIconsHelpers from "@ant-design/icons-svg/lib/helpers.js";
import { XMLParser, XMLBuilder } from "fast-xml-parser";

const parser = new XMLParser({
  preserveOrder: true,
  processEntities: true,
  htmlEntities: true,
  ignoreAttributes: false,
  removeNSPrefix: true,
  allowBooleanAttributes: true,
  parseTagValue: false,
  parseAttributeValue: true,
  // unpairedTags: UNPAIRED_TAGS,
  stopNodes: ["svg"],
  trimValues: false,
});

const builder = new XMLBuilder({
  preserveOrder: true,
  processEntities: true,
  htmlEntities: true,
  ignoreAttributes: false,
  removeNSPrefix: true,
  allowBooleanAttributes: true,
  parseTagValue: false,
  parseAttributeValue: true,
  // unpairedTags: UNPAIRED_TAGS,
  stopNodes: ["symbol", "defs"],
  trimValues: false,
});

let counter = 0;
function getNextIdPrefix() {
  return `d${++counter}-`;
}

async function buildSprite(spriteElements, iconPath, folder, iconName) {
  const content = await readFile(iconPath, "utf-8");
  const root = parser.parse(content);
  const svgNode = root.find((item) => item.svg);
  if (!svgNode) {
    throw new Error(`SVG not found in file ${iconPath}`);
  }
  const viewBox = svgNode[":@"]?.["@_viewBox"];

  const defsTexts = [];
  let text,
    symbol = svgNode.svg;

  if (symbol.length === 1 && (text = symbol[0]["#text"])) {
    text = text.replaceAll(/<title>[^<>]*<\/title>\s*/g, "");
    // .replaceAll(/(?<=\s)xlink:href(?==")/g, "href");
    const hasDefs = text.includes("<defs>");
    if (hasDefs) {
      const defs = [];
      text = text.replaceAll(/(<defs>[\s\S]*?<\/defs>)\s*/g, (match, p1) => {
        defs.push(p1);
        return "";
      });
      const ids = defs
        .flatMap((def) => def.match(/(?<=\sid=")([^"]+)(?=")/g) ?? [])
        .filter((id) => text.includes(`"url(#${id})"`));
      if (ids.length > 0) {
        const prefix = getNextIdPrefix();
        for (const def of defs) {
          defsTexts.push(
            def.replaceAll(/(?<=\sid=")([^"]+)(?=")/g, `${prefix}$1`)
          );
        }
        text = text.replaceAll(/(="url\(#)([^")]+\)")/g, `$1${prefix}$2`);
      }
    }
    if (!folder.startsWith("colored-")) {
      text = text.replaceAll(
        /(\s(?:fill|stroke|(?:(?:stop|flood|lighting)-)?color)=)"(?!none)[^"]+"/g,
        '$1"currentColor"'
      );
    }
    symbol = [{ "#text": text }];
  }

  const symbolNode = {
    symbol,
    ":@": {
      "@_id": `${folder}--${iconName}`,
      ...(viewBox
        ? {
            "@_viewBox": viewBox,
          }
        : null),
    },
  };
  spriteElements.unshift(...defsTexts);
  const symbolText = builder.build([symbolNode]);
  spriteElements.push(symbolText);
}

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

  const spriteElements = [];

  tasks.push(
    readdir(legacyEasyOpsIconsPath, { withFileTypes: true })
      .then((list) =>
        Promise.all(
          list.map(async (item) => {
            if (item.isDirectory() && /\w/.test(item.name)) {
              const categoryDir = path.resolve(
                legacyEasyOpsIconsPath,
                item.name
              );
              if (!allIcons[item.name]) {
                allIcons[item.name] = [];
              }
              return readdir(categoryDir).then((icons) =>
                Promise.all(
                  icons
                    .filter((icon) => icon.endsWith(".svg"))
                    .map(async (icon) => {
                      const iconName = icon.substring(0, icon.length - 4);
                      allIcons[item.name].push(iconName);
                      const iconPath = path.join(
                        legacyEasyOpsIconsPath,
                        item.name,
                        icon
                      );
                      await buildSprite(
                        spriteElements,
                        iconPath,
                        item.name,
                        iconName
                      );
                    })
                )
              );
            } else if (item.name.endsWith(".svg")) {
              const iconName = item.name.substring(0, item.name.length - 4);
              allIcons.default.push(iconName);
              const iconPath = path.join(legacyEasyOpsIconsPath, item.name);
              await buildSprite(spriteElements, iconPath, "default", iconName);
            }
          })
        )
      )
      .then(() =>
        Promise.all([
          writeFile(
            path.resolve(newEasyOpsIconsPath, "icons.json"),
            JSON.stringify(allIcons)
          ),
          writeFile(
            path.resolve(newEasyOpsIconsPath, "sprite.svg"),
            `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n${spriteElements.join(
              "\n"
            )}\n</svg>`
          ),
        ])
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
    process.exitCode = 1;
  }
);
