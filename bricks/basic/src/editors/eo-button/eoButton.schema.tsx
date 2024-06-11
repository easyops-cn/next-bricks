export const eoButtonSchema = {
  type: "object",
  properties: {
    layout: {
      type: "void",
      "x-component": "FormLayout",
      "x-component-props": {
        layout: "vertical",
      },
      properties: {
        categoryTitle_basic: {
          type: "string",
          "x-decorator": "CategoryTitle",
          "x-decorator-props": {
            text: "基础",
          },
        },
        textContent: {
          title: "文本",
          type: "string",
          required: true,
          "x-decorator": "FormItem",
          "x-component": "Input",
        },
        disabled: {
          title: "禁用",
          type: "boolean",
          "x-decorator": "FormItem",
          "x-decorator-props": {
            layout: "horizontal",
          },
          "x-component": "Switch",
          "x-component-props": {
            size: "small",
          },
        },
        url: {
          title: "内链地址",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input",
        },
        href: {
          title: "外链地址",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input",
        },
        target: {
          title: "链接类型",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            options: [
              {
                label: "当前页面加载",
                value: "_self",
              },
              {
                label: "新标签打开",
                value: "_blank",
              },
            ],
          },
        },
        tooltip: {
          title: "按钮提示",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Input",
        },
        categoryTitle_style: {
          type: "string",
          "x-decorator": "CategoryTitle",
          "x-decorator-props": {
            text: "样式",
          },
        },
        type: {
          title: "按钮类型",
          type: "string",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            placeholder: "请选择按钮类型",
            allowClear: true,
            options: [
              "primary",
              "default",
              "dashed",
              "ghost",
              "link",
              "text",
              "icon",
            ].map((item) => ({
              label: item,
              value: item,
            })),
          },
        },
        size: {
          title: "大小",
          type: "string",
          "x-decorator": "FormItem",
          "x-decorator-props": {
            layout: "horizontal",
          },
          "x-component": "Radio.Group",
          enum: ["large", "medium", "small", "xs"].map((item) => ({
            label: item,
            value: item,
          })),
          "x-component-props": {
            size: "small",
            optionType: "button",
          },
        },
        danger: {
          title: "危险模式",
          type: "boolean",
          "x-decorator": "FormItem",
          "x-decorator-props": {
            layout: "horizontal",
          },
          "x-component": "Switch",
          "x-component-props": {
            size: "small",
          },
        },
        icon: {
          type: "string",
          title: "图标",
          "x-decorator": "FormItem",
          "x-component": "IconSelect",
        },
        shape: {
          type: "string",
          title: "形状",
          "x-decorator": "FormItem",
          "x-component": "Select",
          "x-component-props": {
            placeholder: "请选择按钮大小",
            allowClear: true,
            options: ["circle", "shape", "default"].map((item) => ({
              label: item,
              value: item,
            })),
          },
        },
      },
    },
  },
};
