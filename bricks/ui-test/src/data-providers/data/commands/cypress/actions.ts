import { CommandDoc } from "../../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "../utils.js";

export default function getCypressActionCommands(): CommandDoc[] {
  return [
    {
      name: "check",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Check all",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "Check by a single value",
          params: [
            {
              label: "Value",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "Check by multiple values",
          params: [
            {
              label: "Values",
              required: true,
              type: "array",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "clear",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "click",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "dblclick",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "rightclick",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "scrollIntoView",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "scrollTo",
      category: "action",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "With position",
          params: [
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "Select",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Select by a single value or text content",
          params: [
            {
              label: "Value",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "Select by a single index",
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
          label: "Select by multiple values or indexes or text contents",
          params: [
            {
              label: "Values",
              required: true,
              type: "array",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    // Todo: selectFile
    {
      name: "trigger",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Without position",
          params: [
            {
              label: "Event name",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With position",
          params: [
            {
              label: "Event name",
              required: true,
              type: "string",
            },
            {
              label: "Position",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With coordinates",
          params: [
            {
              label: "Event name",
              required: true,
              type: "string",
            },
            {
              label: "X",
              required: true,
              type: "number",
            },
            {
              label: "Y",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "type",
      category: "action",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Text",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
      icon: {
        lib: "fa",
        icon: "keyboard",
      },
    },
    {
      name: "uncheck",
      category: "action",
      chain: "child",
      from: "cypress",
      overloads: [
        {
          label: "Uncheck all",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "Uncheck by a single value",
          params: [
            {
              label: "Value",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "Uncheck by multiple values",
          params: [
            {
              label: "Values",
              required: true,
              type: "array",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
  ];
}
