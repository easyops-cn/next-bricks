import { describe, test, expect } from "@jest/globals";
import { getLibs } from "./get-libs.js";

describe("getLibs", () => {
  test("should work", async () => {
    expect(await getLibs()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          lib: "easyops",
          icons: expect.arrayContaining([
            expect.objectContaining({
              title: "account",
            }),
          ]),
        }),
        expect.objectContaining({
          lib: "antd",
          icons: expect.arrayContaining([
            expect.objectContaining({
              title: "alert",
            }),
          ]),
        }),
        expect.objectContaining({
          lib: "fa",
          icons: expect.arrayContaining([
            expect.objectContaining({
              title: "comments",
            }),
          ]),
        }),
        expect.objectContaining({
          lib: "lucide",
          icons: expect.arrayContaining([
            expect.objectContaining({
              title: "activity",
            }),
          ]),
        }),
      ])
    );
  });
});
