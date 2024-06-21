export const eoSpinSchema = {
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
      name: "spinning",
      title: "加载中状态",
      type: "boolean",
    },
    {
      name: "tip",
      title: "描述文案",
      type: "string",
    },
    {
      name: "size",
      title: "指示符大小",
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
          value: "default",
        },
        {
          label: "小",
          value: "small",
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
  ],
};
