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
                  "x-component-props": undefined,
                  "x-decorator": "FormItem",
                  "x-decorator-props": undefined,
                },
              },
              "type": "void",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": undefined,
              "x-decorator": undefined,
              "x-decorator-props": undefined,
            },
            "panel2": {
              "name": "panel2",
              "properties": {
                "textContent": {
                  "name": "textContent",
                  "title": "文本2",
                  "type": "string",
                  "x-component": "Input",
                  "x-component-props": undefined,
                  "x-decorator": "FormItem",
                  "x-decorator-props": undefined,
                },
              },
              "type": "void",
              "x-component": "FormCollapse.CollapsePanel",
              "x-component-props": undefined,
              "x-decorator": undefined,
              "x-decorator-props": undefined,
            },
          },
          "type": "void",
          "x-component": "FormCollapse",
          "x-component-props": {
            "formCollapse": "{{formCollapse}}",
          },
          "x-decorator": "FormItem",
          "x-decorator-props": undefined,
        },
      },
      "type": "void",
      "x-component": "FormLayout",
      "x-component-props": {
        "layout": "vertical",
      },
      "x-decorator": undefined,
      "x-decorator-props": undefined,
    },
  },
  "type": "object",
}
`);
  });
});
