import { getSnapPositions } from "./getSnapPositions";
import type { NodeView } from "../interfaces";

describe("getSnapPositions", () => {
  const view: NodeView = { x: 10, y: 20, width: 100, height: 200 };

  it('should return correct snap positions for "center"', () => {
    const positions = getSnapPositions(view, "center");
    expect(positions).toEqual({ center: [60, 120] });
  });

  it('should return correct snap positions for "top"', () => {
    const positions = getSnapPositions(view, "top");
    expect(positions).toEqual({ top: [60, 20] });
  });

  it('should return correct snap positions for "right"', () => {
    const positions = getSnapPositions(view, "right");
    expect(positions).toEqual({ right: [110, 120] });
  });

  it('should return correct snap positions for "bottom"', () => {
    const positions = getSnapPositions(view, "bottom");
    expect(positions).toEqual({ bottom: [60, 220] });
  });

  it('should return correct snap positions for "left"', () => {
    const positions = getSnapPositions(view, "left");
    expect(positions).toEqual({ left: [10, 120] });
  });

  it('should return correct snap positions for "all"', () => {
    const positions = getSnapPositions(view, "all");
    expect(positions).toEqual({
      center: [60, 120],
      top: [60, 20],
      right: [110, 120],
      bottom: [60, 220],
      left: [10, 120],
    });
  });

  it("should return correct snap positions for multiple positions", () => {
    const positions = getSnapPositions(view, "top left");
    expect(positions).toEqual({
      top: [60, 20],
      left: [10, 120],
    });
  });

  it("should throw an error for unknown position", () => {
    expect(() => getSnapPositions(view, "unknown")).toThrow(
      'Unknown snap position: "unknown"'
    );
  });

  it("should return an empty object for undefined positions", () => {
    const positions = getSnapPositions(view, undefined);
    expect(positions).toEqual({});
  });
});
