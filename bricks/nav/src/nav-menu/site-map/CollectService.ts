import type { SidebarMenuSimpleItem } from "@next-shared/general/types";
import {
  MyCollectionApi_listMyCollection,
  MyCollectionApi_ListMyCollectionResponseBody,
  MyCollectionApi_upsertMyCollection,
} from "@next-api-sdk/user-service-sdk";
import { DRAG_DIRECTION, collectModule } from "./constants.js";
import { cloneDeep } from "lodash";
import { handleHttpError } from "@next-core/runtime";

export class CollectService {
  private maxCollectLength: number;
  private collectMap: Map<string, SidebarMenuSimpleItem[]> = new Map();

  constructor(maxCollectLength?: number) {
    this.maxCollectLength = maxCollectLength ?? 10;
  }

  public getFavoritesById(id: string): SidebarMenuSimpleItem[] {
    return cloneDeep(this.collectMap.get(id)) ?? [];
  }

  public async fetchFavorites(id: string): Promise<SidebarMenuSimpleItem[]> {
    const cached = this.collectMap.get(id);
    if (cached) return cached;

    const favorites = (
      await MyCollectionApi_listMyCollection({
        module: collectModule,
        collectionName: id,
      })
    ).payloads
      ?.map((item) => item.extInfo)
      .filter(Boolean) as SidebarMenuSimpleItem[];

    this.collectMap.set(id, favorites);

    return favorites;
  }

  public setItemAsFavorite(id: string, item: SidebarMenuSimpleItem): void {
    const list = this.getFavoritesById(id);

    if (list.length >= this.maxCollectLength) {
      list.pop();
    }

    list.unshift(item);
    this.updateFavoriteItems(id, list);
  }

  public updateFavoriteItems(id: string, list: SidebarMenuSimpleItem[]): void {
    try {
      this.collectMap.set(id, list);
      MyCollectionApi_upsertMyCollection({
        module: collectModule,
        collectionName: id,
        payloads: list?.map((item) => ({
          name: item.text,
          url: item.to,
          extInfo: item,
        })) as MyCollectionApi_ListMyCollectionResponseBody["payloads"],
      });
    } catch (error) {
      // istanbul ignore next
      handleHttpError(error);
    }
  }

  private equalItem(
    prevItem: SidebarMenuSimpleItem,
    item: SidebarMenuSimpleItem
  ): boolean {
    return prevItem.text === item.text && prevItem.to === item.to;
  }

  public removeItemFromFavorite(id: string, item: SidebarMenuSimpleItem): void {
    const list = this.getFavoritesById(id);
    const index = list.findIndex((row) => this.equalItem(row, item));
    // istanbul ignore else
    if (index !== -1) {
      list.splice(index, 1);
      this.updateFavoriteItems(id, list);
    }
  }

  public isCollected(id: string, item: SidebarMenuSimpleItem): boolean {
    const list = this.getFavoritesById(id);
    return list.some((row) => this.equalItem(row, item));
  }

  public toggleFavorite(id: string, item: SidebarMenuSimpleItem): void {
    if (this.isCollected(id, item)) {
      this.removeItemFromFavorite(id, item);
    } else {
      if (this.checkMaxCapacity(id)) return;
      this.setItemAsFavorite(id, item);
    }
  }

  public moveFavoriteTo(
    id: string,
    option: {
      from: SidebarMenuSimpleItem;
      to: SidebarMenuSimpleItem;
      direction: DRAG_DIRECTION;
    }
  ): SidebarMenuSimpleItem[] {
    const { from, to, direction } = option;

    const list = this.getFavoritesById(id);
    if (this.equalItem(from, to)) return list;

    const fromIndex = list.findIndex((row) => this.equalItem(row, from));

    // istanbul ignore else
    if (fromIndex !== -1) {
      list.splice(fromIndex, 1);

      const toIndex = list.findIndex((row) => this.equalItem(row, to));

      //  istanbul ignore else
      if (toIndex !== -1) {
        if (direction === DRAG_DIRECTION.Left) {
          list.splice(toIndex, 0, from);
        } else {
          list.splice(toIndex + 1, 0, from);
        }

        this.updateFavoriteItems(id, list);
      }
    }

    return list;
  }

  checkMaxCapacity(groupId: string): boolean {
    return this.getFavoritesById(groupId).length >= this.maxCollectLength;
  }
}

export const collectService = new CollectService();
