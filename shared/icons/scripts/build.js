import { readdir } from "node:fs/promises";
import path from "node:path";

const lowerKebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const iconsDir = path.join(process.cwd(), "src/icons");

const list = await readdir(iconsDir, { withFileTypes: true });

function ensureIcon(category, icon) {
  if (icon.endsWith(".svg")) {
    const iconName = path.basename(icon, ".svg");
    if (!lowerKebabCase.test(iconName)) {
      throw new Error(
        `Icon name should always be in lower-kebab-case: ${iconName} in ${category}`
      );
    }
  }
}

for (const item of list) {
  if (item.isDirectory()) {
    const category = item.name;
    if (!lowerKebabCase.test(category)) {
      throw new Error(
        `Icon category should always be in lower-kebab-case: ${category}`
      );
    }
    const icons = await readdir(path.join(iconsDir, category));
    for (const icon of icons) {
      ensureIcon(category, icon);
    }
  } else {
    ensureIcon("default", item.name);
  }
}
