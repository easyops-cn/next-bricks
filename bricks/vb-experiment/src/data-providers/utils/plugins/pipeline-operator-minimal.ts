import * as t from "@babel/types";
import { registerPlugin, availablePlugins } from "@babel/standalone";

const TransformPipelineOperatorMinimal = "transform-pipeline-operator-minimal";
registerPlugin(TransformPipelineOperatorMinimal, () => ({
  name: TransformPipelineOperatorMinimal,
  inherits: availablePlugins["syntax-pipeline-operator"],
  visitor: {
    BinaryExpression(path) {
      const { node } = path;
      const { operator, left, right } = node;
      if (operator !== "|>") return;
      const call = t.callExpression(right, [left as t.Expression]);
      path.replaceWith(call);
    },
  },
}));

export default TransformPipelineOperatorMinimal;
