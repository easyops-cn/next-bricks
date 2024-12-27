import { createProviderClass } from "@next-core/utils/general";
import type { MenuRawData } from "./get-menu-config-tree";
import {
  initializeMenuI18n,
  smartDisplayForMenuTitle,
} from "./shared/smartDisplayForMenuTitle";

export interface MenuOption {
  label: string;
  value: string;
}

/**
 * 构造用于菜单自定义的下拉选项数据。
 *
 * 将对菜单标题进行表达式解析，支持 I18N 和 APP。
 */
export async function getMenuConfigOptions(
  menuList: MenuRawData[]
): Promise<MenuOption[]> {
  const options: MenuOption[] = [];

  const { menuWithI18n, dispose } = initializeMenuI18n(menuList);

  for (const menu of menuList) {
    options.push({
      label: `${smartDisplayForMenuTitle(menu.title, menuWithI18n.get(menu), menu.overrideApp) ?? ""} (${menu.menuId})`,
      value: menu.menuId,
    });
  }

  dispose();

  return options;
}

customElements.define(
  "nav.get-menu-config-options",
  createProviderClass(getMenuConfigOptions)
);
