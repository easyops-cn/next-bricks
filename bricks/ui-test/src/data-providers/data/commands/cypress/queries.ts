import { CommandDoc } from "../../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "../utils.js";

export default function getCypressQueryCommands(): CommandDoc[] {
  return [
    {
      name: "as",
      category: "query",
      description: "设置一个别名，以便后续引用",
      chain: "child",
      from: "cypress",
      params: [
        {
          label: "Alias name",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
      icon: {
        lib: "fa",
        icon: "at",
      },
    },
    {
      name: "children",
      category: "query",
      description: "获取所有子元素",
      chain: "child",
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
      description: "获取最近的一个满足条件的元素（自己或其祖先元素）",
      chain: "child",
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
      description: "获取包含指定文本的元素",
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
      description: "获取当前页面的 `window.document` 对象",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "eq",
      category: "query",
      description:
        "获取指定序号对应的元素（从 0 开始计数，设置负数时从最后查找）",
      chain: "child",
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
      description: "获取与选择器匹配的元素",
      chain: "child",
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
      description: "根据选择器获取匹配的后代元素",
      chain: "child",
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
      description: "获取第一个元素",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "focused",
      category: "query",
      description: "获取当前聚焦的元素",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "get",
      category: "query",
      description: "根据选择器或别名获取元素",
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
      description: "获取当前页面的 URL 的 hash 部分",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // TODO: invoke (spread args)
    {
      name: "its",
      category: "query",
      description: "获取当前对象的指定属性的值",
      chain: "child",
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
      description: "获取最后一个元素",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "location",
      category: "query",
      description: "获取当前页面的 `window.location` 对象",
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
      description: "获取紧邻的后一个同级元素",
      chain: "child",
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
      description: "获取所有后面的同级元素",
      chain: "child",
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
      description: "获取所有后面的同级元素，直到匹配指定选择器（不含）",
      category: "query",
      chain: "child",
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
      description: "获取与选择器不匹配的元素",
      chain: "child",
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
      description: "获取父元素",
      chain: "child",
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
      description: "获取所有祖先元素",
      chain: "child",
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
      description: "获取所有祖先元素，直到匹配指定选择器（不含）",
      chain: "child",
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
      description: "获取紧邻的前一个同级元素",
      chain: "child",
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
      description: "获取所有前面的同级元素",
      chain: "child",
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
      description: "获取所有前面的同级元素，直到匹配指定选择器（不含）",
      chain: "child",
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
      description: "获取根元素",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "shadow",
      category: "query",
      description: "在元素的 shadow DOM 中查找元素",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "siblings",
      category: "query",
      description: "获取所有同级元素",
      chain: "child",
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
      description: "获取当前页面的标题",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "url",
      category: "query",
      description: "获取当前页面的 URL",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    {
      name: "window",
      category: "query",
      description: "获取当前页面的 `window` 对象",
      chain: "parent",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
  ];
}
