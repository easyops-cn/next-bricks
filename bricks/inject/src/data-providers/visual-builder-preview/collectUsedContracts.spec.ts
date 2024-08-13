import type { Storyboard } from "@next-core/types";
import { collectUsedContracts } from "./collectUsedContracts.js";

describe("collectUsedContracts", () => {
  it.each([
    [
      {
        app: {
          id: "test-app",
          name: "test-app",
          homepage: "/test-app",
        },
        routes: [
          {
            alias: "/new",
            context: [
              {
                name: "historyList",
                path: "",
                resolve: {
                  args: [
                    {
                      page: "<% QUERY.page || 1 %>",
                      pageSize: "<% QUERY.pageSize || 20 %>",
                      userName: "<% SYS.username %>",
                    },
                  ],
                  useProvider:
                    "easyops.api.micro_app.workflow@ViewApprovalHistory:1.0.0",
                },
              },
              {
                name: "detailData",
                path: "",
                resolve: {
                  args: ["6488824169e22eabb53acd05"],
                  transform: {
                    value:
                      '<%\n  _.sortBy(\n    DATA.steps\n      ?.filter((item) =>\n        ["approval", "start"].includes(item.type)\n      )\n      ?.map((item) => ({ ...item, status: item.state })),\n    "started"\n  )\n%>',
                  },
                  useProvider: "easyops.api.micro_app.workflow@Get:1.0.0",
                },
              },
              {
                name: "testgosdaf",
                path: "",
                resolve: {
                  useProvider:
                    "easyops.api.custom_demand_manager.demand_manager@ImportSwagger:1.0.0",
                },
              },
            ],
            exact: true,
            iid: "5fd4e0de0e637",
            path: "${APP.homepage}/new",
            type: "bricks",
            bricks: [
              {
                brick: "basic-bricks.general-modal",
                portal: true,
                properties: {
                  dataset: {
                    testid: "detail-modal",
                  },
                  id: "detail-modal",
                  modalTitle: "查看",
                  width: 700,
                },
              },
            ],
          },
        ],
      },
      [
        "easyops.api.micro_app.workflow@ViewApprovalHistory:1.0.0",
        "easyops.api.micro_app.workflow@Get:1.0.0",
        "easyops.api.custom_demand_manager.demand_manager@ImportSwagger:1.0.0",
      ],
    ],
    [
      {
        app: {
          id: "test-app",
          name: "test-app",
          homepage: "/test-app",
        },
        routes: [
          {
            alias: "/new",
            context: [
              {
                name: "historyList",
                path: "",
                relatedId: "",
                resolve: {
                  args: [
                    {
                      page: "<% QUERY.page || 1 %>",
                      pageSize: "<% QUERY.pageSize || 20 %>",
                      userName: "<% SYS.username %>",
                    },
                  ],
                  useProvider: "providers-of-cmdb.search",
                },
              },
            ],
            exact: true,
            iid: "5fd4e0de0e637",
            path: "${APP.homepage}/new",
            type: "bricks",
            bricks: [
              {
                brick: "basic-bricks.general-modal",
                iid: "5fdffa7f5d689",
                portal: true,
                properties: {
                  dataset: {
                    testid: "detail-modal",
                  },
                  id: "detail-modal",
                  modalTitle: "查看",
                  width: 700,
                },
                events: {
                  click: [
                    {
                      useProvider: "easyops.api.micro_app.workflow@Get:1.0.0",
                      args: ["test"],
                    },
                    {
                      target: "_self",
                      properties: {
                        width: 800,
                      },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
      ["easyops.api.micro_app.workflow@Get:1.0.0"],
    ],
  ])("%# should work", (storyboard, result) => {
    expect(collectUsedContracts(storyboard as Storyboard)).toEqual(result);
  });
});
