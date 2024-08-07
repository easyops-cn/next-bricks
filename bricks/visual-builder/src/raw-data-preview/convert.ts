import type { BrickConf } from "@next-core/types";
import { pick } from "lodash";
import type { CSSProperties } from "react";
import type { VisualConfig, VisualStyle } from "./raw-data-interfaces";

export function convertToStoryboard(
  config: VisualConfig,
  attr: string
): BrickConf | null {
  const attrAccessor = `[${JSON.stringify(attr)}]`;
  let brickItem: BrickConf;

  switch (config.display) {
    case "link":
    case "text": {
      brickItem = getPlainBrick(config, attrAccessor);
      if (config.type === "struct-list" && !config.countOnly) {
        brickItem = {
          brick: "eo-tag",
          errorBoundary: true,
          children: [brickItem],
        };
      } else if (config.display === "link") {
        brickItem = {
          brick: "eo-link",
          errorBoundary: true,
          children: [brickItem],
        };
      }
      break;
    }
    case "tag": {
      const colorSuffix =
        config.style?.variant === "background" ? "-inverse" : "";
      const valueAccessor = getValueAccessor(config, attrAccessor);
      brickItem = {
        brick: "eo-tag",
        errorBoundary: true,
        properties: {
          textContent: `<% ${valueAccessor} %>`,
          size: getTagSize(config.style?.size),
          color: config.style?.background
            ? `${config.style.background}${colorSuffix}`
            : config.style?.palette
              ? `<% \`\${(${JSON.stringify(config.style.palette)})[${valueAccessor}] ?? "gray"}${colorSuffix}\` %>`
              : `gray${colorSuffix}`,
          outline: config.style?.variant === "outline",
        },
      };
      break;
    }
    default:
      return null;
  }

  if (config.type !== "struct-list" || config.countOnly) {
    return brickItem;
  }

  const maxItems = Number(config.maxItems) || 3;
  return {
    brick: "span",
    errorBoundary: true,
    properties: {
      style: {
        display: "inline-flex",
        gap: "0.5em",
      },
    },
    children: [
      {
        brick: ":forEach",
        dataSource: `<% DATA${attrAccessor}.slice(0, ${maxItems}) %>`,
        children: [brickItem],
      },
      {
        brick: "eo-link",
        if: `<% DATA${attrAccessor}.length > ${maxItems} %>`,
        properties: {
          textContent: `<% \`+ \${DATA${attrAccessor}.length - ${maxItems}} 项\` %>`,
        },
      },
    ],
  };
}

function getPlainBrick(config: VisualConfig, attrAccessor: string): BrickConf {
  if (config.type === "struct-list" && config.countOnly) {
    return {
      brick: "span",
      properties: {
        textContent: `<% \`\${DATA${attrAccessor}.length}\` %>`,
      },
    };
  }

  const value = `<% ${getValueAccessor(config, attrAccessor)} %>`;
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

function getValueAccessor(config: VisualConfig, attrAccessor: string): string {
  if (
    (config.type === "struct" || config.type === "struct-list") &&
    config.field
  ) {
    return `${config.type === "struct" ? `DATA${attrAccessor}` : "ITEM"}[${JSON.stringify(config.field)}]`;
  }
  return `DATA${attrAccessor}`;
}

function getTagSize(size: VisualStyle["size"]): string | undefined {
  switch (size) {
    case "large":
    case "medium":
    case "small":
      return size;
    case "x-large":
      return "large";
    // case "x-small":
    //   return "xs";
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
    // case "x-small":
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
