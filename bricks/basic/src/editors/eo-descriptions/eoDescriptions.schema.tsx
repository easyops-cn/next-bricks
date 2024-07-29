export const eoButtonSchema = {
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
      name: "descriptionTitle",
      title: "标题",
      type: "string",
    },
    {
      name: "list",
      title: "列表",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "dataSource",
      title: "选择数据",
      type: "string",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择数据",
          allowClear: true,
        },
      },
      decorator: {
        props: {
          tooltip: "可以通过<% DATA.XXX %>的形式被读取",
        },
      },
    },
    {
      name: "categoryTitle_style",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "外观",
        },
      },
    },
    {
      name: "showCard",
      title: "展示卡片背景",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
    },
    {
      name: "bordered",
      title: "展示边框",
      type: "boolean",
    },
    {
      name: "column",
      title: "列数",
      type: "number",
      component: "NumberPicker",
      decorator: "FormItem",
    },
    {
      name: "layout",
      title: "布局模式",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
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
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "horizontal",
        },
      },
    },
    {
      name: "hideGroups",
      title: "隐藏的描述列表项",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
