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

const paletteGrayColorsMap: Record<string, string> = {
  "var(--palette-gray-1)": "#ffffff",
  "var(--palette-gray-2)": "#fafafa",
  "var(--palette-gray-3)": "#f5f5f5",
  "var(--palette-gray-4)": "#e8e8e8",
  "var(--palette-gray-5)": "#d9d9d9",
  "var(--palette-gray-6)": "#bfbfbf",
  "var(--palette-gray-7)": "#8c8c8c",
  "var(--palette-gray-8)": "#595959",
  "var(--palette-gray-9)": "#262626",
  "var(--palette-gray-10)": "#000000",
};

const extraPalettePresets: Presets = [
  {
    label: "gray",
    colors: Object.values(paletteGrayColorsMap),
  },
];

export const palettePresets = extraPalettePresets.concat(
  genPresets({
    red: "#f24c25",
    orange: "#e38306",
    yellow: "#fadb14",
    green: "#08BF33",
    cyan: "#21d4f3",
    blue: "#1a7aff",
    purple: "#893ad8",
    amber: "#f7bf02",
    pink: "#ff1a79",
    indigo: "#3844e8",
    "deep-purple": "#6641f9",
    "gray-blue": "#778dc3",
    teal: "#1dc897",
  })
);

// 内置颜色: 文本与线条
const textAndLineColorMap: Record<string, string> = {
  "#595959": "var(--color-normal-text)", // var(--palette-gray-8);
  "#bfbfbf": "var(--color-disabled-text)", // var(--palette-gray-6);
  "#8c8c8c": "var(--color-secondary-text)", // var(--palette-gray-7);
  "#262626": "var(--color-strong-text)", // var(--palette-gray-9);
  "#d9d9d9": "var(--color-border-divider-line)", // var(--palette-gray-5);
  "#e8e8e8": "var(--color-text-divider-line)", // var(--palette-gray-4);
};

// 内置颜色: 常用主题色
const themeColorMap: Record<string, string> = {
  "#08bf33": "var(--theme-green-color)", // var(--palette-green-6);
  "#77e686": "var(--theme-green-border-color)", // var(--palette-green-3);
  "#e6ffe7": "var(--theme-green-background)", // var(--palette-green-1);
  "#f24c25": "var(--theme-red-color)", // var(--palette-red-6);
  "#ffbba1": "var(--theme-red-border-color)", // var(--palette-red-3);
  "#fff5f0": "var(--theme-red-background)", // var(--palette-red-1);
  "#1a7aff": "var(--theme-blue-color)", // var(--palette-blue-6);
  "#94cbff": "var(--theme-blue-border-color)", // var(--palette-blue-3);
  "#e6f4ff": "var(--theme-blue-background)", // var(--palette-blue-1);
  "#e38306": "var(--theme-orange-color)", // var(--palette-orange-6);
  "#ffd582": "var(--theme-orange-border-color)", // var(--palette-orange-3);
  "#fff8e6": "var(--theme-orange-background)", // var(--palette-orange-1);
  "#21d4f3": "var(--theme-cyan-color)", // var(--palette-cyan-6);
  "#9efaff": "var(--theme-cyan-border-color)", // var(--palette-cyan-3);
  "#f0ffff": "var(--theme-cyan-background)", // var(--palette-cyan-1);
  "#893ad8": "var(--theme-purple-color)", // var(--palette-purple-6);
  "#e6bfff": "var(--theme-purple-border-color)", // var(--palette-purple-3);
  "#faf0ff": "var(--theme-purple-background)", // var(--palette-purple-1);
  "#3844e8": "var(--theme-geekblue-color)", // var(--palette-geekblue-6);
  "#b8c4ff": "var(--theme-geekblue-border-color)", // var(--palette-geekblue-3);
  "#f0f3ff": "var(--theme-geekblue-background)", // var(--palette-geekblue-1);
};
export const systemPresetColorsMap: Record<string, string> = {
  ...textAndLineColorMap,
  ...themeColorMap,
};

export const compressPalettePresets = (palettePresets: Presets): Presets => {
  return [
    {
      label: "调色板",
      colors: palettePresets.map((item) => item.colors).flat(),
      defaultOpen: false,
    },
  ];
};

export const allPresets: Presets = (
  [
    {
      label: "文本与线条",
      colors: Object.keys(textAndLineColorMap),
      defaultOpen: true,
    },
    {
      label: "常用主题色",
      colors: Object.keys(themeColorMap),
      defaultOpen: true,
    },
  ] as Presets
).concat(compressPalettePresets(palettePresets));

export const trasnformColorToCssVariables = (
  palettePresets: Presets,
  systemPresetColorsMap: Record<string, string>,
  color: string
) => {
  if (color in systemPresetColorsMap) {
    return systemPresetColorsMap[color];
  }

  let matchColor = color;
  palettePresets.forEach((preset) => {
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
  systemPresetColorsMap: Record<string, string>,
  colorVairable: string
) => {
  for (const color in systemPresetColorsMap) {
    if (systemPresetColorsMap[color] === colorVairable) {
      return color;
    }
  }

  const [, key, index] =
    colorVairable.match(/^var\(--palette-([\w-]+)-(\d+)\)$/) ?? [];

  let matchColor = colorVairable;
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
