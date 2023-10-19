import {
  getTestDirHandle,
  getAppDirHandle,
  getCaseFileHandle,
} from "./fileAccess.js";

import { get } from "idb-keyval";

jest.mock("idb-keyval");

describe("fileAccess", () => {
  describe("getTestDirHandle", () => {
    it("should return a directory handle", async () => {
      (get as jest.Mock).mockReturnValueOnce(undefined);

      const mockGetCypressDir = jest.fn(() => ({
        name: "ui-test",
        kind: "directory",
        getDirectoryHandle: jest.fn(),
      }));

      window.showDirectoryPicker = jest.fn().mockResolvedValue({
        name: "ui-test",
        kind: "directory",
        getDirectoryHandle: mockGetCypressDir,
      } as any);

      const dirHandle = await getTestDirHandle();

      expect(dirHandle.name).toBe("ui-test");

      (get as jest.Mock).mockReturnValueOnce({
        name: "cypress",
        kind: "directory",
        getDirectoryHandle: jest.fn(),
      });

      const cacheDirHandle = await getTestDirHandle();

      expect(cacheDirHandle.name).toBe("cypress");
    });
  });

  describe("getAppDirHandle", () => {
    it("should return a directory handle", async () => {
      const mockE2eDirectory = jest.fn((name) => ({
        name: name,
        kind: "directory",
        getDirectoryHandle: jest.fn().mockResolvedValue({
          name: "visual-builder",
          kind: "directory",
        }),
      }));

      const mockGetCypressDir = jest.fn((name) => ({
        name: name,
        kind: "directory",
        getDirectoryHandle: mockE2eDirectory,
      }));

      const testDirHandle = {
        name: "ui-test",
        kind: "directory",
        getDirectoryHandle: mockGetCypressDir,
      };

      const dirHandle = await getAppDirHandle(testDirHandle, {
        appId: "myAppId",
      });

      expect(dirHandle).toEqual({ kind: "directory", name: "visual-builder" });
    });
  });

  describe("getCaseFileHandle", () => {
    it("should return a file handle", async () => {
      (get as jest.Mock).mockResolvedValue(undefined);

      const mockGetFile = jest.fn((name) => ({
        name: name,
        kind: "file",
      }));

      const mockAppIdDirectory = jest.fn((name) => ({
        name: name,
        kind: "directory",
        getFileHandle: mockGetFile,
      }));

      const mockE2eDirectory = jest.fn((name) => ({
        name: name,
        kind: "directory",
        getDirectoryHandle: mockAppIdDirectory,
      }));

      const mockGetCypressDir = jest.fn(() => ({
        name: name,
        kind: "directory",
        getDirectoryHandle: mockE2eDirectory,
      }));

      const testDirHandle = {
        name: "ui-test",
        kind: "directory",
        getDirectoryHandle: mockGetCypressDir,
      };

      const fileHandle = await getCaseFileHandle(testDirHandle, {
        caseName: "route",
        appId: "myAppId",
      });

      expect(fileHandle).toEqual({ kind: "file", name: "route.spec.js" });

      (get as jest.Mock).mockResolvedValueOnce({
        kind: "file",
        name: "test.spec.js",
      });

      const fileHandle2 = await getCaseFileHandle(testDirHandle, {
        caseName: "test",
        appId: "myAppId",
      });
      expect(fileHandle2).toEqual({ kind: "file", name: "test.spec.js" });
    });
  });
});
