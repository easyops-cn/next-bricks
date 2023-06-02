import type { GeneralIconProps } from "@next-bricks/icons/general-icon";
/* ============== Common Type Start ============== */

export type Target = "_self" | "_blank" | "_parent" | "_top";

export type UIType = "default" | "dashboard";

export type Shape = "round" | "circle";

/* ============== Common Type Start ============== */

/* ============== Button Type Start ============== */

export type ButtonType =
  | "primary"
  | "default"
  | "dashed"
  | "ghost"
  | "link"
  | "text";

export type ComponentSize = "large" | "medium" | "small" | "xs";

/* ============== Button Type End ============== */

/* ============== Link Type Start ============== */

export type LinkType = "link" | "text";

/* ============== Link Type End ============== */

/** ============= Popover Type Start ============== */
export type TriggerEvent = "click" | "hover";
/** ============= Popover Type End ============== */

/** ============= Nav Menu Type Start ============== */
export type MenuItem = MenuSimpleItem | MenuGroup;

export type MenuItemType = "default" | "group" | "subMenu" | "subMenu";

export interface MenuSimpleItem {
  activeExcludes?: string[];
  activeIncludes?: string[];
  activeMatchSearch?: boolean;
  exact?: boolean;
  href?: string;
  icon?: GeneralIconProps;
  // @internal (undocumented)
  key?: string;
  target?: Target;
  text: string;
  to?: string;
  // (undocumented)
  type?: "default";
}

export interface MenuGroup {
  defaultExpanded?: boolean;
  icon?: GeneralIconProps;
  items: MenuItem[];
  key?: string;
  title: string;
  type: "group" | "subMenu";
}
/** ============= Nav Menu Type End ============== */
