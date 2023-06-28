import { describe, test, expect } from "@jest/globals";
import { changeLanguage } from "./changeLanguage.js";

jest.mock("@next-core/i18n", () => ({
  i18n: {
    changeLanguage: (_: string): Promise<boolean> => {
      return Promise.resolve(true);
    },
  },
}));

describe("changeLanguage", () => {
  test("should work", async () => {
    expect(await changeLanguage("zh")).toBe(undefined);
  });
});
