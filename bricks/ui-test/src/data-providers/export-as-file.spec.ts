import { describe, test, expect } from "@jest/globals";
import { exportAsFile } from "./export-as-file.js";
import { saveAs } from "file-saver";
jest.mock("file-saver");

describe("exportAsFile", () => {
  test("should work", async () => {
    const specDataList = [
      {
        alias: "example to-do app",
        type: "describe",
        children: [
          {
            alias: "beforeEach hooks",
            type: "beforeEach",
            children: [
              {
                type: "code",
                params: {
                  content: "cy.visit('http://localhost:3000')",
                },
              },
              {
                type: "preset",
                name: "login",
                params: {
                  useName: "easyops",
                  password: 123456,
                },
              },
            ],
          },
        ],
      },
    ];

    exportAsFile(specDataList);
    expect(saveAs.mock.calls[0][1]).toEqual("demo.spec.js");
  });
});
