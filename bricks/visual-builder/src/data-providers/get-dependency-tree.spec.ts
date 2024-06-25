import { describe, test, expect } from "@jest/globals";
import { getDependencyTree } from "./get-dependency-tree.js";

describe("getDependencyTree", () => {
  test.each([
    [
      [
        {
          key: "context-key-155",
          name: "hostList",
          icon: {
            lib: "antd",
            theme: "outlined",
            icon: "link",
            color: "orange",
          },
          data: {
            name: "hostList",
            resolve: {
              useProvider: "easyops.api.cmdb.instance@PostSearchV3:1.1.0",
              args: [
                "HOST",
                {
                  fields: ["hostname"],
                },
              ],
              transform: {
                value: "<% DATA.list %>",
              },
            },
            if: "<% CTX.test %>",
            $key: "context-key-155",
          },
        },
        {
          key: "context-key-156",
          name: "test",
          icon: {
            lib: "antd",
            theme: "outlined",
            icon: "code",
            color: "cyan",
          },
          data: {
            name: "test",
            value: "<% CTX.hostList || CTX.data %>",
            $key: "context-key-156",
          },
        },
        {
          key: "context-key-157",
          name: "data",
          icon: {
            lib: "antd",
            theme: "outlined",
            icon: "field-number",
            color: "blue",
          },
          data: {
            name: "data",
            value: {
              list: {
                a: "<% CTX.tst || CTX.hostList %>",
                test: "hahaha",
              },
            },
            $key: "context-key-157",
          },
        },
      ] as any,
      {
        dataType: "CTX",
      },
      [
        {
          children: [
            {
              children: [],
              data: {
                $key: "context-key-156",
                name: "test",
                value: "<% CTX.hostList || CTX.data %>",
              },
              icon: {
                color: "cyan",
                icon: "code",
                lib: "antd",
                theme: "outlined",
              },
              key: "context-key-156",
              name: "test",
            },
          ],
          data: {
            $key: "context-key-155",
            if: "<% CTX.test %>",
            name: "hostList",
            resolve: {
              args: ["HOST", { fields: ["hostname"] }],
              transform: { value: "<% DATA.list %>" },
              useProvider: "easyops.api.cmdb.instance@PostSearchV3:1.1.0",
            },
          },
          icon: {
            color: "orange",
            icon: "link",
            lib: "antd",
            theme: "outlined",
          },
          key: "context-key-155",
          name: "hostList",
        },
        {
          children: [
            {
              children: [],
              data: {
                $key: "context-key-155",
                if: "<% CTX.test %>",
                name: "hostList",
                resolve: {
                  args: ["HOST", { fields: ["hostname"] }],
                  transform: { value: "<% DATA.list %>" },
                  useProvider: "easyops.api.cmdb.instance@PostSearchV3:1.1.0",
                },
              },
              icon: {
                color: "orange",
                icon: "link",
                lib: "antd",
                theme: "outlined",
              },
              key: "context-key-155",
              name: "hostList",
            },
            {
              children: [
                {
                  children: [],
                  data: {
                    $key: "context-key-155",
                    if: "<% CTX.test %>",
                    name: "hostList",
                    resolve: {
                      args: ["HOST", { fields: ["hostname"] }],
                      transform: { value: "<% DATA.list %>" },
                      useProvider:
                        "easyops.api.cmdb.instance@PostSearchV3:1.1.0",
                    },
                  },
                  icon: {
                    color: "orange",
                    icon: "link",
                    lib: "antd",
                    theme: "outlined",
                  },
                  key: "context-key-155",
                  name: "hostList",
                },
              ],
              data: {
                $key: "context-key-157",
                name: "data",
                value: {
                  list: { a: "<% CTX.tst || CTX.hostList %>", test: "hahaha" },
                },
              },
              icon: {
                color: "blue",
                icon: "field-number",
                lib: "antd",
                theme: "outlined",
              },
              key: "context-key-157",
              name: "data",
            },
          ],
          data: {
            $key: "context-key-156",
            name: "test",
            value: "<% CTX.hostList || CTX.data %>",
          },
          icon: { color: "cyan", icon: "code", lib: "antd", theme: "outlined" },
          key: "context-key-156",
          name: "test",
        },
        {
          children: [
            {
              children: [],
              data: {
                $key: "context-key-155",
                if: "<% CTX.test %>",
                name: "hostList",
                resolve: {
                  args: ["HOST", { fields: ["hostname"] }],
                  transform: { value: "<% DATA.list %>" },
                  useProvider: "easyops.api.cmdb.instance@PostSearchV3:1.1.0",
                },
              },
              icon: {
                color: "orange",
                icon: "link",
                lib: "antd",
                theme: "outlined",
              },
              key: "context-key-155",
              name: "hostList",
            },
          ],
          data: {
            $key: "context-key-157",
            name: "data",
            value: {
              list: { a: "<% CTX.tst || CTX.hostList %>", test: "hahaha" },
            },
          },
          icon: {
            color: "blue",
            icon: "field-number",
            lib: "antd",
            theme: "outlined",
          },
          key: "context-key-157",
          name: "data",
        },
      ],
    ],
  ])("should work", (nodeList, options, result) => {
    expect(getDependencyTree(nodeList, options)).toEqual(result);
  });
});
