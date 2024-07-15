import type { BrickConf } from "@next-core/types";
import { pick } from "lodash";
import type { CSSProperties } from "react";
import { isEvaluable } from "@next-core/cook";
import type { VisualConfig, VisualStyle } from "./raw-data-interfaces";

const ATTR_NAME_REGEX = /^[a-zA-Z_]\w+$/;

export function convertToStoryboard(
  config: VisualConfig,
  attr: string
): BrickConf | null {
  if (!ATTR_NAME_REGEX.test(attr)) {
    throw new Error(`Invalid attribute name: "${attr}"`);
  }

  const baseValue = `<% DATA.${attr} %>`;

  switch (config.display) {
    case "text": {
      const brickItem = getPlainBrick(config, attr, baseValue);
      const maxItems = Number(config.maxItems) || 3;
      if (config.type === "struct-list" || config.type === "array") {
        if (config.countOnly) {
          return {
            brick: "span",
            properties: {
              textContent: `<% \`\${DATA.${attr}.length}\` %>`,
            },
          };
        }
        return {
          brick: "span",
          children: [
            {
              brick: ":forEach",
              errorBoundary: true,
              dataSource: `<% DATA.${attr}.slice(0, ${maxItems}) %>`,
              children: [
                {
                  brick: "span",
                  if: "<% INDEX > 0 %>",
                  properties: {
                    textContent: ", ",
                  },
                },
                brickItem,
              ],
            },
            {
              brick: "span",
              if: `<% DATA.${attr}.length > ${maxItems} %>`,
              properties: {
                textContent: `<% \`等共 \${DATA.${attr}.length} 项\` %>`,
              },
            },
          ],
        };
      }
      return brickItem;
    }
    case "tag": {
      const colorSuffix =
        config.style?.variant === "background" ? "-inverse" : "";
      return {
        brick: "eo-tag",
        errorBoundary: true,
        properties: {
          textContent: baseValue,
          size: getTagSize(config.style?.size),
          color: config.style?.background
            ? `${config.style.background}${colorSuffix}`
            : `<% \`\${(${JSON.stringify(config.style?.palette ?? {})})[DATA.${attr}] ?? "gray"}${colorSuffix}\` %>`,
          outline: config.style?.variant === "outline",
        },
      };
    }
    case "detail":
      return {
        brick: "eo-descriptions",
        errorBoundary: true,
        properties: {
          dataSource: baseValue,
          column: 1,
          list: config.fields?.map((field) => ({
            label: field.title,
            field: field.dataIndex,
          })),
        },
      };
    case "table":
      if (config.type !== "struct-list") {
        return null;
      }
      return {
        brick: "eo-next-table",
        errorBoundary: true,
        properties: {
          dataSource: `<% { list: DATA.${attr} } %>`,
          pagination: false,
          columns: config.columns?.slice(0, 5).map((column) => ({
            title: column.title,
            dataIndex: column.dataIndex,
          })),
        },
      };
    case "card-list": {
      if (config.type !== "struct-list") {
        return null;
      }
      const titleKey = config.keys?.title ?? "name";
      const descKey = config.keys?.description ?? "description";
      return {
        brick: "div",
        properties: {
          style: {
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--page-card-gap)",
          },
        },
        children: [
          {
            brick: ":forEach",
            errorBoundary: true,
            dataSource: baseValue,
            children: [
              {
                brick: "eo-card-item",
                properties: {
                  cardTitle: isEvaluable(titleKey)
                    ? titleKey
                    : `<% ITEM[${JSON.stringify(titleKey)}] %>`,
                  description: isEvaluable(descKey)
                    ? descKey
                    : `<% ITEM[${JSON.stringify(config.keys?.description ?? "description")}] %>`,
                },
              },
            ],
          },
        ],
      };
    }
    default:
      return null;
  }
}

function getPlainBrick(
  config: VisualConfig,
  attr: string,
  baseValue: string
): BrickConf {
  const value =
    (config.type === "struct" ||
      config.type === "struct-list" ||
      config.type === "array") &&
    config.mainField
      ? `<% ${config.type === "struct" ? `DATA[${JSON.stringify(attr)}]` : "ITEM"}[${JSON.stringify(config.mainField)}] %>`
      : baseValue;
  switch (config.formatter?.type) {
    case "number":
      return {
        brick: "eo-formatter-number",
        errorBoundary: true,
        properties: {
          value,
          type: config.formatter.format,
          ...pick(config.formatter, [
            "currency",
            // "unit",
            "originalUnit",
            "decimals",
            "thousandsSeparator",
          ]),
        },
      };
    case "date-time":
      return {
        brick: "eo-humanize-time",
        errorBoundary: true,
        properties: {
          value,
          type: config.type === "date" ? "date" : undefined,
          formatter: config.formatter.format,
        },
      };
    case "cost-time":
      return {
        brick: "eo-humanize-time",
        errorBoundary: true,
        properties: {
          value,
          isCostTime: true,
        },
      };
    default:
      return {
        brick: "span",
        errorBoundary: true,
        properties: {
          textContent: value,
          style: getPlainStyle(config.style),
        },
      };
  }
}

function getTagSize(size: VisualStyle["size"]): string | undefined {
  switch (size) {
    case "large":
    case "medium":
    case "small":
      return size;
    case "x-large":
      return "large";
    case "x-small":
      return "xs";
  }
}

function getPlainStyle(
  configStyle: VisualStyle | undefined
): CSSProperties | undefined {
  if (!configStyle) {
    return;
  }
  const style: CSSProperties = {};
  switch (configStyle.size) {
    case "x-small":
    case "small":
      style.fontSize = "var(--sub-title-font-size-small)";
      break;
    case "medium":
      style.fontSize = "var(--normal-font-size)";
      break;
    case "large":
      style.fontSize = "var(--card-title-font-size)";
      break;
    case "x-large":
      style.fontSize = "var(--title-font-size-larger)";
      break;
  }
  switch (configStyle.fontWeight) {
    case "bold":
    case "normal":
      style.fontWeight = configStyle.fontWeight;
  }
  if (configStyle.color) {
    style.color = configStyle.color;
  }
  return style;
}
