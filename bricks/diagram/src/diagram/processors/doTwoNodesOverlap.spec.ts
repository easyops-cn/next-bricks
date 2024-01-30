import { describe, test, expect } from "@jest/globals";
import { doTwoNodesOverlap } from "./doTwoNodesOverlap";
import type { NodeRect } from "../interfaces";

describe("doTwoNodesOverlap", () => {
  test("should return true when two nodes overlap", () => {
    // Arrange
    const nodeA: NodeRect = { x: 0, y: 0, width: 10, height: 10 };
    const nodeB: NodeRect = { x: 5, y: 5, width: 10, height: 10 };
    const paddingA = 0;
    const paddingB = 0;

    // Act
    const result = doTwoNodesOverlap(nodeA, nodeB, paddingA, paddingB);

    // Assert
    expect(result).toBe(true);
  });

  test("should return false when two nodes do not overlap", () => {
    // Arrange
    const nodeA: NodeRect = { x: 0, y: 0, width: 10, height: 10 };
    const nodeB: NodeRect = { x: 20, y: 20, width: 10, height: 10 };
    const paddingA = 0;
    const paddingB = 0;

    // Act
    const result = doTwoNodesOverlap(nodeA, nodeB, paddingA, paddingB);

    // Assert
    expect(result).toBe(false);
  });

  test("should consider padding when checking for overlap", () => {
    // Arrange
    const nodeA: NodeRect = { x: 0, y: 0, width: 10, height: 10 };
    const nodeB: NodeRect = { x: 20, y: 20, width: 10, height: 10 };
    const paddingA = 5;
    const paddingB = 10;

    // Act
    const result = doTwoNodesOverlap(nodeA, nodeB, paddingA, paddingB);

    // Assert
    expect(result).toBe(true);
  });
});
