export const eoButtonSchema = {
  name: "layout",
  type: "void",
  component: {
    name: "FormLayout",
    props: {
      layout: "vertical",
    },
  },
  children: [
    {
      name: "categoryTitle_basic",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "基础",
        },
      },
    },
    {
      name: "textContent",
      title: "文本",
      type: "string",
    },
    {
      name: "disabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "link",
      title: "链接",
      type: "string",
      component: {
        name: "InputWithUrl",
        props: {
          transform: {
            url: "url",
            href: "href",
          },
        },
      },
    },
    {
      name: "target",
      title: "跳转方式",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
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
    },
    {
      name: "tooltip",
      title: "按钮提示",
      type: "string",
    },
    {
      name: "categoryTitle_style",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "外观",
        },
      },
    },
    {
      type: "string",
      title: "按钮类型",
      name: "type",
      component: {
        name: "Select",
        props: {
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
    },
    {
      name: "size",
      title: "大小",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "大",
          value: "large",
        },
        {
          label: "标准",
          value: "medium",
        },
        {
          label: "小",
          value: "small",
        },
        {
          label: "超小",
          value: "xs",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "medium",
        },
      },
    },
    {
      name: "danger",
      title: "危险模式",
      type: "boolean",
    },
    {
      name: "icon",
      title: "图标",
      type: "string",
      component: "IconSelect",
    },
    {
      name: "shape",
      title: "形状",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          options: [
            { label: "圆形", value: "circle" },
            { label: "圆弧形", value: "round" },
            { label: "默认", value: "default" },
          ],
          optionType: "button",
          defaultValue: "default",
        },
      },
    },
  ],
};
