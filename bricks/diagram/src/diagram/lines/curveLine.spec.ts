import { describe, test, expect } from "@jest/globals";
import { curveLine } from "./curveLine";

describe("curveLine", () => {
  const point1 = [
    {
      x: 818.1675392670157,
      y: 221,
    },
    {
      x: 905,
      y: 167.5,
    },
    {
      x: 1008.1274900398406,
      y: 84,
    },
  ];
  const point2 = [
    {
      x: 491.8725099601594,
      y: 115.5,
    },
    {
      x: 595,
      y: 32,
    },
    {
      x: 750,
      y: 32,
    },
    {
      x: 905,
      y: 32,
    },
    {
      x: 930,
      y: 33.61290322580645,
    },
  ];
  test.each([[point1], [point2]])("curveLine(%j) should work", (point) => {
    expect(curveLine(point, "curveLinear", 0, -5)).toMatchSnapshot();
  });

  test("no points", () => {
    expect(curveLine(null as any, undefined, 0, -5)).toEqual("");
  });

  test("curveBasis", () => {
    expect(curveLine(point1, "curveBasis", 0, -5)).toMatchInlineSnapshot(
      `"M818.168,221L832.64,212.083C847.112,203.167,876.056,185.333,908.363,161.976C940.671,138.618,976.342,109.736,994.178,95.295L1012.013,80.854"`
    );
  });

  test("curveBumpX", () => {
    expect(curveLine(point1, "curveBumpX", 0, -5)).toMatchInlineSnapshot(
      `"M818.168,221C861.584,221,861.584,167.5,905,167.5C958.507,167.5,958.507,80.854,1012.013,80.854"`
    );
  });

  test("curveBumpY", () => {
    expect(curveLine(point1, "curveBumpY", 0, -5)).toMatchInlineSnapshot(
      `"M818.168,221C818.168,194.25,905,194.25,905,167.5C905,124.177,1012.013,124.177,1012.013,80.854"`
    );
  });

  test("curveMonotoneX", () => {
    expect(curveLine(point1, "curveMonotoneX", 0, -5)).toMatchInlineSnapshot(
      `"M818.168,221C847.112,204.421,876.056,187.843,905,167.5C940.671,142.429,976.342,111.641,1012.013,80.854"`
    );
  });

  test("curveMonotoneY", () => {
    expect(curveLine(point1, "curveMonotoneY", 0, -5)).toMatchInlineSnapshot(
      `"M818.168,221C848.432,203.167,878.697,185.333,905,167.5C947.599,138.618,979.806,109.736,1012.013,80.854"`
    );
  });

  test("curveNatural", () => {
    expect(curveLine(point1, "curveNatural", 0, -5)).toMatchInlineSnapshot(
      `"M818.168,221C845.43,205.929,872.692,190.858,905,167.5C937.308,144.142,974.661,112.498,1012.013,80.854"`
    );
  });
});
