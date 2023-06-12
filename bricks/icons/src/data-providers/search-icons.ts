import { createProviderClass } from "@next-core/utils/general";
import { getLibs, type IconInfo } from "./get-libs.js";

export interface SearchParams {
  q?: string;
  lib?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchResult {
  list: IconInfo[];
  page: number;
  pageSize: number;
  total: number;
}

export async function searchIcons(
  params?: SearchParams
): Promise<SearchResult> {
  const { q = "", lib, page = 1, pageSize = 20 } = params || {};
  const lq = q.trim().toLowerCase();

  const iconInfoList = (await getLibs()).flatMap((v) =>
    !lib || v.lib === lib ? v.icons : []
  );

  const filteredList = iconInfoList
    .filter((iconInfo) =>
      iconInfo.$searchTextPool.some((searchText) =>
        searchText.toLowerCase().includes(lq)
      )
    )
    .slice((page - 1) * pageSize, page * pageSize);

  return {
    page,
    pageSize,
    list: filteredList,
    total: filteredList.length,
  };
}

customElements.define("icons.search-icons", createProviderClass(searchIcons));
