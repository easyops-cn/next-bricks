export const eoTagSchema = {
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
      name: "icon",
      title: "图标",
      type: "string",
      component: "IconSelect",
    },
    {
      name: "color",
      title: "颜色",
      type: "string",
      component: "ColorPicker",
    },
    {
      name: "disabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "closable",
      title: "允许关闭",
      type: "boolean",
    },
    {
      name: "checkable",
      title: "允许选择",
      type: "boolean",
      component: {
        name: "Switch",
        props: {
          size: "small",
          defaultValue: false,
        },
      },
      "x-reactions": [
        {
          target: "checked",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "checked",
      title: "选择状态",
      type: "boolean",
    },
    {
      name: "ellipsisWidth",
      title: "文本显示上限宽度",
      type: "string",
    },
    {
      name: "tagStyle",
      title: "自定义样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
