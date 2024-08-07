import type { ISchema } from "@formily/react";
import { omit } from "lodash";
import { stylesSchema } from "../schema/styles.schema";

export const NORMAL_FORM_KEY = "#normal_form";
export const ADVANCED_FORM_KEY = "#advanced_form";

type ComponentType =
  | string
  | {
      name: string;
      props?: Record<string, any>;
    };

export interface DataNode {
  type: "void" | "string" | "object" | "boolean" | "array";
  name: string;
  title?: string;
  props?: Record<string, any>;
  decorator?: ComponentType;
  component?: ComponentType;
  children?: DataNode[];
  [k: string]: any;
}

function transformComponent(
  data: ComponentType,
  key: "decorator" | "component"
): Record<string, any> {
  if (!data) return {};
  if (typeof data === "string") {
    return {
      [`x-${key}`]: data,
    };
  }
  return {
    [`x-${key}`]: data.name,
    [`x-${key}-props`]: {
      ...(data.name === "CodeEditor"
        ? {
            extraLibs: "{{extraLibs}}",
            links: "{{links}}",
            tokenClick: "{{tokenClick}}",
            lineNumbers: "off",
            glyphMargin: false,
          }
        : {}),
      ...(data.props ?? {}),
    },
  };
}

type formilySchemaFormatterOptions = {
  isDefault: boolean;
};

export function formilySchemaFormatter(
  data: DataNode,
  options?: formilySchemaFormatterOptions | boolean
): ISchema {
  const { isDefault = true } = typeof options === "object" ? options : {};

  const walk = (data: DataNode): Record<string, any> => {
    let children: Record<string, any>[] | undefined;
    let result: Record<string, any> = {};
    if (data.children) {
      children = data.children.map(walk);
    }
    const { name, type, component, decorator } = data;

    const defaultDecorator: Record<string, any> =
      type === "string"
        ? {
            name: "FormItem",
          }
        : type === "boolean"
          ? {
              name: "FormItem",
              props: {
                layout: "horizontal",
              },
            }
          : {};

    const defaultComponent: Record<string, any> =
      type === "string"
        ? {
            name: "Input",
          }
        : type === "boolean"
          ? {
              name: "Switch",
              props: {
                size: "small",
              },
            }
          : {};

    const childNode: Record<string, any> = {
      type: type ?? "void",
      ...omit(data, ["children", "component", "decorator"]),
      ...transformComponent(
        {
          ...defaultDecorator,
          ...(typeof decorator === "string" ? { name: decorator } : decorator),
        },
        "decorator"
      ),
      ...transformComponent(
        {
          ...defaultComponent,
          ...(typeof component === "string" ? { name: component } : component),
        },
        "component"
      ),
    };

    if (typeof name === "string") {
      result[name] = childNode;
    } else {
      result = childNode;
    }

    if (children) {
      childNode.properties = {};
      for (const item of children) {
        if (typeof item.name === "string") {
          childNode.properties[item.name] = item;
        } else {
          childNode.properties = {
            ...childNode.properties,
            ...item,
          };
        }
      }
    }
    return result;
  };

  const defaultFields = [
    {
      name: "id",
      title: "id",
      type: "string",
      decorator: {
        name: "FormItem",
        props: {
          layout: "horizontal",
        },
      },
    },
    {
      name: "hidden",
      title: "隐藏",
      type: "boolean",
    },
  ] as DataNode[];

  if (!isDefault) {
    return walk(data);
  }

  return {
    type: "object",
    properties: {
      [NORMAL_FORM_KEY]: {
        type: "void",
        "x-component": "CustomTab",
        "x-component-props": {
          activeTab: "property",
        },
        properties: {
          property: {
            type: "void",
            "x-component": "CustomTab.TabPanel",
            "x-component-props": {
              title: "属性",
              tab: "property",
            },
            properties: walk({
              ...data,
              children: [...defaultFields, ...data.children],
            }),
          },
          style: {
            type: "object",
            name: "style",
            "x-component": "CustomTab.TabPanel",
            "x-component-props": {
              title: "样式",
              tab: "style",
            },
            properties: walk(stylesSchema),
          },
        },
      },
      [ADVANCED_FORM_KEY]: {
        name: ADVANCED_FORM_KEY,
        type: "string",
        "x-decorator": "FormItemWithoutAdvanced",
        "x-component": "CodeEditor",
        "x-component-props": {
          extraLibs: "{{extraLibs}}",
          links: "{{links}}",
          tokenClick: "{{tokenClick}}",
          minLines: 5,
          glyphMargin: false,
        },
      },
    },
  };
}
