import { describe, test, expect } from "@jest/globals";
import { renameFile } from "./rename-file.js";
import { getTestDirHandle, getCaseFileHandle } from "./shared/fileAccess.js";

jest.mock("./shared/fileAccess.js");

describe("renameFile", () => {
  test("should work", async () => {
    const mockMoveFn = jest.fn();

    (getCaseFileHandle as jest.Mock).mockResolvedValueOnce({
      move: mockMoveFn,
    });
    await renameFile("test", "testV2", "visual-builder");
    expect(mockMoveFn).toHaveBeenCalledWith("testV2.spec.js");
  });

  test("should work with no permission", async () => {
    const mockRequestPermission = jest.fn();

    (getTestDirHandle as jest.Mock).mockResolvedValueOnce({
      requestPermission: mockRequestPermission,
    });
    (getCaseFileHandle as jest.Mock)
      .mockResolvedValue({
        move: jest.fn(),
      })
      .mockRejectedValueOnce({
        name: "NotAllowedError",
      });

    await renameFile("test", "testV2", "visual-builder");

    expect(mockRequestPermission).toHaveBeenCalled();
  });
});
