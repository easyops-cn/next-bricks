import { generate } from "@ant-design/colors";
import type { ColorPickerProps } from "antd";

export type Presets = Required<ColorPickerProps>["presets"];

export type ColorItem = {
  metaColor: {
    format?: string;
    originalInput: string;
  };
};

const genPresets = (presets: Record<string, string>): Presets =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors: generate(colors),
  }));

export const presets = genPresets({
  amber: "#f7bf02",
  yellow: "#fadb14",
  orange: "#e38306",
  pink: "#ff1a79",
  red: "#f24c25",
  blue: "#1a7aff",
  indigo: "#3844e8",
  "deep-purple": "#6641f9",
  "gray-blue": "#778dc3",
  purple: "#893ad8",
  cyan: "#21d4f3",
  teal: "#1dc897",
  green: "#08BF33",
});

export const compressPresets = (presets: Presets): Presets => {
  return [
    {
      label: "系统默认",
      colors: presets.map((item) => item.colors).flat(),
    },
  ];
};

export const trasnformColorToCssVariables = (
  presets: Presets,
  color: string
) => {
  let matchColor = color;
  presets.forEach((preset) => {
    const key = preset.label;

    const index = preset.colors.findIndex((item) =>
      typeof item === "string"
        ? item === matchColor
        : item.toHsbString() === matchColor
    );

    if (index >= 0) {
      matchColor = `var(--palette-${key}-${index + 1})`;
    }
  });

  return matchColor;
};

export const transformCssVariablesToColor = (
  presets: Presets,
  color: string
) => {
  const [, key, index] = color.match(/^var\(--palette-(\w+)-(\d+)\)$/) ?? [];

  let matchColor = color;
  if (key && index) {
    presets.forEach((preset) => {
      const color = preset.colors[Number(index) - 1];
      if (preset.label === key && color) {
        matchColor = typeof color === "string" ? color : color.toHsbString();
      }
    });
  }

  return matchColor;
};
