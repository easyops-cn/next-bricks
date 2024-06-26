export const eoCheckboxSchema = {
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
      title: "是否禁用",
      type: "boolean",
    },
    {
      name: "categoryTitle_checkbox",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "复选框",
        },
      },
    },
    {
      name: "options",
      type: "string",
      title: "选项",
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
          placeholder: "请选择按钮类型",
          allowClear: true,
          options: ["default", "icon"].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "isGroup",
      title: "分组复选框",
      type: "boolean",
      component: {
        props: {
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "optionGroups",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "optionGroups",
      title: "多选框选项分组数据",
      type: "string",
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
      title: "必填",
      type: "boolean",
      component: {
        props: {
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "requiredValidatorText",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "requiredValidatorText",
      title: "必填提示文字",
      type: "string",
    },
  ],
};
