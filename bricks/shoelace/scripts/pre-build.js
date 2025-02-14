import { existsSync, mkdirSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {(string|string[])[]} */
const elements = [
  ["alert", "dialog", "tooltip"],
  "avatar",
  "badge",
  ["breadcrumb", "breadcrumb-item"],
  "button",
  "button-group",
  "card",
  ["carousel", "carousel-item"],
  "checkbox",
  "color-picker",
  "details",
  // "dialog",
  "divider",
  "drawer",
  "dropdown",
  "icon",
  "icon-button",
  "image-comparer",
  "input",
  ["menu", "menu-item"],
  "menu-label",
  "option",
  "progress-bar",
  "progress-ring",
  "qr-code",
  "radio",
  "radio-button",
  "radio-group",
  "range",
  "rating",
  "select",
  "skeleton",
  "spinner",
  "split-panel",
  "switch",
  ["tab-group", "tab", "tab-panel"],
  "tag",
  "textarea",
  // "tooltip",
  ["tree", "tree-item"],
  "animated-image",
  "animation",
  "format-bytes",
  "format-date",
  "format-number",
  "mutation-observer",
  "popup",
  "relative-time",
  "resize-observer",
  "visually-hidden",
];

const generatedDir = path.resolve(__dirname, "../src/generated");

if (!existsSync(generatedDir)) {
  mkdirSync(generatedDir);
}

await Promise.all(
  elements.map((element) => {
    /** @type {string} */
    let filePath;
    /** @type {string} */
    let content;
    if (Array.isArray(element)) {
      filePath = path.join(generatedDir, `${element[0]}.ts`);
      content = `// Define bricks: ${element.map((e) => `sl-${e}`).join(", ")}
${element
  .map((e) => `import "@shoelace-style/shoelace/dist/components/${e}/${e}.js";`)
  .join("\n")}
import "../shared/common.js";
`;
    } else {
      filePath = path.join(generatedDir, `${element}.ts`);
      content = `// Define brick: sl-${element}
import "@shoelace-style/shoelace/dist/components/${element}/${element}.js";
import "../shared/common.js";
`;
    }
    return writeFile(filePath, content);
  })
);

const indexPath = path.join(generatedDir, "index.ts");
const indexContent = elements
  .map(
    (element) =>
      `import "./${Array.isArray(element) ? element[0] : element}.js";`
  )
  .join("\n");
await writeFile(indexPath, indexContent);
