import type {
  DesktopData,
  DesktopItem,
  DesktopItemApp,
  DesktopItemCustom,
} from "../launchpad/interfaces";

export function search(allMenuGroups: DesktopData[], q: string): DesktopData[] {
  if (!q) {
    return allMenuGroups;
  }
  const lowerQ = q.toLowerCase();
  const groups: DesktopData[] = allMenuGroups
    .map((desktop) => ({
      name: desktop.name,
      items: desktop.items
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
                    : matchMenuItemCustom(sub, lowerQ)
                )
                .filter(Boolean) as DesktopItem[];
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
        .filter(Boolean) as DesktopItem[],
    }))
    // ignore empty desktops
    .filter((desktop) => desktop.items.length > 0);
  return groups;
}

function matchMenuItemApp(item: DesktopItemApp, lowerQ: string) {
  return item.app.id.toLowerCase().includes(lowerQ) ||
    item.app.localeName!.toLowerCase().includes(lowerQ)
    ? item
    : null;
}

function matchMenuItemCustom(item: DesktopItemCustom, lowerQ: string) {
  return item.id.toLowerCase().includes(lowerQ) ||
    item.name.toLowerCase().includes(lowerQ)
    ? item
    : null;
}
