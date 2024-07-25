import { formilySchemaFormatter } from "./formilySchemaFormatter";

describe("formilySchemaFormatter", () => {
  it("shoul workd", () => {
    const result = formilySchemaFormatter({
      type: "void",
      name: "layout",
      component: {
        name: "FormLayout",
        props: {
          layout: "vertical",
        },
      },
      children: [
        {
          type: "void",
          name: "collapse",
          decorator: "FormItem",
          component: {
            name: "FormCollapse",
            props: {
              formCollapse: "{{formCollapse}}",
            },
          },
          children: [
            {
              name: "panel1",
              type: "void",
              component: "FormCollapse.CollapsePanel",
              children: [
                {
                  type: "string",
                  title: "文本1",
                  name: "textContent",
                  required: true,
                },
              ],
            },
            {
              name: "panel2",
              type: "void",
              component: "FormCollapse.CollapsePanel",
              children: [
                {
                  type: "string",
                  title: "文本2",
                  name: "textContent",
                },
              ],
            },
          ],
        },
      ],
    });

    expect(result).toMatchInlineSnapshot(`
{
  "properties": {
    "#advanced_form": {
      "name": "#advanced_form",
      "type": "string",
      "x-component": "CodeEditor",
      "x-component-props": {
        "extraLibs": "{{extraLibs}}",
        "glyphMargin": false,
        "links": "{{links}}",
        "minLines": 5,
        "tokenClick": "{{tokenClick}}",
      },
      "x-decorator": "FormItemWithoutAdvanced",
    },
    "#normal_form": {
      "properties": {
        "property": {
          "properties": {
            "layout": {
              "name": "layout",
              "properties": {
                "collapse": {
                  "name": "collapse",
                  "properties": {
                    "panel1": {
                      "name": "panel1",
                      "properties": {
                        "textContent": {
                          "name": "textContent",
                          "required": true,
                          "title": "文本1",
                          "type": "string",
                          "x-component": "Input",
                          "x-component-props": {},
                          "x-decorator": "FormItem",
                          "x-decorator-props": {},
                        },
                      },
                      "type": "void",
                      "x-component": "FormCollapse.CollapsePanel",
                      "x-component-props": {},
                      "x-decorator": undefined,
                      "x-decorator-props": {},
                    },
                    "panel2": {
                      "name": "panel2",
                      "properties": {
                        "textContent": {
                          "name": "textContent",
                          "title": "文本2",
                          "type": "string",
                          "x-component": "Input",
                          "x-component-props": {},
                          "x-decorator": "FormItem",
                          "x-decorator-props": {},
                        },
                      },
                      "type": "void",
                      "x-component": "FormCollapse.CollapsePanel",
                      "x-component-props": {},
                      "x-decorator": undefined,
                      "x-decorator-props": {},
                    },
                  },
                  "type": "void",
                  "x-component": "FormCollapse",
                  "x-component-props": {
                    "formCollapse": "{{formCollapse}}",
                  },
                  "x-decorator": "FormItem",
                  "x-decorator-props": {},
                },
                "hidden": {
                  "name": "hidden",
                  "title": "隐藏",
                  "type": "boolean",
                  "x-component": "Switch",
                  "x-component-props": {
                    "size": "small",
                  },
                  "x-decorator": "FormItem",
                  "x-decorator-props": {
                    "layout": "horizontal",
                  },
                },
                "id": {
                  "name": "id",
                  "title": "id",
                  "type": "string",
                  "x-component": "Input",
                  "x-component-props": {},
                  "x-decorator": "FormItem",
                  "x-decorator-props": {
                    "layout": "horizontal",
                  },
                },
              },
              "type": "void",
              "x-component": "FormLayout",
              "x-component-props": {
                "layout": "vertical",
              },
              "x-decorator": undefined,
              "x-decorator-props": {},
            },
          },
          "type": "void",
          "x-component": "CustomTab.TabPanel",
          "x-component-props": {
            "tab": "property",
            "title": "属性",
          },
        },
        "style": {
          "name": "style",
          "properties": {
            "style": {
              "name": "style",
              "properties": {
                "background": {
                  "name": "background",
                  "title": "背景",
                  "type": "string",
                  "x-component": "ColorPicker",
                  "x-component-props": {},
                  "x-decorator": "FormItemWithoutAdvanced",
                  "x-decorator-props": {
                    "layout": "vertail",
                  },
                },
                "height": {
                  "name": "height",
                  "title": "高度",
                  "type": "string",
                  "x-component": "Input",
                  "x-component-props": {},
                  "x-decorator": "FormItemWithoutAdvanced",
                  "x-decorator-props": {
                    "layout": "vertail",
                  },
                },
                "margin": {
                  "name": "margin",
                  "title": "外边距(px)",
                  "type": "string",
                  "x-component": "BoxSize",
                  "x-component-props": {},
                  "x-decorator": "FormItemWithoutAdvanced",
                  "x-decorator-props": {},
                },
                "padding": {
                  "name": "padding",
                  "title": "内边距(px)",
                  "type": "string",
                  "x-component": "BoxSize",
                  "x-component-props": {
                    "mode": "in",
                  },
                  "x-decorator": "FormItemWithoutAdvanced",
                  "x-decorator-props": {},
                },
                "textAlign": {
                  "name": "textAlign",
                  "title": "对齐",
                  "type": "string",
                  "x-component": "TextAlignRadio",
                  "x-component-props": {},
                  "x-decorator": "FormItemWithoutAdvanced",
                  "x-decorator-props": {
                    "layout": "vertail",
                  },
                },
                "width": {
                  "name": "width",
                  "title": "宽度",
                  "type": "string",
                  "x-component": "Input",
                  "x-component-props": {},
                  "x-decorator": "FormItemWithoutAdvanced",
                  "x-decorator-props": {
                    "layout": "vertail",
                  },
                },
              },
              "type": "void",
              "x-component": undefined,
              "x-component-props": {},
              "x-decorator": undefined,
              "x-decorator-props": {},
            },
          },
          "type": "object",
          "x-component": "CustomTab.TabPanel",
          "x-component-props": {
            "tab": "style",
            "title": "样式",
          },
        },
      },
      "type": "void",
      "x-component": "CustomTab",
      "x-component-props": {
        "activeTab": "property",
      },
    },
  },
  "type": "object",
}
`);
  });
});
