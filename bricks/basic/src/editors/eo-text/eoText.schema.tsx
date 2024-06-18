export const eoTextSchema = {
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
      name: "textContent",
      title: "文本",
      type: "string",
      required: true,
    },
    {
      name: "type",
      title: "文本类型",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          placeholder: "default",
          allowClear: true,
          options: [
            "default",
            "secondary",
            "success",
            "warning",
            "danger",
            "disabled",
            "code",
            "keyboard",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "fontSize",
      title: "字体大小",
      type: "string",
      component: {
        props: {
          placeholder: "14px",
        },
      },
    },
    {
      name: "fontWeight",
      title: "字体粗细",
      type: "string",
      component: {
        props: {
          placeholder: "normal",
        },
      },
    },
    {
      name: "color",
      title: "字体颜色",
      type: "string",
      component: {
        props: {
          placeholder: "black",
        },
      },
    },
    {
      name: "lineHeight",
      title: "字体行高",
      type: "string",
      component: {
        props: {
          placeholder: "14px",
        },
      },
    },
    {
      name: "textAlign",
      title: "字体对齐方式",
      type: "string",
      component: {
        props: {
          placeholder: "left",
        },
      },
    },
    {
      name: "display",
      title: "显示类型",
      type: "string",
      component: {
        props: {
          placeholder: "inline",
        },
      },
    },
  ],
};
