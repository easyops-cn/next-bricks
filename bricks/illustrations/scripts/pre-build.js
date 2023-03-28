import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync, mkdirSync } from "node:fs";
import { readdir, writeFile } from "node:fs/promises";
import _ from "lodash";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const generatedDir = path.join(__dirname, "../src/generated");
if (!existsSync(generatedDir)) {
  mkdirSync(generatedDir);
}

const imagesDir =path.resolve(
  require.resolve("@next-core/illustrations/package.json"),
  "../src/images"
);

const lowerKebabCase = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;

const categoryList = await readdir(imagesDir, { withFileTypes: true });
const imagesByCategory = await Promise.all(
  categoryList.filter(item => item.isDirectory())
  .flatMap(async (item) => {
    if (!lowerKebabCase.test(item.name)) {
      throw new Error(
        `Illustrations category should always be in lower-kebab-case: ${item.name}`
      );
    }
    const categoryDir = path.join(imagesDir, item.name);
    const files = await readdir(categoryDir);
    return files
      .filter(file => /\.(?:png|jpe?g|svg|gif)$/.test(file))
      .map(
        file => {
          const extName = path.extname(file);
          const basename = path.basename(file, extName);
          if (!lowerKebabCase.test(basename)) {
            throw new Error(
              `Illustrations filename should always be in lower-kebab-case: ${item.name}/${file}`
            );
          }
          return {
            category: item.name,
            filename: file,
            basename,
          };
        }
      );
  })
);
const flattenImages = imagesByCategory.flat();

const groupedImages = Object.entries(_.groupBy(flattenImages, "category"));

const content = [
  "// istanbul ignore file",
  ...groupedImages.map(([category, icons], groupIndex) => {
    return icons
      .map((icon, i) =>
        `import c${groupIndex}_i${i} from "@next-core/illustrations/src/images/${
          category
        }/${icon.filename}";`
      )
      .join(os.EOL);
  }),
  ...groupedImages.map(([category, icons], groupIndex) => {
    return `const c${groupIndex} = {
      ${icons
        .map(
          (icon, i) =>
            `"${icon.basename}": c${groupIndex}_i${i},`
        )
        .join(os.EOL)}
    };`;
  }),
  `export default {
    ${groupedImages
      .map(
        ([category], groupIndex) =>
          `"${category}": c${groupIndex}`
      )
      .join(",")}
  } as Record<string, Record<string, string>>;`,
].join(os.EOL + os.EOL);

const indexTsPath = path.join(generatedDir, "categories.ts");
await writeFile(
  indexTsPath,
  content
);

const illustrationsByCategory = {};
groupedImages.forEach(([category, icons]) => {
  illustrationsByCategory[category] = icons.map((icon) => icon.basename);
});
const illustrationsByCategoryPath = path.join(
  generatedDir,
  "illustrationsByCategory.json"
);
await writeFile(
  illustrationsByCategoryPath,
  JSON.stringify(
    illustrationsByCategory
  )
);
