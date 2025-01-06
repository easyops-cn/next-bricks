import { getLabelMaskAndOffset } from "./getLabelMaskAndOffset";
import type {
  SimpleRect,
  SizeTuple,
  PositionTuple,
} from "../../diagram/interfaces";
import type { PositionAndAngle } from "../interfaces";

describe("getLabelMaskAndOffset", () => {
  it("should return null for both labelMask and labelOffset if labelPosition is null", () => {
    const result = getLabelMaskAndOffset(null, [100, 50]);
    expect(result).toEqual([null, null]);
  });

  it("should return null for both labelMask and labelOffset if labelSize is null", () => {
    const result = getLabelMaskAndOffset([100, 50, "top", 0, 10], null);
    expect(result).toEqual([null, null]);
  });

  it("should calculate correct labelMask and labelOffset for top direction", () => {
    const labelPosition: PositionAndAngle = [100, 50, "top", Math.PI / 4, 10];
    const labelSize: SizeTuple = [100, 50];
    const result = getLabelMaskAndOffset(labelPosition, labelSize);
    const expectedMask: SimpleRect = {
      left:
        100 -
        50 -
        3 +
        10 * Math.cos(Math.PI / 4) -
        (50 / 2 + 3) / Math.tan(Math.PI / 4),
      top: 50 - 25 - 3 + 10 * Math.sin(Math.PI / 4) - (50 / 2 + 3),
      width: 100 + 6,
      height: 50 + 6,
    };
    const expectedOffset: PositionTuple = [
      10 * Math.cos(Math.PI / 4) - (50 / 2 + 3) / Math.tan(Math.PI / 4),
      10 * Math.sin(Math.PI / 4) - (50 / 2 + 3),
    ];
    expect(result).toEqual([expectedMask, expectedOffset]);
  });

  it("should calculate correct labelMask and labelOffset for bottom direction", () => {
    const labelPosition: PositionAndAngle = [
      100,
      50,
      "bottom",
      Math.PI / 4,
      10,
    ];
    const labelSize: SizeTuple = [100, 50];
    const result = getLabelMaskAndOffset(labelPosition, labelSize);
    const expectedMask: SimpleRect = {
      left:
        100 -
        50 -
        3 +
        10 * Math.cos(Math.PI / 4) +
        (50 / 2 + 3) / Math.tan(Math.PI / 4),
      top: 50 - 25 - 3 + 10 * Math.sin(Math.PI / 4) + (50 / 2 + 3),
      width: 100 + 6,
      height: 50 + 6,
    };
    const expectedOffset: PositionTuple = [
      10 * Math.cos(Math.PI / 4) + (50 / 2 + 3) / Math.tan(Math.PI / 4),
      10 * Math.sin(Math.PI / 4) + (50 / 2 + 3),
    ];
    expect(result).toEqual([expectedMask, expectedOffset]);
  });

  it("should calculate correct labelMask and labelOffset for left direction", () => {
    const labelPosition: PositionAndAngle = [100, 50, "left", Math.PI / 4, 10];
    const labelSize: SizeTuple = [100, 50];
    const result = getLabelMaskAndOffset(labelPosition, labelSize);
    const expectedMask: SimpleRect = {
      left: 100 - 50 - 3 + 10 * Math.cos(Math.PI / 4) - (100 / 2 + 3),
      top:
        50 -
        25 -
        3 +
        10 * Math.sin(Math.PI / 4) -
        (100 / 2 + 3) * Math.tan(Math.PI / 4),
      width: 100 + 6,
      height: 50 + 6,
    };
    const expectedOffset: PositionTuple = [
      10 * Math.cos(Math.PI / 4) - (100 / 2 + 3),
      10 * Math.sin(Math.PI / 4) - (100 / 2 + 3) * Math.tan(Math.PI / 4),
    ];
    expect(result).toEqual([expectedMask, expectedOffset]);
  });

  it("should calculate correct labelMask and labelOffset for right direction", () => {
    const labelPosition: PositionAndAngle = [100, 50, "right", Math.PI / 4, 10];
    const labelSize: SizeTuple = [100, 50];
    const result = getLabelMaskAndOffset(labelPosition, labelSize);
    const expectedMask: SimpleRect = {
      left: 100 - 50 - 3 + 10 * Math.cos(Math.PI / 4) + (100 / 2 + 3),
      top:
        50 -
        25 -
        3 +
        10 * Math.sin(Math.PI / 4) +
        (100 / 2 + 3) * Math.tan(Math.PI / 4),
      width: 100 + 6,
      height: 50 + 6,
    };
    const expectedOffset: PositionTuple = [
      10 * Math.cos(Math.PI / 4) + (100 / 2 + 3),
      10 * Math.sin(Math.PI / 4) + (100 / 2 + 3) * Math.tan(Math.PI / 4),
    ];
    expect(result).toEqual([expectedMask, expectedOffset]);
  });
});
