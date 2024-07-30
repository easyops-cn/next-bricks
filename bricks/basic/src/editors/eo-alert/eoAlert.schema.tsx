export const eoAlertSchema = {
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
          optionType: "button",
          options: [
            {
              label: "Success",
              value: "success",
            },
            {
              label: "Info",
              value: "info",
            },
            {
              label: "Warning",
              value: "warning",
            },
            {
              label: "Error",
              value: "error",
            },
          ],
        },
      },
    },
    {
      name: "hasTitle",
      title: "启用title插槽",
      type: "boolean",
    },
    {
      name: "showIcon",
      title: "显示提示图标",
      type: "boolean",
    },
    {
      name: "closable",
      title: "显示关闭按钮",
      type: "boolean",
      "x-reactions": [
        {
          target: "localStorageKey",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "disableUrlNamespace",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "localStorageKey",
      title: "缓存关闭状态key值",
      decorator: {
        props: {
          tooltip: "以该值和页面url作为命名空间，决定是否显示该警告提示",
        },
      },
      type: "string",
    },
    {
      name: "disableUrlNamespace",
      title: "关闭url命名空间",
      type: "boolean",
      decorator: {
        props: {
          tooltip: "关闭后仅以key值作为命名空间",
          layout: "horizontal",
        },
      },
    },
  ],
};
