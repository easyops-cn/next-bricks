export const eoSelectSchema = {
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
      name: "categoryTitle_item",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "表单项",
        },
      },
    },
    {
      name: "name",
      title: "字段名",
      type: "string",
    },
    {
      name: "label",
      title: "标签",
      type: "string",
    },
    {
      name: "value",
      title: "值",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "disabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "categoryTitle_input",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "选择框",
        },
      },
    },
    {
      name: "options",
      title: "选项列表",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "type",
      title: "类型",
      type: "string",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择选择框类型",
          allowClear: true,
          options: ["tag", "multiple"].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "placeholder",
      title: "占位文本",
      type: "string",
    },
    {
      name: "maxTagCount",
      title: "最多显示tag数量",
      component: {
        name: "NumberPicker",
      },
      decorator: "FormItem",
      type: "number",
    },
    {
      name: "clearable",
      title: "显示清除按钮",
      type: "boolean",
    },
    {
      name: "groupBy",
      title: "分组字段",
      type: "string",
    },
    {
      name: "fields",
      title: "列表指定字段",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "inputStyle",
      title: "选择框样式",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "categoryTitle_validator",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "校验",
        },
      },
    },
    {
      name: "required",
      title: "是否必填",
      type: "boolean",
    },
  ],
};
