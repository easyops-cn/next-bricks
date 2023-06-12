import { describe, test, expect } from "@jest/globals";
import { getLibs } from "./get-libs.js";

jest.mock("../easyops-icon/generated/icons.json", () => ({
  default: ["search"],
}));
jest.mock("../antd-icon/generated/icons.json", () => ({
  filled: ["alert"],
}));
jest.mock("../fa-icon/generated/icons.json", () => ({
  fas: ["ad", "ad-alias"],
}));
jest.mock("../fa-icon/generated/alias.json", () => ({
  fas: {
    "ad-alias": "ad",
    "ad-alias2": "ad",
    "search-alias": "search",
  },
}));

describe("getLibs", () => {
  test("should work", async () => {
    expect(await getLibs()).toEqual([
      {
        icons: [
          {
            $searchTextPool: ["search", "default"],
            icon: {
              category: "default",
              icon: "search",
              lib: "easyops",
            },
            title: "search",
          },
        ],
        lib: "easyops",
        title: "easyops",
      },
      {
        icons: [
          {
            $searchTextPool: ["alert", "filled"],
            icon: {
              icon: "alert",
              lib: "antd",
              theme: "filled",
            },
            title: "alert",
          },
        ],
        lib: "antd",
        title: "ant design",
      },
      {
        icons: [
          {
            $searchTextPool: ["ad", "fas", "ad-alias", "ad-alias2"],
            icon: {
              icon: "ad",
              lib: "fa",
              prefix: "fas",
            },
            title: "ad",
          },
        ],
        lib: "fa",
        title: "font awesome",
      },
    ]);
  });
});
