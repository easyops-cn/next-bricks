export const eoCardItemSchema = {
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
      name: "cardTitle",
      title: "标题",
      type: "string",
    },
    {
      name: "description",
      title: "描述",
      type: "string",
    },
    {
      name: "hasHeader",
      title: "开放顶部区域",
      type: "boolean",
      "x-reactions": [
        {
          target: "auxiliaryText",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "auxiliaryText",
      title: "顶部辅助文字",
      type: "string",
    },
    {
      name: "categoryTitle_cover",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "封面",
        },
      },
    },
    {
      name: "hasCover",
      title: "使用卡片封面",
      type: "boolean",
      "x-reactions": [
        {
          target: "coverImage",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "coverColor",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "coverImageSize",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
        {
          target: "avatarPosition",
          fulfill: {
            state: {
              visible: "{{$self.value}}",
            },
          },
        },
      ],
    },
    {
      name: "coverImage",
      title: "封面背景图",
      type: "string",
    },
    {
      name: "coverColor",
      title: "封面背景色",
      type: "string",
      component: "ColorPicker",
    },
    {
      name: "coverImageSize",
      title: "封面图片大小",
      type: "string",
    },
    {
      name: "categoryTitle_icon",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "图标",
        },
      },
    },
    {
      name: "avatar",
      title: "图标",
      type: "string",
      component: "IconSelect",
    },
    {
      name: "avatarPosition",
      title: "图标位置",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
      enum: [
        {
          label: "内容区",
          value: "content",
        },
        {
          label: "封面",
          value: "cover",
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
      name: "categoryTitle_link",
      type: "void",
      decorator: {
        name: "CategoryTitle",
        props: {
          text: "链接",
        },
      },
    },
    {
      name: "href",
      title: "href",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          tooltip:
            "设置href时构件内将使用原生<a>标签处理链接，通常用于外链的跳转",
        },
      },
    },
    {
      name: "url",
      title: "url",
      type: "string",
    },
    {
      name: "target",
      title: "跳转目标",
      type: "string",
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
      name: "actions",
      title: "操作按钮组",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
    {
      name: "tagConfig",
      title: "标签设置",
      type: "string",
      component: "CodeEditor",
      decorator: "FormItemWithoutAdvanced",
    },
  ],
};
