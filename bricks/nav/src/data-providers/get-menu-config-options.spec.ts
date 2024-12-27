import { describe, test, expect } from "@jest/globals";
import { initializeI18n } from "@next-core/i18n";
import type { MicroApp } from "@next-core/types";
import { getMenuConfigOptions } from "./get-menu-config-options.js";
import type { MenuRawData } from "./get-menu-config-tree.js";

initializeI18n();

const mockError = jest.spyOn(console, "error");

describe("getMenuConfigOptions", () => {
  test("should work", async () => {
    const menuList: MenuRawData[] = [
      {
        menuId: "menu-a",
        title: "<% I18N('MENU_A') %>",
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        i18n: {
          en: {
            MENU_A: "Menu A",
          },
        },
      },
      {
        menuId: "menu-b",
        title: "<% I18N('MENU_B', 'Default Menu B') %>",
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
      },
      {
        menuId: "menu-c",
        title: "<% I18N('MENU_C') %>",
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
      },
      {
        menuId: "menu-d",
        title: undefined!,
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
      },
      {
        menuId: "menu-e",
        title: "<% APP.localeName %>",
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        overrideApp: {
          name: "App A",
        } as MicroApp,
      },
      {
        menuId: "menu-f",
        title: "<% `${CTX.name} - ${I18n('')}` %>",
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
      },
      {
        menuId: "menu-g",
        title: "${APP.localeName}",
        type: "main",
        app: [{ appId: "app-a" }],
        instanceId: "i-a",
        overrideApp: {
          name: "App A",
        } as MicroApp,
      },
    ];
    expect(await getMenuConfigOptions(menuList)).toEqual([
      {
        label: "Menu A (menu-a)",
        value: "menu-a",
      },
      {
        label: "Default Menu B (menu-b)",
        value: "menu-b",
      },
      {
        label: "MENU_C (menu-c)",
        value: "menu-c",
      },
      {
        label: " (menu-d)",
        value: "menu-d",
      },
      {
        label: "App A (menu-e)",
        value: "menu-e",
      },
      {
        label: "<% `${CTX.name} - ${I18n('')}` %> (menu-f)",
        value: "menu-f",
      },
      {
        label: "App A (menu-g)",
        value: "menu-g",
      },
    ]);
  });

  test("syntax error in expression", async () => {
    mockError.mockReturnValueOnce();
    expect(
      await getMenuConfigOptions([
        {
          menuId: "menu-b",
          title: "<% I18N('MENU_B' %>",
          type: "main",
          app: [{ appId: "app-a" }],
          instanceId: "i-a",
        },
      ])
    ).toEqual([
      {
        label: "<% I18N('MENU_B' %> (menu-b)",
        value: "menu-b",
      },
    ]);
    expect(mockError).toBeCalledTimes(1);
    expect(mockError).toBeCalledWith(
      "Parse menu title expression \"<% I18N('MENU_B' %>\" failed:",
      expect.any(SyntaxError)
    );
  });

  test("expression evaluates error", async () => {
    mockError.mockReturnValueOnce();
    expect(
      await getMenuConfigOptions([
        {
          menuId: "menu-b",
          title: "<% I18N[0][0] %>",
          type: "main",
          app: [{ appId: "app-a" }],
          instanceId: "i-a",
        },
      ])
    ).toEqual([
      {
        label: "<% I18N[0][0] %> (menu-b)",
        value: "menu-b",
      },
    ]);
    expect(mockError).toBeCalledTimes(1);
    expect(mockError).toBeCalledWith(
      'Evaluate menu title expression "<% I18N[0][0] %>" failed:',
      expect.any(TypeError)
    );
  });

  test("expression to non-string", async () => {
    mockError.mockReturnValueOnce();
    expect(
      await getMenuConfigOptions([
        {
          menuId: "menu-b",
          title: "<% {} %>",
          type: "main",
          app: [{ appId: "app-a" }],
          instanceId: "i-a",
        },
      ])
    ).toEqual([
      {
        label: "<% {} %> (menu-b)",
        value: "menu-b",
      },
    ]);
    expect(mockError).toBeCalledTimes(1);
    expect(mockError).toBeCalledWith(
      'The result of menu title expression "<% {} %>" is not a string:',
      {}
    );
  });
});
