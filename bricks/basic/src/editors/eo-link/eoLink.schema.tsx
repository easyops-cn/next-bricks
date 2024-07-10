export const eoLinkSchema = {
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
      name: "disabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "type",
      title: "类型",
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
            { label: "链接", value: "link" },
            { label: "文本", value: "text" },
            { label: "简易", value: "plain" },
          ],
          optionType: "button",
          defaultValue: "link",
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
      type: "boolean",
      title: "跳转图标",
      name: "showExternalIcon",
    },
    {
      type: "boolean",
      title: "显示下划线",
      name: "underline",
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
  ],
};
