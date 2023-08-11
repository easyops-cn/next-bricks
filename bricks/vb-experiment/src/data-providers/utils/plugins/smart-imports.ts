import { registerPlugin } from "@babel/standalone";

const SmartImports = "smart-imports";
registerPlugin(
  SmartImports,
  (
    api: unknown,
    opts?: { imports: Set<string>; asImportDeclaration?: boolean }
  ) => ({
    name: SmartImports,
    visitor: {
      Identifier({ node: { name } }) {
        switch (name) {
          case "FN":
            opts?.imports.add(
              opts?.asImportDeclaration ? 'import FN from "./index.js";' : name
            );
            break;
          case "_":
            opts?.imports.add(
              opts?.asImportDeclaration ? 'import _ from "lodash";' : name
            );
            break;
          case "moment":
            opts?.imports.add(
              opts?.asImportDeclaration ? 'import moment from "moment";' : name
            );
            break;
          case "PIPES":
            opts?.imports.add(
              opts?.asImportDeclaration
                ? 'import { pipes as PIPES } from "@easyops-cn/brick-next-pipes";'
                : name
            );
            break;
        }
      },
    },
  })
);

export default SmartImports;
