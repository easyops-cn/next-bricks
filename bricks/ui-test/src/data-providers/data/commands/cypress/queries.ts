import { CommandDoc } from "../../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "../utils.js";

export default function getCypressQueryCommands(): CommandDoc[] {
  return [
    {
      name: "as",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Alias name",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "children",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "No selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "By selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "closest",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "contains",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "By content",
          params: [
            {
              label: "Content",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "By selector and content",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Content",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "document",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "eq",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Index",
          required: true,
          type: "number",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "filter",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "find",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "first",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "focused",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "get",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "Selector (or alias)",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "hash",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // TODO: invoke (spread args)
    {
      name: "its",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Property name",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "last",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "location",
      category: "query",
      chain: "parent",
      from: "cypress",
      overloads: [
        {
          label: "Without key",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With key",
          params: [
            {
              label: "Key",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "next",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "nextAll",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "nextUntil",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Filter",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "not",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [
        {
          label: "Selector",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "parent",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "parents",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "parentsUntil",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Filter",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "prev",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "prevAll",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "prevUntil",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With filter",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            {
              label: "Filter",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "root",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "shadow",
      category: "query",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "siblings",
      category: "query",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without selector",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With selector",
          params: [
            {
              label: "Selector",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "title",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "url",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "window",
      category: "query",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
  ];
}
