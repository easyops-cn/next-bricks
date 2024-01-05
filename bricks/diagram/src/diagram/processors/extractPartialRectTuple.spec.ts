import { describe, test, expect } from "@jest/globals";
import { extractPartialRectTuple } from "./extractPartialRectTuple";
import type { PartialRectTuple, FullRectTuple } from "../interfaces";

describe("extractPartialRectTuple", () => {
  test.each<[PartialRectTuple, FullRectTuple]>([
    [10, [10, 10, 10, 10]],
    [[10], [10, 10, 10, 10]],
    [
      [10, 20],
      [10, 20, 10, 20],
    ],
    [
      [10, 20, 30],
      [10, 20, 30, 20],
    ],
    [
      [10, 20, 30, 40],
      [10, 20, 30, 40],
    ],
  ])("extractPartialRectTuple(%j) should return %j", (value, result) => {
    expect(extractPartialRectTuple(value)).toEqual(result);
  });
});
