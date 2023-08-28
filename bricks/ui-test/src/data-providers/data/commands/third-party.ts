import { CommandDoc } from "../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "./utils.js";

export default function getThirdPartyCommands(): CommandDoc[] {
  return [
    // <!-- Testing-library commands start
    {
      name: "findByTestId",
      category: "query",
      chain: "dual",
      from: "third-party",
      params: [
        {
          label: "Test ID",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
      keywords: ["find", "test", "testid", "test-id"],
    },
    // Testing-library commands end -->
  ];
}
