import * as t from "@babel/types";
import { registerPlugin } from "@babel/standalone";

const TransformStoryboardFunction = "transform-storyboard-function";
registerPlugin(TransformStoryboardFunction, () => ({
  name: TransformStoryboardFunction,
  visitor: {
    FunctionDeclaration(path) {
      if (path.parent.type === "Program") {
        path.replaceWith(t.exportDefaultDeclaration(path.node));
      }
    },
  },
}));

export default TransformStoryboardFunction;
