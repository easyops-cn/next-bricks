import type {
  MenuGroupData,
  MenuItemData,
  MenuItemDataApp,
  MenuItemDataCustom,
  MenuItemDataNormal,
  PlatformCategoryItem,
} from "./interfaces";

export function search(
  allMenuGroups: MenuGroupData[],
  q: string
): MenuGroupData[] {
  if (!q) {
    return allMenuGroups;
  }
  const lowerQ = q.toLowerCase();
  const groups: MenuGroupData[] = allMenuGroups
    .map((group) => ({
      ...group,
      items: group.items
        .map((item) => {
          switch (item.type) {
            case "app":
              return matchMenuItemApp(item, lowerQ);
            case "custom":
              return matchMenuItemCustom(item, lowerQ);
            case "dir": {
              const filteredSubItems = item.items
                .map((sub) =>
                  sub.type === "app"
                    ? matchMenuItemApp(sub, lowerQ)
                    : sub.type === "custom"
                      ? matchMenuItemCustom(sub, lowerQ)
                      : null
                )
                .filter(Boolean) as MenuItemData[];
              return filteredSubItems.length > 0
                ? {
                    ...item,
                    items: filteredSubItems,
                  }
                : null;
            }
          }
        })
        // Ignore not matched items
        .filter(Boolean) as MenuItemData[],
    }))
    // ignore empty desktops
    .filter((group) => group.items.length > 0);
  return groups;
}

export function searchCategories(
  categories: PlatformCategoryItem[],
  q: string
): PlatformCategoryItem[] {
  if (!q) {
    return categories;
  }

  const lowerQ = q.toLowerCase();
  const _categories = categories.map((category) => ({
    ...category,
    items: category.items
      .map((item) => {
        switch (item.type) {
          case "app":
            return matchMenuItemApp(item, lowerQ);
          case "custom":
            return matchMenuItemCustom(item, lowerQ);
        }
      })
      // Ignore not matched items
      .filter(Boolean) as MenuItemDataNormal[],
  }));
  return _categories;
}

function matchMenuItemApp(item: MenuItemDataApp, lowerQ: string) {
  return item.id.toLowerCase().includes(lowerQ) ||
    item.name.toLowerCase().includes(lowerQ) ||
    (item.description && item.description.toLowerCase().includes(lowerQ))
    ? item
    : null;
}

function matchMenuItemCustom(item: MenuItemDataCustom, lowerQ: string) {
  return item.id.toLowerCase().includes(lowerQ) ||
    item.name.toLowerCase().includes(lowerQ) ||
    (item.description && item.description.toLowerCase().includes(lowerQ))
    ? item
    : null;
}
