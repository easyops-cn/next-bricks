import { describe, test, expect } from "@jest/globals";
import { computeContainerRect } from "./computeContainerRect";
import { BaseNodeCell } from "../interfaces";
describe("computeContainerRect", () => {
  test("should return an empty object for an empty array", () => {
    const cells: BaseNodeCell[] = [];
    const result = computeContainerRect(cells);
    expect(result).toEqual({});
  });
  test("should calculate the correct container rect for mixed finite and non-finite values", () => {
    const cells = [
      { view: { x: -268, y: 15, width: 60, height: 60 } },
      { view: { x: -185, y: -73, width: 60, height: 60 } },
      { view: { x: 0, y: 42, width: 60, height: 60 } },
      { view: { x: -24, y: 0, width: 60, height: 60 } },
    ] as unknown as BaseNodeCell[];

    const result = computeContainerRect(cells);
    expect(result).toEqual({
      x: -288,
      y: -93,
      width: 368,
      height: 215,
    });
  });
});
