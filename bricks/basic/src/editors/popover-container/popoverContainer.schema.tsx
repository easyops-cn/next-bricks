export const popoverContainerSchema = {
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
      name: "displayBrick",
      title: "展示构件",
      type: "string",
      required: true,
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "popoverBrick",
      title: "弹框构件",
      type: "string",
      required: true,
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "popoverTitleBrick",
      title: "弹框标题构件",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "data",
      title: "整体数据",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "categoryTitle_style",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "弹框",
        },
      },
    },
    {
      name: "visible",
      title: "显示弹框",
      type: "boolean",
    },
    {
      name: "transferVisible",
      title: "透传visiable给弹框构件",
      type: "boolean",
    },
    {
      name: "triggerByIcon",
      title: "由图标触发",
      type: "boolean",
      component: {
        props: {
          size: "small",
          defaultValue: true,
        },
      },
      "x-reactions": [
        {
          target: "popoverIcon",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "showIcon",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "trigger",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "popoverIcon",
      title: "触发弹框图标",
      type: "string",
      component: "IconSelect",
    },
    {
      name: "showIcon",
      title: "图标显示时机",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "总是显示",
          value: "always",
        },
        {
          label: "悬浮显示",
          value: "hover",
        },
        {
          label: "不显示",
          value: "never",
        },
      ],
      component: {
        name: "Radio.Group",
        props: {
          size: "small",
          optionType: "button",
          defaultValue: "hover",
        },
      },
    },
    {
      name: "trigger",
      title: "触发弹框方式",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "点击",
          value: "click",
        },
        {
          label: "悬浮",
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
      name: "placement",
      title: "弹框位置",
      type: "string",
      descorator: "FormItem",
      component: {
        name: "Select",
        props: {
          allowClear: true,
          placeholder: "bottom",
          options: [
            "top",
            "topLeft",
            "topRight",
            "bottom",
            "bottomLeft",
            "bottomRight",
            "right",
            "rightTop",
            "rightBottom",
            "left",
            "leftTop",
            "leftBottom",
          ].map((item) => ({
            label: item,
            value: item,
          })),
        },
      },
    },
    {
      name: "showPopoverBg",
      title: "显示弹框背景",
      type: "boolean",
      component: {
        props: {
          defaultValue: true,
          size: "small",
        },
      },
    },
    {
      name: "zIndex",
      title: "弹框Z轴顺序",
      decorator: "FormItem",
      type: "number",
      component: {
        name: "NumberPicker",
        props: {
          placeholder: "1030",
        },
      },
    },
    {
      name: "getPopupContainer",
      title: "弹框挂载父节点",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "popoverContentStyle",
      title: "弹框内容样式",
      type: "string",
      component: {
        name: "CodeEditor",
        props: {
          placeholder: "{width: 200px}",
        },
      },
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "categoryTitle_topo",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "拓扑",
        },
      },
    },
    {
      name: "highlighted",
      title: "是否高亮",
      type: "boolean",
    },
    {
      name: "related",
      title: "是否被关联",
      type: "boolean",
    },
    {
      name: "faded",
      title: "是否弱化",
      type: "boolean",
    },
    {
      name: "transferGraphAttrs",
      title: "透传拓扑属性给子展示构件",
      type: "boolean",
    },
  ],
};
