// istanbul ignore file
import { createProviderClass } from "@next-core/utils/general";
import promptOfBoolean from "./prompts/raw-data-boolean.md";
import promptOfDateTime from "./prompts/raw-data-date-time.md";
import promptOfEnum from "./prompts/raw-data-enum.md";
import promptOfNumber from "./prompts/raw-data-number.md";
import promptOfOthers from "./prompts/raw-data-others.md";
import promptOfStructList from "./prompts/raw-data-struct-list.md";
import promptOfStruct from "./prompts/raw-data-struct.md";

export function getRawDataSystemPrompts(): Record<string, string> {
  return {
    boolean: promptOfBoolean,
    "date-time": promptOfDateTime,
    enum: promptOfEnum,
    number: promptOfNumber,
    others: promptOfOthers,
    "struct-list": promptOfStructList,
    struct: promptOfStruct,
  };
}

customElements.define(
  "visual-builder.get-raw-data-system-prompts",
  createProviderClass(getRawDataSystemPrompts)
);
