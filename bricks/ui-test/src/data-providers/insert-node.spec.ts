import { describe, test, expect } from "@jest/globals";
import { insertNode } from "./insert-node.js";
import {
  InstanceApi_createInstance,
  InstanceApi_importInstance,
} from "@next-api-sdk/cmdb-sdk";
import { TestTreeData, TreeNodeItemData } from "../interface.js";

jest.mock("@next-api-sdk/cmdb-sdk");
describe("insertNode", () => {
  test("should work", async () => {
    const TestTreeData = [
      {
        name: "test",
        key: "6086e6fbe331a",
        icon: {
          lib: "fa",
          icon: "vial",
          color: "var(--palette-purple-6)",
        },
        data: {
          flag: null,
          instanceId: "6086e6fbe331a",
          label: "test",
          name: "test",
          params: null,
          sort: null,
          type: "suite",
          isChainChild: false,
          displayLabel: "test",
          children: [
            {
              flag: null,
              instanceId: "6086e6fc259fd",
              label: "test",
              name: "describe",

              params: null,
              sort: 0,
              type: "block",
            },
          ],
          nextChildSort: 1,
        },
        children: [
          {
            name: "describe: test",
            key: "6086e6fc259fd",
            icon: {
              lib: "fa",
              icon: "bookmark",
              color: "var(--palette-cyan-6)",
            },
            data: {
              flag: null,
              instanceId: "6086e6fc259fd",
              label: "test",
              name: "describe",
              params: null,
              sort: 0,
              type: "block",

              isChainChild: false,
              parent: {
                creator: "easyops",
                ctime: "2023-10-24 12:04:34",
                deleteAuthorizers: [],
                flag: null,
                instanceId: "6086e6fbe331a",
                label: "test",
                modifier: null,
                mtime: null,
                name: "test",
                params: null,
                readAuthorizers: [],
                route: [],
                sort: null,
                type: "suite",
                updateAuthorizers: [],
              },
              displayLabel: "describe: test",
              children: [
                {
                  flag: null,
                  instanceId: "6086e6fc62836",
                  label: null,
                  modifier: null,
                  mtime: null,
                  name: "beforeEach",
                  org: 8888,
                  params: null,
                  readAuthorizers: [],
                  sort: 0,
                  type: "block",
                  updateAuthorizers: [],
                },
                {
                  flag: null,
                  instanceId: "6086e6fd319e3",
                  label: "should work",
                  modifier: null,
                  mtime: null,
                  name: "it",

                  params: null,
                  readAuthorizers: [],
                  sort: 1,
                  type: "block",
                  updateAuthorizers: [],
                },
              ],
              nextChildSort: 2,
              isLastChild: true,
              nextSiblingSort: 1,
            },
            children: [
              {
                name: "it: should work",
                key: "6086e6fd319e3",
                icon: {
                  lib: "fa",
                  icon: "bookmark",
                  color: "var(--palette-cyan-6)",
                },
                data: {
                  flag: null,
                  instanceId: "6086e6fd319e3",
                  label: "should work",
                  modifier: null,
                  mtime: null,
                  name: "it",
                  params: null,
                  readAuthorizers: [],
                  sort: 0,
                  type: "block",
                  updateAuthorizers: [],
                  isChainChild: false,
                  parent: {
                    flag: null,
                    instanceId: "6086e6fc259fd",
                    label: "test",
                    modifier: null,
                    mtime: null,
                    name: "describe",
                    params: null,
                    readAuthorizers: [],
                    sort: 0,
                    type: "block",
                    updateAuthorizers: [],
                  },
                  displayLabel: "it: should work",
                  children: [
                    {
                      flag: null,
                      instanceId: "608744d9ede46",
                      label: null,
                      modifier: null,
                      mtime: null,
                      name: "findByTestId",
                      params: ["test"],
                      readAuthorizers: [],
                      sort: 0,
                      type: "command",
                      updateAuthorizers: [],
                    },
                  ],
                  nextChildSort: 1,
                  isLastChild: true,
                  nextSiblingSort: 1,
                },
                children: [
                  {
                    name: "findByTestId: test",
                    key: "608744d9ede46",
                    icon: {
                      lib: "antd",
                      icon: "aim",
                      color: "var(--palette-blue-6)",
                    },
                    data: {
                      flag: null,
                      instanceId: "608744d9ede46",
                      label: null,
                      modifier: null,
                      mtime: null,
                      name: "findByTestId",
                      params: ["test"],
                      readAuthorizers: [],
                      sort: 0,
                      type: "command",
                      updateAuthorizers: [],
                      isChainChild: false,
                      parent: {
                        flag: null,
                        instanceId: "6086e6fd319e3",
                        label: "should work",
                        modifier: null,
                        mtime: null,
                        name: "it",
                        params: null,
                        readAuthorizers: [],
                        sort: 0,
                        type: "block",
                        updateAuthorizers: [],
                      },
                      displayLabel: "findByTestId: test",
                      children: [
                        {
                          flag: null,
                          instanceId: "608744ec6d575",
                          label: null,
                          modifier: null,
                          mtime: null,
                          name: "as",
                          params: ["card"],
                          readAuthorizers: [],
                          sort: 0,
                          type: "command",
                          updateAuthorizers: [],
                        },
                        {
                          flag: null,
                          instanceId: "60874512bc785",
                          label: null,
                          name: "click",
                          params: [
                            {
                              force: true,
                            },
                          ],
                          sort: 2,
                          type: "command",
                        },
                      ],
                      nextChildSort: 2,
                      isLastChild: true,
                      nextSiblingSort: 1,
                    },
                    children: [
                      {
                        name: "as: card",
                        key: "608744ec6d575",
                        icon: {
                          color: "var(--palette-blue-6)",
                          lib: "fa",
                          icon: "at",
                        },
                        data: {
                          flag: null,
                          instanceId: "608744ec6d575",
                          label: null,
                          modifier: null,
                          mtime: null,
                          name: "as",
                          params: ["card"],
                          readAuthorizers: [],
                          sort: 0,
                          type: "command",
                          updateAuthorizers: [],
                          isChainChild: true,
                          parent: {
                            flag: null,
                            instanceId: "608744d9ede46",
                            label: null,
                            modifier: null,
                            mtime: null,
                            name: "findByTestId",
                            params: ["test"],
                            readAuthorizers: [],
                            sort: 0,
                            type: "command",
                            updateAuthorizers: [],
                          },
                          displayLabel: "as: card",
                          children: [],
                          nextChildSort: 0,
                          nextSiblingSort: 2,
                        },
                        children: [],
                      },
                      {
                        name: "click",
                        key: "60874512bc785",
                        icon: {
                          lib: "fa",
                          icon: "computer-mouse",
                          color: "var(--palette-red-6)",
                        },
                        data: {
                          flag: null,
                          instanceId: "60874512bc785",
                          label: null,
                          modifier: null,
                          mtime: null,
                          name: "click",
                          params: [
                            {
                              force: true,
                            },
                          ],
                          readAuthorizers: [],
                          sort: 1,
                          type: "command",
                          updateAuthorizers: [],
                          isChainChild: true,
                          parent: {
                            flag: null,
                            instanceId: "608744d9ede46",
                            label: null,
                            modifier: null,
                            mtime: null,
                            name: "findByTestId",
                            params: ["test"],
                            readAuthorizers: [],
                            sort: 1,
                            type: "command",
                            updateAuthorizers: [],
                          },
                          displayLabel: "click",
                          children: [],
                          nextChildSort: 0,
                          isLastChild: true,
                          nextSiblingSort: 2,
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const itemNode = {
      flag: null,
      instanceId: "608744ec6d575",
      label: null,
      modifier: null,
      mtime: null,
      name: "as",
      params: ["card"],
      sort: 0,
      type: "command",
      parent: {
        flag: null,
        instanceId: "608744d9ede46",
        label: null,
        name: "findByTestId",
        params: ["test"],
        sort: 0,
        type: "command",
      },
      displayLabel: "as: card",
      children: [],
    };

    const formData = {
      name: "find",
      params: [".header"],
    };

    await insertNode(
      TestTreeData as unknown as TestTreeData[],
      itemNode as unknown as TreeNodeItemData,
      formData
    );

    expect(InstanceApi_createInstance).toHaveBeenLastCalledWith(
      "UI_TEST_NODE@EASYOPS",
      { name: "find", params: [".header"], parent: "608744d9ede46", sort: 1 }
    );

    expect(InstanceApi_importInstance).toHaveBeenLastCalledWith(
      "UI_TEST_NODE@EASYOPS",
      {
        datas: [{ instanceId: "60874512bc785", sort: 2 }],
        keys: ["instanceId"],
      }
    );

    await insertNode(
      TestTreeData as unknown as TestTreeData[],
      itemNode as unknown as TreeNodeItemData,
      formData,
      "up"
    );

    expect(InstanceApi_createInstance).toHaveBeenLastCalledWith(
      "UI_TEST_NODE@EASYOPS",
      { name: "find", params: [".header"], parent: "608744d9ede46", sort: 0 }
    );

    expect(InstanceApi_importInstance).toHaveBeenLastCalledWith(
      "UI_TEST_NODE@EASYOPS",
      {
        datas: [
          { instanceId: "608744ec6d575", sort: 1 },
          { instanceId: "60874512bc785", sort: 2 },
        ],
        keys: ["instanceId"],
      }
    );
  });
});
