export const eoCategorySchema = {
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
      name: "categories",
      title: "分类信息",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "contentStyle",
      title: "内容样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "headerStyle",
      title: "头部样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "containerStyle",
      title: "容器样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "split",
      title: "显示分割线",
      type: "boolean",
    },
    {
      name: "headerMask",
      title: "显示头部线条",
      type: "boolean",
    },
    {
      name: "showIndex",
      title: "显示序号",
      type: "boolean",
    },
  ],
};
