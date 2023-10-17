import { CommandDoc } from "../../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "../utils.js";

export default function getCypressActionCommands(): CommandDoc[] {
  return [
    {
      name: "check",
      category: "action",
      description: "勾选 checkbox 或 radio",
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
      description: "清除文本输入框的内容",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "click",
      category: "action",
      description: "鼠标点击",
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
      description: "鼠标双击",
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
      description: "鼠标右键点击",
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
      description: "将元素滚动到视图中",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "scrollTo",
      category: "action",
      description: "滚动到指定位置",
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
      description: "选中指定选项",
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
      description: "触发指定事件",
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
      description: "输入指定内容",
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
      description: "取消勾选 checkbox",
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
