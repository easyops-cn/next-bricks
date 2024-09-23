// istanbul ignore file
// @ts-check

// Use .mjs to avoid jest coverage collection error:
// ```
// Error: unknown: import.meta may appear only with 'sourceType: "module"'
// ```

/** @type {Worker | undefined} */
let worker;

/**
 * @returns {Worker}
 */
export function getYamlLinterWorker() {
  if (!worker) {
    worker = new Worker(new URL("./yamlLinter.worker.ts", import.meta.url));
  }
  return worker;
}
