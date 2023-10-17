import { CommandDoc } from "../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "./utils.js";

export default function getThirdPartyCommands(): CommandDoc[] {
  return [
    // <!-- Testing-library commands start
    {
      name: "findByTestId",
      category: "query",
      description: "根据 `data-testid` 获取元素",
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
      keywords: ["test-id"],
    },
    {
      name: "findAllByTestId",
      category: "query",
      description: "根据 `data-testid` 获取所有元素",
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
      keywords: ["test-id"],
    },
    {
      name: "findByRole",
      category: "query",
      description: "根据 `role` 获取元素",
      chain: "dual",
      from: "third-party",
      params: [
        {
          label: "Role",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "findAllByRole",
      category: "query",
      description: "根据 `role` 获取所有元素",
      chain: "dual",
      from: "third-party",
      params: [
        {
          label: "Role",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "findByTitle",
      category: "query",
      description: "根据 `title` 获取元素",
      chain: "dual",
      from: "third-party",
      params: [
        {
          label: "Title",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "findAllByTitle",
      category: "query",
      description: "根据 `title` 获取所有元素",
      chain: "dual",
      from: "third-party",
      params: [
        {
          label: "Title",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    // Testing-library commands end -->
  ];
}
