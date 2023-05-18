import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import getExamples from "@next-core/brick-playground/getExamples";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(__dirname, "../dist");
const distPlaygroundDir = path.join(distDir, "playground");
const distPreviewDir = path.join(distPlaygroundDir, "preview");
const srcPlaygroundDir = path.join(
  require.resolve("@next-core/brick-playground/package.json"),
  ".."
);

if (existsSync(distDir)) {
  await rm(distDir, { recursive: true, force: true });
}

await mkdir(distDir);
await mkdir(distPlaygroundDir);

await cp(
  path.join(srcPlaygroundDir, "dist"),
  distPlaygroundDir,
  {
    recursive: true
  }
);

const srcBricksDir = path.join(__dirname, "../bricks");
const distBricksDir = path.join(distPreviewDir, "bricks");

const pkgDirList = await readdir(
  srcBricksDir,
  { withFileTypes: true }
);

const brickPackages = [];

await Promise.all(
  pkgDirList.map(
    async (dir) => {
      if (dir.isDirectory()) {
        const pkgDir = path.join(srcBricksDir, dir.name);
        const itemDistDir = path.join(pkgDir, "dist");
        if (existsSync(itemDistDir)) {
          const bricksJsonPath = path.join(itemDistDir, "bricks.json");
          if (existsSync(bricksJsonPath)) {
            await cp(itemDistDir, path.join(distBricksDir, dir.name, "dist"), {
              recursive: true
            });
            const bricksJson = JSON.parse(
              await readFile(bricksJsonPath, "utf-8")
            );
            brickPackages.push(bricksJson);
          }
        }
      }
    }
  )
);

const bootstrapJson = JSON.stringify({ brickPackages });
const bootstrapHash = getContentHash(bootstrapJson);
const bootstrapJsonPath = `bootstrap.${bootstrapHash}.json`;

await writeFile(
  path.join(distPreviewDir, bootstrapJsonPath),
  bootstrapJson
);

const examplesJson = JSON.stringify({ examples: await getExamples(srcBricksDir) });
const examplesHash = getContentHash(examplesJson);
const examplesJsonPath = `examples.${examplesHash}.json`;

await writeFile(
  path.join(distPlaygroundDir, examplesJsonPath),
  examplesJson
);

await replaceContent(
  path.join(distPlaygroundDir, "index.html"),
  "examples.hash.json",
  examplesJsonPath
);

await replaceContent(
  path.join(distPreviewDir, "index.html"),
  "bootstrap.hash.json",
  bootstrapJsonPath
);

await writeFile(
  path.join(distDir, ".nojekyll"),
  ""
);

function getContentHash(content) {
  const hash = createHash("sha1");
  hash.update(content);
  return hash.digest("hex").slice(0, 8);
}

// Replace content in file
async function replaceContent(filePath, match, replacement) {
  const content = await readFile(filePath, "utf-8");
  await writeFile(filePath, content.replace(match, replacement));
}
