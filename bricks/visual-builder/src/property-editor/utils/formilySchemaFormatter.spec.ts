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
        "links": "{{links}}",
        "minLines": 5,
        "tokenClick": "{{tokenClick}}",
      },
      "x-decorator": "FormItemWithoutAdvanced",
    },
    "#normal_form": {
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
    },
  },
  "type": "object",
}
`);
  });
});
