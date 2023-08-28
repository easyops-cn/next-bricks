import { CommandParam } from "../../../interface.js";

export function getParamDefinitionOfArbitraryOptions() {
  return {
    label: "Options",
    type: "object",
  } as CommandParam;
}
