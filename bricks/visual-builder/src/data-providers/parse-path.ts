import { createProviderClass } from "@next-core/utils/general";
import { defaults } from "lodash";
import { pathToRegexp, Key } from "path-to-regexp";

interface Option {
  end?: boolean;
  strict?: boolean;
  sensitive?: boolean;
}

export async function parsePath(path: string, options?: Option) {
  const defaultParams = { end: false, strict: false, sensitive: true };

  const keys: Key[] = [];
  const regexp = pathToRegexp(path, keys, defaults(options, defaultParams));

  return {
    regexp,
    keys,
  };
}

customElements.define(
  "visual-builder.parse-path",
  createProviderClass(parsePath)
);
