export const eoTabListSchema = {
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
      name: "tabs",
      title: "标签页列表",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "activePanel",
      title: "激活中的面板",
      type: "string",
    },
    {
      name: "type",
      title: "标签页类型",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "Default",
          value: "default",
        },
        {
          label: "Panel",
          value: "panel",
        },
        {
          label: "Capsule",
          value: "capsule",
        },
        {
          label: "Text",
          value: "text",
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
      "x-reactions": [
        {
          target: "outline",
          fulfill: {
            state: {
              visible: "{{$self.value!='panel'}}",
            },
          },
        },
      ],
    },
    {
      name: "outline",
      title: "轮廓",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "Shadow",
          value: "shadow",
        },
        {
          label: "None",
          value: "none",
        },
        {
          label: "Default",
          value: "default",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
        },
      },
    },
    {
      name: "contentStyle",
      title: "内容样式",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
