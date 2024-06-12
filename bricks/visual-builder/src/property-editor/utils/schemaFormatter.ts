import { ISchema } from "@formily/react";
import _ from "lodash";

export const ADVANCED_FORM_KEY = "#advanced_form";

export function schemaFormatter(data: ISchema, advancedMode: boolean): ISchema {
  if (advancedMode) {
    return {
      type: "object",
      properties: {
        layout: {
          type: "void",
          "x-component": "FormLayout",
          "x-component-props": {
            layout: "vertical",
          },
          properties: {
            [ADVANCED_FORM_KEY]: {
              title: "属性",
              type: "string",
              "x-decorator": "FormItemWithoutAdvanced",
              "x-component": "CodeEditor",
            },
          },
        },
      },
    };
  }

  const newData = _.clone(data);

  const walk = (data: any) => {
    if (data.properties) {
      walk(data.properties);
    }

    for (const k in data) {
      const { type } = data[k];

      switch (type) {
        case "boolean":
          data[k] = {
            "x-decorator": "FormItem",
            "x-decorator-props": {
              layout: "horizontal",
            },
            "x-component": "Switch",
            "x-component-props": {
              size: "small",
            },
            ...data[k],
          };
          break;
        case "string":
          data[k] = {
            "x-decorator": "FormItem",
            "x-component": "Input",
            ...data[k],
          };
      }

      if (data[k].properties) {
        walk(data[k].properties);
      }
    }
  };

  walk(newData);

  return newData;
}
