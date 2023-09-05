import * as t from "@babel/types";
import { registerPlugin } from "@babel/standalone";
import { hasOwnProperty } from "@next-core/utils/general";

const EXPRESSION_GLOBALS = new Set([
  "_",
  "location",
  "moment",
  "ANCHOR",
  "APP",
  "BASE_URL",
  "CTX",
  "DATA",
  "EVENT",
  "FLAGS",
  "FN",
  "HASH",
  "I18N_TEXT",
  "I18N",
  "IMG",
  "INSTALLED_APPS",
  "ITEM",
  "INDEX",
  "LOCAL_STORAGE",
  "MEDIA",
  "MISC",
  "PARAMS",
  "PATH_NAME",
  "PATH",
  "PERMISSIONS",
  "PIPES",
  "PROCESSORS",
  "QUERY_ARRAY",
  "QUERY",
  "SESSION_STORAGE",
  "STATE",
  "SYS",
  "THEME",
  "TAG_URL",
  "SAFE_TAG_URL",
]);

const SmartImports = "smart-imports";
registerPlugin(
  SmartImports,
  (api: unknown, opts?: { imports: Set<string> }) => ({
    name: SmartImports,
    visitor: {
      Identifier(path) {
        const { node, scope, key, parent } = path;
        const { name } = node;
        if (
          scope.hasGlobal(name) &&
          name !== "undefined" &&
          !(
            key === "key" &&
            parent.type === "ObjectProperty" &&
            !parent.computed
          ) &&
          !(
            key === "property" &&
            parent.type === "MemberExpression" &&
            !parent.computed
          )
        ) {
          if (EXPRESSION_GLOBALS.has(name)) {
            opts?.imports.add(name);
          } else if (
            process.env.NODE_ENV === "development" &&
            !hasOwnProperty(window, name) &&
            !scope.hasBinding(name) &&
            !t.isTypeScript(parent)
          ) {
            // eslint-disable-next-line no-console
            console.error(
              "Unhandled global variable in expression:",
              name,
              path
            );
          }
        }
      },
    },
  })
);

export default SmartImports;
