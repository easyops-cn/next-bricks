export interface StoredMenuItem {
  type: "app" | "custom";
  id: string;
}

export interface FavMenuItem extends StoredMenuItem {
  favoriteId?: string;
}
