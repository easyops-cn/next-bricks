export const eoMiniActionsSchema = {
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
      name: "actions",
      title: "按钮配置",
      type: "string",
      component: {
        name: "CustomOptions",
        props: {
          displayLabel: "text",
          schema: [
            {
              name: "text",
              type: "string",
              title: "文本",
              component: "Input",
            },
            {
              name: "event",
              type: "string",
              title: "事件",
              component: "Input",
            },
            {
              name: "icon",
              type: "string",
              title: "图标",
              component: "IconSelect",
            },
            {
              name: "tooltip",
              type: "string",
              title: "提示",
              component: "Input",
            },
            {
              name: "isDropdown",
              type: "boolean",
              title: "是否为下拉项",
            },
            {
              name: "hidden",
              type: "boolean",
              title: "隐藏",
            },
            {
              name: "divider",
              type: "boolean",
              title: "分割线",
            },
          ],
        },
      },
    },
  ],
};
