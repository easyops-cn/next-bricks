import { describe, test, expect } from "@jest/globals";
import { parsePath } from "./parse-path.js";

describe("parsePath", () => {
  test("should work", async () => {
    expect(
      await parsePath("${APP.homepage}/projects/:projectId/:instanceId")
    ).toMatchObject({
      keys: [
        {
          modifier: "",
          name: "projectId",
          pattern: "[^\\/#\\?]+?",
          prefix: "/",
          suffix: "",
        },
        {
          modifier: "",
          name: "instanceId",
          pattern: "[^\\/#\\?]+?",
          prefix: "/",
          suffix: "",
        },
      ],
    });
  });
});
