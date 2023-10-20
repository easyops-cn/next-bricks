import { describe, test, expect } from "@jest/globals";
import { batchSetAppsLocalTheme } from "@next-core/runtime";
import { setThemeByApps } from "./set-theme-by-apps.js";

jest.mock("@next-core/runtime");

describe("setThemeByApps", () => {
  test("should work", () => {
    setThemeByApps({ "my-app": "dark-v2" });
    expect(batchSetAppsLocalTheme).toBeCalledWith({ "my-app": "dark-v2" });
  });
});
