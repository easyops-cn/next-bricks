import {
  Presets,
  compressPalettePresets,
  transformCssVariablesToColor,
  trasnformColorToCssVariables,
} from "./colorTransform";

const mockPresets = [
  {
    label: "blue",
    colors: ["#aaa", "#bbb"],
  },
  {
    label: "red",
    colors: ["#ccc", "#ddd"],
  },
] as Presets;

const mockSystemPresetColorsMap: Record<string, string> = {
  "#aaabbb": "var(aaabbb)",
  "#aaaccc": "var(aaaccc)",
};

describe("Color transform", () => {
  it.each<[string, string]>([
    ["var(aaabbb)", "#aaabbb"],
    ["var(aaaccc)", "#aaaccc"],
    ["var(--palette-blue-1)", "#aaa"],
    ["var(--palette-blue-2)", "#bbb"],
    ["var(--palette-red-1)", "#ccc"],
    ["var(--palette-red-3)", "var(--palette-red-3)"],
    ["var(--palette-random-1)", "var(--palette-random-1)"],
    ["--palette-random-1", "--palette-random-1"],
  ])("trasnformColorToCssVariables %s should get %s", (color, result) => {
    expect(
      transformCssVariablesToColor(
        mockPresets,
        mockSystemPresetColorsMap,
        color
      )
    ).toBe(result);
  });

  it.each<[string, string]>([
    ["#aaabbb", "var(aaabbb)"],
    ["#aaaccc", "var(aaaccc)"],
    ["#aaa", "var(--palette-blue-1)"],
    ["#bbb", "var(--palette-blue-2)"],
    ["#ccc", "var(--palette-red-1)"],
    ["var(--palette-red-3)", "var(--palette-red-3)"],
    ["var(--palette-random-1)", "var(--palette-random-1)"],
  ])("trasnformColorToCssVariables %s should get %s", (color, result) => {
    expect(
      trasnformColorToCssVariables(
        mockPresets,
        mockSystemPresetColorsMap,
        color
      )
    ).toBe(result);
  });
});

describe("compressPalettePresets", () => {
  it("should work", () => {
    expect(compressPalettePresets(mockPresets)).toEqual([
      {
        colors: ["#aaa", "#bbb", "#ccc", "#ddd"],
        label: "调色板",
        defaultOpen: false,
      },
    ]);
  });
});
