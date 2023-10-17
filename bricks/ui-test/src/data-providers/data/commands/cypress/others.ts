import { CommandDoc } from "../../../../interface.js";
import { getParamDefinitionOfArbitraryOptions } from "../utils.js";

export default function getCypressOtherCommands(): CommandDoc[] {
  return [
    {
      name: "blur",
      category: "other",
      description: "解除一个已聚焦的元素的聚焦状态",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // {
    //   name: "clearAllCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearAllLocalStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearAllSessionStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearCookie",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     {
    //       label: "Name",
    //       required: true,
    //       type: "string",
    //     },
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "clearLocalStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   overloads: [
    //     {
    //       label: "Clear by a single key",
    //       params: [
    //         {
    //           label: "Key",
    //           required: true,
    //           type: "string",
    //         },
    //         getParamDefinitionOfArbitraryOptions(),
    //       ],
    //     },
    //     {
    //       label: "Clear by multiple keys",
    //       params: [
    //         {
    //           label: "Keys",
    //           required: true,
    //           type: "array",
    //         },
    //         getParamDefinitionOfArbitraryOptions(),
    //       ],
    //     },
    //   ],
    // },
    // Ignore: clock
    {
      name: "debug",
      category: "other",
      description: "设置一个调试断点，并打印前一个命令的产物",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // Ignore: each
    // Ignore: exec
    // Ignore: fixture
    {
      name: "focus",
      category: "other",
      description: "聚焦到一个元素上",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // {
    //   name: "getAllCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getAllLocalStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getAllSessionStorage",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getCookie",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     {
    //       label: "Name",
    //       required: true,
    //       type: "string",
    //     },
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // {
    //   name: "getCookies",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    {
      name: "go",
      category: "other",
      description: "控制浏览器前进或后退（负数后退，正数前进）",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "Position",
          required: true,
          type: "number",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    // Ignore: intercept
    // Ignore: log
    // Ignore: origin
    {
      name: "pause",
      category: "other",
      description: "暂停测试",
      chain: "dual",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // Ignore: readFile
    {
      name: "reload",
      category: "other",
      description: "重新载入页面",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "Force reload",
          type: "boolean",
          default: false,
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
    },
    {
      name: "request",
      category: "other",
      description: "发起 HTTP 请求",
      chain: "parent",
      from: "cypress",
      overloads: [
        {
          label: "With URL",
          params: [
            {
              label: "URL",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With method and URL",
          params: [
            {
              label: "Method",
              required: true,
              type: "string",
              enum: [
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "HEAD",
                "OPTIONS",
              ],
            },
            {
              label: "URL",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "With options only",
          params: [
            {
              label: "Options",
              type: "object",
            },
          ],
        },
      ],
    },
    {
      name: "screenshot",
      category: "other",
      description: "截图",
      chain: "dual",
      from: "cypress",
      overloads: [
        {
          label: "Without filename",
          params: [getParamDefinitionOfArbitraryOptions()],
        },
        {
          label: "With filename",
          params: [
            {
              label: "filename",
              required: true,
              type: "string",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    // Ignore: session
    // {
    //   name: "setCookie",
    //   category: "other",
    //   chain: "parent",
    //   from: "cypress",
    //   params: [
    //     {
    //       label: "name",
    //       required: true,
    //       type: "string",
    //     },
    //     {
    //       label: "Value",
    //       required: true,
    //       type: "string",
    //     },
    //     getParamDefinitionOfArbitraryOptions(),
    //   ],
    // },
    // Ignore: spread
    // Ignore: spy
    // Ignore: stub
    {
      name: "submit",
      category: "other",
      description: "提交一个表单",
      chain: "child",
      from: "cypress",
      params: [getParamDefinitionOfArbitraryOptions()],
    },
    // Ignore: task
    // Ignore: then
    // Ignore: tick
    {
      name: "viewport",
      category: "other",
      description: "控制视窗大小和朝向",
      chain: "parent",
      from: "cypress",
      overloads: [
        {
          label: "By dimension",
          params: [
            {
              label: "width",
              required: true,
              type: "number",
            },
            {
              label: "height",
              required: true,
              type: "number",
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
        {
          label: "By preset",
          params: [
            {
              label: "preset",
              required: true,
              type: "string",
              enum: ["macbook-11", "macbook-13", "macbook-15", "macbook-16"],
            },
            {
              label: "orientation",
              // Note: in Cypress, the default orientation is "portrait"
              default: "landscape",
              type: "string",
              enum: ["landscape", "portrait"],
            },
            getParamDefinitionOfArbitraryOptions(),
          ],
        },
      ],
    },
    {
      name: "visit",
      category: "other",
      description: "访问指定 URL",
      chain: "parent",
      from: "cypress",
      params: [
        {
          label: "URL",
          required: true,
          type: "string",
        },
        getParamDefinitionOfArbitraryOptions(),
      ],
      icon: {
        lib: "fa",
        prefix: "far",
        icon: "compass",
        color: "var(--palette-teal-6)",
      },
    },
    // Ignore: wait
    // Ignore: within
    // Ignore: wrap
    // Ignore: writeFile
  ];
}
