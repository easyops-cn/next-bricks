export const eoCardSchema = {
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
      name: "cardTitle",
      title: "卡片标题",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
    },
    {
      type: "string",
      title: "头部图标",
      name: "headerIcon",
      component: "IconSelect",
    },
    {
      name: "fillVertical",
      title: "撑满父容器",
      type: "boolean",
    },
    {
      name: "outline",
      title: "卡片轮廓",
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
          options: ["border", "shadow", "background", "none", "default"].map(
            (item) => ({ label: item, value: item })
          ),
        },
      },
    },
    {
      name: "hideSplit",
      title: "是否隐藏分割线",
      type: "boolean",
    },
  ],
};
