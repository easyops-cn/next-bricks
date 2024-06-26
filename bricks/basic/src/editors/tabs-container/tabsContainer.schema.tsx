export const tabsContainerSchema = {
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
      name: "tabList",
      title: "标签页列表",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "supportTabIconExtraClick",
      title: "显示弹框",
      type: "boolean",
    },
    {
      name: "categoryTitle_style",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "样式",
        },
      },
    },
    {
      name: "type",
      title: "标签页类型",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          allowClear: true,
          placeholder: "normal",
          options: [
            "normal",
            "panel",
            "panel-small",
            "embedded",
            "text",
            "capsule",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
      "x-reactions": [
        {
          target: "size",
          fulfill: {
            state: {
              visible: "{{$self.value=='normal'}}",
            },
          },
        },
      ],
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
          label: "小",
          value: "small",
        },
        {
          label: "中",
          value: "default",
        },
        {
          label: "大",
          value: "large",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "default",
        },
      },
    },
    {
      name: "showCard",
      title: "显示外层卡片",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
    },
    {
      name: "onlyShowIcon",
      title: "只显示图标",
      type: "boolean",
    },
    {
      name: "showBottomBorder",
      title: "展示标签底部边框",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
    },
    {
      name: "supportAddTab",
      title: "支持添加标签页",
      type: "boolean",
    },
    {
      name: "panelStyle",
      title: "顶部面板样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "tabIconStyle",
      title: "标签图标样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
