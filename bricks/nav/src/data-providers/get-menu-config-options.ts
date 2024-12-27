import { createProviderClass } from "@next-core/utils/general";
import { i18n } from "@next-core/i18n";
import type { MenuRawData } from "./get-menu-config-tree";
import { smartDisplayForMenuTitle } from "./shared/smartDisplayForMenuTitle";

export interface MenuOption {
  label: string;
  value: string;
}

/**
 * 构造用于菜单自定义的下拉选项数据。
 *
 * 将对菜单标题进行表达式解析，支持 I8N 和 APP。
 */
export async function getMenuConfigOptions(
  menuList: MenuRawData[]
): Promise<MenuOption[]> {
  const options: MenuOption[] = [];

  for (const menu of menuList) {
    if (menu.type === "main") {
      const menuI18nNamespace = `customize-menu/${menu.menuId}~${menu.app[0].appId}+${
        menu.instanceId
      }`;
      // Support any language in `menu.i18n`.
      Object.entries(menu.i18n ?? {}).forEach(([lang, resources]) => {
        i18n.addResourceBundle(lang, menuI18nNamespace, resources);
      });
      options.push({
        label: `${smartDisplayForMenuTitle(menu.title, menuI18nNamespace, menu.overrideApp) ?? ""} (${menu.menuId})`,
        value: menu.menuId,
      });
    }
  }

  return options;
}

customElements.define(
  "nav.get-menu-config-options",
  createProviderClass(getMenuConfigOptions)
);
