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
      name: "mode",
      title: "类型",
      type: "string",
      component: {
        name: "Select",
        props: {
          placeholder: "请选择选择框类型",
          allowClear: true,
          options: [
            { label: "标签", value: "tag" },
            { label: "多个", value: "multiple" },
          ],
        },
      },
      "x-reactions": [
        {
          target: "maxTagCount",
          fulfill: {
            state: {
              visible: "{{!!$self.value}}",
            },
          },
        },
        {
          target: "tokenSeparators",
          fulfill: {
            state: {
              visible: `{{$self.value == "tag"}}`,
            },
          },
        },
      ],
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
      name: "tokenSeparators",
      title: "自动分词的分隔符",
      type: "string",
    },
    {
      name: "placeholder",
      title: "占位文本",
      type: "string",
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
      name: "fieldLabel",
      title: "选项显示字段",
      type: "string",
      component: {
        name: "Input",
        props: {
          placeholder: "选项中显示文字的字段",
        },
      },
    },
    {
      name: "fieldValue",
      title: "选项值字段",
      type: "string",
      component: {
        name: "Input",
        props: {
          placeholder: "选项中选择后得到的字段",
        },
      },
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
