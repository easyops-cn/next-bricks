const sidebarMenuItemTagNameSet = new Set([
  "EO-SIDEBAR-MENU-ITEM",
  "EO-SIDEBAR-MENU-GROUP",
  "EO-SIDEBAR-MENU-SUBMENU",
]);

export const isSidebarMenuItem = (element: Element) =>
  sidebarMenuItemTagNameSet.has(element.tagName);
