import { describe, test, expect } from "@jest/globals";
import { searchIcons } from "./search-icons.js";

jest.mock("../easyops-icon/generated/icons.json", () => ({
  default: ["search"],
}));
jest.mock("../antd-icon/generated/icons.json", () => ({
  filled: ["alert"],
}));
jest.mock("../fa-icon/generated/icons.json", () => ({
  fas: ["ad"],
}));
jest.mock("../fa-icon/generated/alias.json", () => ({
  fas: {
    "ad-alias": "ad",
    "ad-alias2": "ad",
    "search-alias": "search",
  },
}));

describe("searchIcons", () => {
  test("should work", async () => {
    expect(await searchIcons()).toEqual({
      list: [
        {
          $searchTextPool: ["search", "default"],
          icon: { category: "default", icon: "search", lib: "easyops" },
          title: "search",
        },
        {
          $searchTextPool: ["alert", "filled"],
          icon: { icon: "alert", lib: "antd", theme: "filled" },
          title: "alert",
        },
        {
          $searchTextPool: ["ad", "fas", "ad-alias", "ad-alias2"],
          icon: { icon: "ad", lib: "fa", prefix: "fas" },
          title: "ad",
        },
      ],
      page: 1,
      pageSize: 20,
      total: 3,
    });

    expect(await searchIcons({ q: "  ad  " })).toEqual({
      list: [
        {
          $searchTextPool: ["ad", "fas", "ad-alias", "ad-alias2"],
          icon: { icon: "ad", lib: "fa", prefix: "fas" },
          title: "ad",
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
    });

    expect(await searchIcons({ lib: "antd" })).toEqual({
      list: [
        {
          $searchTextPool: ["alert", "filled"],
          icon: { icon: "alert", lib: "antd", theme: "filled" },
          title: "alert",
        },
      ],
      page: 1,
      pageSize: 20,
      total: 1,
    });
  });
});
