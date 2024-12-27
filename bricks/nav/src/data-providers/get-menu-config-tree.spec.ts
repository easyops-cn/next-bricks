import { describe, test, expect } from "@jest/globals";
import { initializeI18n } from "@next-core/i18n";
import { getMenuConfigTree, type MenuRawData } from "./get-menu-config-tree.js";

initializeI18n();

describe("getMenuConfigTree", () => {
  test("should work", async () => {
    const menuList: MenuRawData[] = [
      {
        menuId: "menu-a",
        title: "<% 'Menu A' %>",
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        items: [
          {
            text: "Menu A - Item 1",
            sort: 10,
            icon: {
              imgSrc: '<% IMG.get("...") %>',
            },
          },
          {
            text: "Menu A - Item 2",
            sort: 20,
          },
          {
            text: "Menu A - Group X",
            groupId: "group-x",
            sort: 30,
            children: [
              {
                text: "Group X - i",
              },
            ],
          },
          {
            text: "Menu A - Sub",
            sort: 40,
            children: [
              {
                text: "Sub",
              },
            ],
          },
        ],
      },
      {
        menuId: "menu-a",
        title: "Inject Menu A",
        type: "inject",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        items: [
          {
            text: "<% `Menu A - ${I18N('ITEM_0')}` %>",
          },
          {
            text: "Menu A - Item 1.1",
            sort: 15,
          },
          {
            text: "Menu A - Item 2.1",
            sort: 25,
          },
        ],
        i18n: {
          en: {
            ITEM_0: "Item 0",
          },
        },
      },
      {
        menuId: "menu-a",
        title: "Inject Menu A",
        injectMenuGroupId: "group-x",
        type: "inject",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        items: [
          {
            text: "Group X - ii",
            sort: 1,
            hidden: true,
          },
        ],
      },
      {
        menuId: "menu-a",
        title: "Inject Menu A",
        injectMenuGroupId: "group-x",
        type: "inject",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        items: [
          {
            text: "Group X - iii",
            sort: 2,
          },
        ],
      },
      {
        menuId: "menu-a",
        title: "Inject Menu A",
        type: "inject",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        dynamicItems: true,
        itemsResolve: {},
      },
      {
        menuId: "menu-a",
        title: "Inject Menu A",
        type: "inject",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
      },
    ];
    // Use JSON to remove the symbol properties.
    expect(
      JSON.parse(JSON.stringify(await getMenuConfigTree(menuList)))
    ).toEqual([
      {
        __keys: [
          "0",
          "0-0",
          "0-1",
          "0-2",
          "0-3",
          "0-4",
          "0-5",
          "0-5-0",
          "0-5-1",
          "0-5-2",
          "0-6",
          "0-6-0",
        ],
        children: [
          {
            children: undefined,
            data: {
              children: [],
              text: "<% `Menu A - ${I18N('ITEM_0')}` %>",
            },
            faded: undefined,
            icon: {
              icon: "bars",
              lib: "fa",
            },
            key: "0-0",
            title: "Menu A - Item 0",
          },
          {
            children: undefined,
            data: {
              children: [],
              sort: 10,
              text: "Menu A - Item 1",
              icon: {
                imgSrc: '<% IMG.get("...") %>',
              },
            },
            faded: undefined,
            icon: {
              icon: "bars",
              lib: "fa",
            },
            key: "0-1",
            title: "Menu A - Item 1",
          },
          {
            children: undefined,
            data: {
              children: [],
              sort: 15,
              text: "Menu A - Item 1.1",
            },
            faded: undefined,
            icon: {
              icon: "bars",
              lib: "fa",
            },
            key: "0-2",
            title: "Menu A - Item 1.1",
          },
          {
            children: undefined,
            data: {
              children: [],
              sort: 20,
              text: "Menu A - Item 2",
            },
            faded: undefined,
            icon: {
              icon: "bars",
              lib: "fa",
            },
            key: "0-3",
            title: "Menu A - Item 2",
          },
          {
            children: undefined,
            data: {
              children: [],
              sort: 25,
              text: "Menu A - Item 2.1",
            },
            faded: undefined,
            icon: {
              icon: "bars",
              lib: "fa",
            },
            key: "0-4",
            title: "Menu A - Item 2.1",
          },
          {
            children: [
              {
                children: undefined,
                data: {
                  children: [],
                  text: "Group X - i",
                },
                faded: undefined,
                icon: {
                  icon: "bars",
                  lib: "fa",
                },
                key: "0-5-0",
                title: "Group X - i",
              },
              {
                children: undefined,
                data: {
                  children: [],
                  sort: 1,
                  text: "Group X - ii",
                  hidden: true,
                },
                faded: true,
                icon: {
                  icon: "bars",
                  lib: "fa",
                },
                key: "0-5-1",
                title: "Group X - ii",
              },
              {
                children: undefined,
                data: {
                  children: [],
                  sort: 2,
                  text: "Group X - iii",
                },
                faded: undefined,
                icon: {
                  icon: "bars",
                  lib: "fa",
                },
                key: "0-5-2",
                title: "Group X - iii",
              },
            ],
            data: {
              children: [
                {
                  children: [],
                  text: "Group X - i",
                },
                {
                  children: [],
                  sort: 1,
                  text: "Group X - ii",
                  hidden: true,
                },
                {
                  children: [],
                  sort: 2,
                  text: "Group X - iii",
                },
              ],
              groupId: "group-x",
              sort: 30,
              text: "Menu A - Group X",
            },
            faded: undefined,
            icon: {
              icon: "bars",
              lib: "fa",
            },
            key: "0-5",
            title: "Menu A - Group X",
          },
          {
            children: [
              {
                children: undefined,
                data: {
                  children: [],
                  text: "Sub",
                },
                faded: undefined,
                icon: {
                  icon: "bars",
                  lib: "fa",
                },
                key: "0-6-0",
                title: "Sub",
              },
            ],
            data: {
              children: [
                {
                  children: [],
                  text: "Sub",
                },
              ],
              sort: 40,
              text: "Menu A - Sub",
            },
            faded: undefined,
            icon: {
              icon: "bars",
              lib: "fa",
            },
            key: "0-6",
            title: "Menu A - Sub",
          },
        ],
        data: menuList[0],
        icon: {
          icon: "bars",
          lib: "fa",
        },
        key: "0",
        title: "Menu A",
      },
    ]);
  });
});
