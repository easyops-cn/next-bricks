import { readdir } from "node:fs/promises";
import path from "node:path";

const lowerKebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const iconsDir = path.join(process.cwd(), "src/icons");

const list = await readdir(iconsDir, { withFileTypes: true });

function ensureIcon(category, icon) {
  const [_, iconName, ext] = icon.match(/^(.*?)(\.[^.]+)?$/);
  if (ext !== undefined && [".svg", ".png", ".gif"].includes(ext)) {
    if (!lowerKebabCase.test(iconName)) {
      throw new Error(
        `Icon name should always be in lower-kebab-case: ${icon} in ${category}`
      );
    }
    const isImageCategory = category === "image";
    const isNonSvg = ext !== ".svg";
    if (isImageCategory !== isNonSvg) {
      throw new Error(
        isImageCategory
          ? `Icons in category of image should be in PNG or GIF format: ${icon}`
          : `Icons in category other than image should be in SVG format: ${icon} in category ${category}`
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
