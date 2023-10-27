import { describe, test, expect } from "@jest/globals";
import { exportAsFile } from "./export-as-file.js";
import { get, set } from "idb-keyval";
import { parseSuiteAst } from "../utils/parseSuiteAst.js";
import { transformFromAst } from "@babel/standalone";
import { format } from "prettier/standalone";
import { NodeItem } from "../interface.js";

jest.mock("idb-keyval");
jest.mock("../utils/parseSuiteAst.js");
jest.mock("@babel/standalone");
jest.mock("@babel/types");
jest.mock("prettier/standalone");
const consoleError = jest.spyOn(console, "error");

describe("exportAsFile", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should work", async () => {
    (get as jest.Mock).mockResolvedValue(undefined);
    (set as jest.Mock).mockResolvedValue(undefined);

    const mockWrite = jest.fn();
    const mockGetFile = jest.fn((name) => ({
      name: name,
      kind: "file",
      createWritable: jest.fn(() => ({ write: mockWrite, close: jest.fn() })),
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

    const mockGetCypressDir = jest.fn((name) => ({
      name: name,
      kind: "directory",
      getDirectoryHandle: mockE2eDirectory,
    }));

    window.showDirectoryPicker = jest.fn().mockResolvedValue({
      name: "ui-test",
      kind: "directory",
      getDirectoryHandle: mockGetCypressDir,
    } as any);

    (parseSuiteAst as jest.Mock).mockImplementation((item) => item);

    (transformFromAst as jest.Mock).mockImplementation(() => ({
      code: "test content",
    }));
    const specDataList = {
      label: "example to-do app",
      type: "suite",
      children: [
        {
          label: "beforeEach hooks",
          type: "block",
          name: "beforeEach",
          children: [
            {
              type: "command",
              name: "login",
              params: [
                {
                  userName: "easyops",
                  password: 123456,
                },
              ],
            },
            {
              type: "command",
              name: "get",
              label: null,
              params: ["#username"],
              children: [
                {
                  type: "command",
                  name: "type",
                  label: null,
                  params: ["easyops"],
                  children: [],
                },
              ],
            },
          ],
        },
        {
          label: "displays two todo items by default in case 1",
          type: "block",
          name: "it",
          children: [
            {
              type: "command",
              name: "code",
              params: ["cy.get('.todo-list li').should('have.length', 2)"],
            },
            {
              type: "command",
              name: "code",
              params: [
                "cy.get('.todo-list li').first().should('have.text', 'Pay electric bill')",
              ],
            },
            {
              type: "command",
              name: "code",
              params: [
                "cy.get('.todo-list li').last().should('have.text', 'Walk the dog')",
              ],
            },
          ],
        },
      ],
    };

    expect(
      await exportAsFile(specDataList as NodeItem, "visual-builder")
    ).toEqual(true);
  });

  it("should return false with error", async () => {
    consoleError.mockReturnValueOnce();
    expect(await exportAsFile({} as NodeItem, "visual-builder")).toEqual(false);
    expect(consoleError).toBeCalledTimes(1);
  });
});
