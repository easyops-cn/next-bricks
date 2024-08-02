export const EoTimePickerSchema = {
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
    },
    {
      name: "disabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "notRender",
      title: "隐藏表单项",
      type: "boolean",
      component: {
        name: "Switch",
      },
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
          tooltip:
            "区别于通用的“隐藏”属性，隐藏表单项时，表单不仅不显示当前项，同时也不会校验当前项；通用隐藏仅仅是不显示，但仍会校验当前项。通常，您应选择此属性来隐藏表单项。",
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
    },
    {
      name: "placeholder",
      title: "占位说明",
      type: "string",
    },
    {
      name: "configProps",
      title: "Antd timePicker 属性",
      type: "string",
      component: {
        name: "CodeEditor",
      },
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
