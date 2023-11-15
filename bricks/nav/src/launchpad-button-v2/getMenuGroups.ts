import type { MicroApp } from "@next-core/types";
import type { DesktopData, DesktopItem } from "../launchpad/interfaces";

export function getMenuGroups(
  desktops: DesktopData[],
  microAppsById: Map<string, MicroApp>
) {
  return (
    desktops
      .map((desktop) => ({
        name: desktop.name,
        items: desktop.items
          .map((item) => {
            switch (item.type) {
              case "app": {
                const app = microAppsById.get(item.id);
                if (app) {
                  return {
                    type: item.type,
                    id: item.id,
                    app,
                  };
                }
                break;
              }
              case "dir": {
                const items = item.items
                  .map((item) => {
                    if (item.type === "app") {
                      const app = microAppsById.get(item.id);
                      if (app) {
                        return {
                          type: item.type,
                          id: item.id,
                          app,
                        };
                      }
                    } else if (item.type === "custom") {
                      return item;
                    }
                  })
                  .filter(Boolean);
                // ignore empty dirs
                if (items.length > 0) {
                  return {
                    type: item.type,
                    id: item.id,
                    name: item.name,
                    items,
                  };
                }
                break;
              }
              case "custom":
                return item;
            }
          })
          .filter(Boolean) as DesktopItem[],
      }))
      // ignore empty desktops
      .filter((desktop) => desktop.items.length > 0)
  );
}
