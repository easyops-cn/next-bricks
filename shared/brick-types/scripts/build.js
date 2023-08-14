// @ts-check
import { existsSync } from "node:fs";
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as t from "@babel/types";
import babelGenerator from "@babel/generator";

const { default: generate } = babelGenerator;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const bricksDir = path.join(__dirname, "../../../bricks");
const brickFolders = await readdir(bricksDir, { withFileTypes: true });

const ignoreBrickPackages = new Set([
  "illustrations",
  "form-renderer",
  "shoelace",
  "ui-test",
  "v2-adapter",
  "vb-experiment",
]);

/** @type {t.TSTypeElement[]} */
const brickDeclarations = [];

await Promise.all(
  brickFolders.map(async (folder) => {
    if (!folder.isDirectory() || ignoreBrickPackages.has(folder.name)) {
      return;
    }
    const distDir = path.join(bricksDir, folder.name, "dist");
    const manifestJsonPath = path.join(distDir, "manifest.json");
    const typesJsonPath = path.join(distDir, "types.json");
    if (!existsSync(manifestJsonPath) || !existsSync(typesJsonPath)) {
      return;
    }
    const [manifestJson, typesJson] = await Promise.all(
      [manifestJsonPath, typesJsonPath].map(async (p) =>
        JSON.parse(await readFile(p, "utf-8"))
      )
    );

    for (const item of manifestJson.bricks ?? []) {
      const dec = t.tsPropertySignature(
        t.stringLiteral(item.name.replaceAll(".", "_")),
        t.tsTypeAnnotation(t.tsAnyKeyword())
      );
      brickDeclarations.push(dec);
    }
  })
);

const { code } = generate(
  t.program([
    t.tsModuleDeclaration(
      t.identifier("JSX"),
      t.tsModuleBlock([
        t.tsInterfaceDeclaration(
          t.identifier("IntrinsicElements"),
          null,
          null,
          t.tsInterfaceBody(brickDeclarations)
        ),
      ])
    ),
  ])
);

await writeFile(path.join(__dirname, "../index.d.ts"), code);
