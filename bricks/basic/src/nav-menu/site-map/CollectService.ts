import { JsonStorage } from "@next-shared/general/JsonStorage";
import type { SidebarMenuSimpleItem } from "@next-shared/general/types";

export class CollectService {
  private storage: JsonStorage;
  private maxCollectLength: number;
  readonly storageKey = "site-map-collect";

  constructor(maxCollectLength?: number) {
    this.storage = new JsonStorage(localStorage);
    this.maxCollectLength = maxCollectLength ?? 10;
  }

  private getCategoryId(id: string): string {
    return `-${this.storageKey}-${id}`;
  }

  public getFavoritesById(id: string): SidebarMenuSimpleItem[] {
    return this.storage.getItem(this.getCategoryId(id)) || [];
  }

  public setItemAsFavorite(id: string, item: SidebarMenuSimpleItem): void {
    const key = this.getCategoryId(id);
    const list = this.getFavoritesById(id);

    if (list.length >= this.maxCollectLength) {
      list.pop();
    }

    list.unshift(item);
    this.storage.setItem(key, list);
  }

  private equalItem(
    prevItem: SidebarMenuSimpleItem,
    item: SidebarMenuSimpleItem,
  ): boolean {
    return prevItem.text === item.text && prevItem.to === item.to;
  }

  public removeItemFromFavorite(id: string, item: SidebarMenuSimpleItem): void {
    const key = this.getCategoryId(id);
    const list = this.getFavoritesById(id);
    const index = list.findIndex((row) => this.equalItem(row, item));
    // istanbul ignore else
    if (index !== -1) {
      list.splice(index, 1);
      this.storage.setItem(key, list);
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
      this.setItemAsFavorite(id, item);
    }
  }
}

export const collectService = new CollectService();
