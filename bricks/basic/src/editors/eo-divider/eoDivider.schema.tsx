export const eoDividerSchema = {
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
          tooltip: "Radiation是个特殊的类型，样式是特定的",
        },
      },
      enum: [
        {
          label: "Horizontal",
          value: "horizontal",
        },
        {
          label: "Vertical",
          value: "vertical",
        },
        {
          label: "Radiation",
          value: "radiation",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "horizontal",
        },
      },
      "x-reactions": [
        {
          target: "proportion",
          fulfill: {
            state: {
              visible: "{{$self.value==='radiation'}}",
            },
          },
        },
      ],
    },
    {
      name: "proportion",
      title: "数值",
      type: "string",
      component: "CodeEditor",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          tooltip: "如需要展示1/3，yaml格式填入数组[1,3]",
        },
      },
    },
    {
      name: "textContent",
      title: "标题",
      type: "string",
    },
    {
      name: "orientation",
      title: "标题位置",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "左",
          value: "left",
        },
        {
          label: "中",
          value: "center",
        },
        {
          label: "右",
          value: "right",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "center",
        },
      },
    },
    {
      name: "dashed",
      title: "虚线效果",
      type: "boolean",
    },
    {
      name: "dividerStyle",
      title: "分割线样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
