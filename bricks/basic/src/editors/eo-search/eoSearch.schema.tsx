export const eoSearchSchema = {
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
      name: "value",
      title: "值",
      type: "string",
    },
    {
      name: "placeholder",
      title: "占位文本",
      type: "string",
    },
    {
      name: "clearable",
      title: "支持清空",
      type: "boolean",
    },
    {
      name: "autoFocus",
      title: "自动聚焦",
      type: "boolean",
    },
    {
      name: "trim",
      title: "自动去除输入的首尾空格",
      type: "boolean",
    },
    {
      name: "debounceTime",
      title: "搜索延迟时间",
      type: "number",
      component: "NumberPicker",
      decorator: "FormItem",
    },
  ],
};
