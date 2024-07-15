import { DataNode } from "../utils/formilySchemaFormatter";

export const stylesSchema: DataNode = {
  type: "void",
  name: "style",
  children: [
    {
      name: "width",
      title: "宽度",
      type: "string",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          layout: "vertail",
        },
      },
      component: {
        name: "InputWithUnit",
        props: {
          suffix: "px",
        },
      },
    },
    {
      name: "height",
      title: "高度",
      type: "string",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          layout: "vertail",
        },
      },
      component: {
        name: "InputWithUnit",
        props: {
          suffix: "px",
        },
      },
    },
    {
      type: "string",
      name: "textAlign",
      title: "对齐",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          layout: "vertail",
        },
      },
      component: "TextAlignRadio",
    },
    {
      type: "string",
      name: "background",
      title: "背景",
      decorator: {
        name: "FormItemWithoutAdvanced",
        props: {
          layout: "vertail",
        },
      },
      component: "ColorPicker",
    },
    {
      type: "string",
      name: "margin",
      title: "外边距(px)",
      decorator: {
        name: "FormItemWithoutAdvanced",
      },
      component: "BoxSize",
    },
    {
      type: "string",
      name: "padding",
      title: "内边距(px)",
      decorator: {
        name: "FormItemWithoutAdvanced",
      },
      component: {
        name: "BoxSize",
        props: {
          mode: "in",
        },
      },
    },
  ],
};
