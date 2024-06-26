import {
  Presets,
  compressPresets,
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

describe("Color transform", () => {
  it.each<[string, string]>([
    ["var(--palette-blue-1)", "#aaa"],
    ["var(--palette-blue-2)", "#bbb"],
    ["var(--palette-red-1)", "#ccc"],
    ["var(--palette-red-3)", "var(--palette-red-3)"],
    ["var(--palette-random-1)", "var(--palette-random-1)"],
    ["--palette-random-1", "--palette-random-1"],
  ])("trasnformColorToCssVariables %s should get %s", (color, result) => {
    expect(transformCssVariablesToColor(mockPresets, color)).toBe(result);
  });

  it.each<[string, string]>([
    ["#aaa", "var(--palette-blue-1)"],
    ["#bbb", "var(--palette-blue-2)"],
    ["#ccc", "var(--palette-red-1)"],
    ["var(--palette-red-3)", "var(--palette-red-3)"],
    ["var(--palette-random-1)", "var(--palette-random-1)"],
  ])("trasnformColorToCssVariables %s should get %s", (color, result) => {
    expect(trasnformColorToCssVariables(mockPresets, color)).toBe(result);
  });
});

describe("compressPresets", () => {
  it("should work", () => {
    expect(compressPresets(mockPresets)).toEqual([
      { colors: ["#aaa", "#bbb", "#ccc", "#ddd"], label: "系统默认" },
    ]);
  });
});
