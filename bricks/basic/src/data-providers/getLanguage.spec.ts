import { describe, test, expect } from "@jest/globals";
import { getLanguage } from "./getLanguage.js";

jest.mock("@next-core/i18n", () => ({
  i18n: {
    language: "zh",
  },
}));

describe("getLanguage", () => {
  test("should work", async () => {
    expect(getLanguage()).toBe("zh");
  });
});
