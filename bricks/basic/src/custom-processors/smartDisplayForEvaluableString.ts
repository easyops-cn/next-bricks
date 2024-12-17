// istanbul ignore file
import { customProcessors } from "@next-core/runtime";
import { smartDisplayForEvaluableString } from "@next-shared/general/smartDisplayForEvaluableString";

customProcessors.define(
  "basic.smartDisplayForEvaluableString",
  smartDisplayForEvaluableString
);
