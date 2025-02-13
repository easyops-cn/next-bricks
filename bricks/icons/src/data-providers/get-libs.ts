import { createProviderClass } from "@next-core/utils/general";
import { has, uniqBy } from "lodash";
import AliasJson from "../fa-icon/generated/alias.json";
import type { LibIconProps } from "../general-icon/index.jsx";
import { getEasyopsIcons, getFaIcons, getAntdIcons } from "./get-icons.js";

export interface IconInfo {
  title: string;
  icon: LibIconProps;
  $searchTextPool: string[];
}

export interface LibInfo {
  title: string;
  lib: string;
  icons: IconInfo[];
}

export async function getLibs(): Promise<LibInfo[]> {
  const easyopsIconLib = getEasyopsIcons().then((allIcons) => {
    const iconInfoList: IconInfo[] = [];
    Object.entries(allIcons).forEach(([category, icons]) => {
      icons.forEach((iconName) => {
        iconInfoList.push({
          title: iconName,
          icon: {
            lib: "easyops",
            category,
            icon: iconName,
          },
          $searchTextPool: [iconName, category],
        });
      });
    });
    return { title: "easyops", lib: "easyops", icons: iconInfoList };
  });

  const faIconLib = getFaIcons().then((allIcons) => {
    const iconAliasMapByPrefix: Record<string, Record<string, string[]>> = {};
    Object.entries(AliasJson as Record<string, Record<string, string>>).forEach(
      ([prefix, aliasesMap]) => {
        iconAliasMapByPrefix[prefix] = {};
        Object.entries(aliasesMap).forEach(([alias, iconName]) => {
          iconAliasMapByPrefix[prefix][iconName]
            ? iconAliasMapByPrefix[prefix][iconName].push(alias)
            : (iconAliasMapByPrefix[prefix][iconName] = [alias]);
        });
      }
    );

    const iconInfoList: IconInfo[] = [];
    Object.entries(allIcons).forEach(([prefix, icons]) => {
      icons.forEach((iconName) => {
        const aliases =
          has(iconAliasMapByPrefix, prefix) &&
          has(iconAliasMapByPrefix[prefix], iconName)
            ? iconAliasMapByPrefix[prefix][iconName]
            : [];
        iconInfoList.push({
          title: iconName,
          icon: {
            lib: "fa",
            prefix,
            icon: iconName,
          },
          $searchTextPool: [iconName, prefix, ...aliases],
        });
      });
    });
    return {
      title: "font awesome",
      lib: "fa",
      icons: uniqBy(iconInfoList, "title"),
    };
  });

  const antdIconLib = getAntdIcons().then((allIcons) => {
    const iconInfoList: IconInfo[] = [];
    Object.entries(allIcons).forEach(([theme, icons]) => {
      icons.forEach((iconName) => {
        iconInfoList.push({
          title: iconName,
          icon: {
            lib: "antd",
            theme,
            icon: iconName,
          },
          $searchTextPool: [iconName, theme],
        });
      });
    });
    return { title: "ant design", lib: "antd", icons: iconInfoList };
  });

  return Promise.all([easyopsIconLib, antdIconLib, faIconLib]);
}

customElements.define("icons.get-libs", createProviderClass(getLibs));
