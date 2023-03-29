import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { existsSync } from "node:fs";
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const distDir = path.join(__dirname, "../dist");
const distPlaygroundDir = path.join(distDir, "playground");

if (existsSync(distDir)) {
  await rm(distDir, { recursive: true, force: true });
}

await mkdir(distDir);
await mkdir(distPlaygroundDir);

await cp(
  path.join(
    require.resolve("@next-core/brick-playground/package.json"),
    "../dist"
  ),
  distPlaygroundDir,
  {
    recursive: true
  }
);

const srcBricksDir = path.join(__dirname, "../bricks");
const distBricksDir = path.join(distPlaygroundDir, "bricks");

const list = await readdir(
  srcBricksDir,
  { withFileTypes: true }
);

const brickPackages = await Promise.all(
  list.map(
    async (dir) => {
      if (dir.isDirectory()) {
        const itemDistDir = path.join(srcBricksDir, dir.name, "dist");
        if (existsSync(itemDistDir)) {
          const bricksJsonPath = path.join(itemDistDir, "bricks.json");
          if (existsSync(bricksJsonPath)) {
            await cp(itemDistDir, path.join(distBricksDir, dir.name, "dist"), {
              recursive: true
            });
            const bricksJson = JSON.parse(
              await readFile(bricksJsonPath, "utf-8")
            );
            return bricksJson;
          }
        }
      }
    }
  )
);

await writeFile(
  path.join(distPlaygroundDir, "bootstrap.hash.json"),
  JSON.stringify({
    brickPackages: brickPackages.filter(Boolean)
  })
);
