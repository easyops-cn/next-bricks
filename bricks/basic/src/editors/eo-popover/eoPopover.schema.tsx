export const eoPopoverSchema = {
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
      name: "disabled",
      title: "禁用",
      type: "boolean",
    },
    {
      name: "active",
      title: "显示弹出层",
      type: "boolean",
    },
    {
      name: "placement",
      title: "弹出位置",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          allowClear: true,
          options: [
            "top",
            "top-start",
            "top-end",
            "bottom",
            "bottom-start",
            "bottom-end",
            "right",
            "right-start",
            "right-end",
            "left",
            "left-start",
            "left-end",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "trigger",
      title: "弹出方式",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "Click",
          value: "click",
        },
        {
          label: "Hover",
          value: "hover",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "click",
        },
      },
    },
    {
      name: "strategy",
      title: "弹出层定位方式",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "绝对定位",
          value: "absolute",
        },
        {
          label: "固定定位",
          value: "fixed",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "absolute",
        },
      },
    },
    {
      name: "categoryTitle_advanced",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "高级",
        },
      },
    },
    {
      name: "sync",
      title: "弹出层与锚点同步基准",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "宽高",
          value: "both",
        },
        {
          label: "仅宽度",
          value: "width",
        },
        {
          label: "仅高度",
          value: "height",
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
      name: "distance",
      title: "弹出层与锚点间距离",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
    {
      name: "anchorDisplay",
      title: "锚点显示类型",
      type: "string",
      component: {
        props: {
          placeholder: "inline-block",
        },
      },
    },
    {
      name: "arrow",
      title: "显示箭头",
      type: "boolean",
      component: {
        props: {
          defaultValue: true,
          size: "small",
        },
      },
      "x-reactions": [
        {
          target: "arrowColor",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "arrowColor",
      title: "箭头颜色",
      type: "string",
      component: "ColorPicker",
    },
    {
      name: "shiftPadding",
      title: "移位上限填充量",
      decorator: "FormItem",
      type: "number",
      component: "NumberPicker",
    },
  ],
};
