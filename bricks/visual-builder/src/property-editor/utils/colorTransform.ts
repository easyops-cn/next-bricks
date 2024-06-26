import { generate } from "@ant-design/colors";

export type ColorItem = {
  metaColor: {
    format?: string;
    originalInput: string;
  };
};

const genPresets = (presets: Record<string, string>): any =>
  Object.entries(presets).map(([label, colors]) => ({
    label,
    colors: generate(colors),
  }));

export const presets = genPresets({
  blue: "#1a7aff",
  red: "#f24c25",
  green: "#08BF33",
  cyan: "#21d4f3",
  amber: "#f7bf02",
  orange: "#e38306",
  yellow: "#fadb14",
  teal: "#1dc897",
  purple: "#893ad8",
  pink: "#ff1a79",
  indigo: "#3844e8",
  "deep-purple": "#6641f9",
  "gray-blue": "#778dc3",
});

export const trasnformColorToCssVariables = (
  presets: { label: string; colors: ColorItem[] }[],
  color: string
) => {
  let matchColor = color;
  presets.forEach((preset) => {
    const key = preset.label;

    const index = preset.colors.findIndex(
      (item) => item?.metaColor?.originalInput === matchColor
    );

    if (index >= 0) {
      matchColor = `var(--palette-${key}-${index + 1})`;
    }
  });

  return matchColor;
};

export const transformCssVariablesToColor = (
  presets: { label: string; colors: ColorItem[] }[],
  color: string
) => {
  const [, key, index] = color.match(/--palette-(\w+)-(\d)/) ?? [];

  let matchColor = color;
  if (key && index) {
    presets.forEach((preset) => {
      if (preset.label === key && preset.colors[Number(index) - 1]) {
        matchColor = preset.colors[Number(index) - 1].metaColor.originalInput;
      }
    });
  }

  return matchColor;
};
