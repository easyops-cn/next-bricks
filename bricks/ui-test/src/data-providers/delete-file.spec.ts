import { describe, test, expect } from "@jest/globals";
import { deleteFile } from "./delete-file.js";
import { get } from "idb-keyval";
import { NodeType } from "../interface.js";

jest.mock("idb-keyval");

describe("deleteFile", () => {
  const mockRemoveEntry = jest.fn();

  const mockAppIdDirectory = jest.fn((name) => ({
    name: name,
    kind: "directory",
    removeEntry: mockRemoveEntry,
  }));

  const mockE2EDirectory = jest.fn((name) => ({
    name: name,
    kind: "directory",
    getDirectoryHandle: mockAppIdDirectory,
  }));

  const mockCypressDirectory = jest.fn((name) => ({
    name: name,
    kind: "directory",
    getDirectoryHandle: mockE2EDirectory,
  }));

  (get as jest.Mock).mockResolvedValue({
    name: "ui-test",
    kind: "directory",
    getDirectoryHandle: mockCypressDirectory,
    requestPermission: jest.fn(),
  });

  test("should work", async () => {
    await deleteFile({ name: "login", type: "suite" as NodeType }, "abced");

    expect(mockRemoveEntry).toHaveBeenCalledWith("login.spec.js");
  });

  test("should work when NotAllowedError", async () => {
    mockRemoveEntry.mockRejectedValueOnce({
      name: "NotAllowedError",
    });
    await deleteFile({ name: "login", type: "suite" as NodeType }, "abced");

    expect(mockRemoveEntry).toHaveBeenCalledWith("login.spec.js");
  });
});
