import {
  SidebarMenuItem,
  SidebarMenuGroup,
  SidebarMenuSimpleItem,
} from "@next-shared/general/types";

function walkMenuItem(item: SidebarMenuItem, list: SidebarMenuSimpleItem[]) {
  if (
    (item as SidebarMenuGroup).type === "group" &&
    Array.isArray((item as SidebarMenuGroup).items)
  ) {
    walkMenuItems((item as SidebarMenuGroup).items, list);
  } else {
    list.push(item as SidebarMenuSimpleItem);
  }
}

function walkMenuItems(
  items: SidebarMenuItem[],
  list: SidebarMenuSimpleItem[],
): void {
  for (const item of items) {
    walkMenuItem(item, list);
  }
}

export function flatMenuItems(item: SidebarMenuItem): SidebarMenuSimpleItem[] {
  const list: SidebarMenuSimpleItem[] = [];

  walkMenuItem(item, list);

  return list;
}

export function processGroupItems(groups: SidebarMenuGroup[]): Array<{
  groupFrom: string;
  groups: SidebarMenuGroup[];
}> {
  const groupCategoryMap = new Map<string, SidebarMenuGroup[]>();
  const categoryOrder = new Set<string>();

  groups?.forEach((item) => {
    const from = item.groupFrom ?? "default";
    categoryOrder.add(from);

    const value = groupCategoryMap.get(from);

    if (!value) {
      groupCategoryMap.set(from, [item]);
    } else {
      value!.push(item);
    }
  });

  return Array.from(categoryOrder).map((key) => ({
    groupFrom: key,
    groups: groupCategoryMap!.get(key)!,
  }));
}
