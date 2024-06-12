import { describe, test, expect } from "@jest/globals";
import { addExtraLibs } from "./addExtraLibs.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
jest.mock("monaco-editor/esm/vs/editor/editor.api.js");

describe("addExtraLibs", () => {
  test("should work", () => {
    jest
      .spyOn(monaco.Uri, "file")
      .mockImplementation(
        (args) => ({ toString: () => `${args}` }) as monaco.Uri
      );

    const mockDispose = jest.fn();
    const mockAddExtraLib = jest
      .spyOn(monaco.languages.typescript.javascriptDefaults, "addExtraLib")
      .mockReturnValue({ dispose: mockDispose });

    addExtraLibs(
      [
        {
          filePath: "test.d.ts",
          content: "declare const PATH:object;",
        },
      ],
      { languageDefaults: "javascriptDefaults" }
    );

    expect(mockAddExtraLib.mock.calls[0][1]).toEqual("libs/test.d.ts");

    addExtraLibs(
      [
        {
          filePath: "test.d.ts",
          content: "declare const QUERY:object;",
        },
      ],
      { languageDefaults: "javascriptDefaults" }
    );

    expect(mockDispose).toHaveBeenCalled();
  });
});
