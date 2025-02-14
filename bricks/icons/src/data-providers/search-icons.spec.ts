import { describe, test, expect } from "@jest/globals";
import { searchIcons } from "./search-icons.js";

describe("searchIcons", () => {
  test("should work", async () => {
    const result1 = await searchIcons();
    expect(result1).toMatchObject({
      list: expect.arrayContaining([
        expect.objectContaining({
          title: "account",
          icon: {
            lib: "easyops",
            category: "default",
            icon: "account",
          },
        }),
      ]),
      page: 1,
      pageSize: 20,
      total: expect.any(Number),
    });
    expect(result1.total).toBeGreaterThan(4000);

    expect(await searchIcons({ q: "  trash-a  " })).toMatchInlineSnapshot(`
      {
        "list": [
          {
            "$searchTextPool": [
              "trash-can",
              "far",
              "trash-alt",
            ],
            "icon": {
              "icon": "trash-can",
              "lib": "fa",
              "prefix": "far",
            },
            "title": "trash-can",
          },
          {
            "$searchTextPool": [
              "trash-arrow-up",
              "fas",
              "trash-restore",
            ],
            "icon": {
              "icon": "trash-arrow-up",
              "lib": "fa",
              "prefix": "fas",
            },
            "title": "trash-arrow-up",
          },
        ],
        "page": 1,
        "pageSize": 20,
        "total": 2,
      }
    `);

    const { total: total3, ...result3 } = await searchIcons({ lib: "antd" });
    expect(result3).toEqual({
      list: expect.arrayContaining([
        expect.objectContaining({
          title: "alert",
          icon: {
            lib: "antd",
            theme: "outlined",
            icon: "alert",
          },
        }),
      ]),
      page: 1,
      pageSize: 20,
    });
    expect(total3).toBeGreaterThan(800);
  });
});
