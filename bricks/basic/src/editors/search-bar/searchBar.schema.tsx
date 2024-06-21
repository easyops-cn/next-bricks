export const searchBarSchema = {
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
      name: "marginBottom",
      title: "底部边距",
      type: "string",
      component: {
        props: {
          size: "small",
          placeholder: "var(--card-content-gap)",
        },
      },
    },
    {
      name: "wrap",
      title: "内容是否支持换行",
      type: "boolean",
    },
    {
      name: "align",
      title: "搜索栏内对齐方式",
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
  ],
};