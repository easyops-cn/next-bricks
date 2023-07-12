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

export type LinkType = "link" | "text" | "plain";

/* ============== Link Type End ============== */

/** ============= Popover Type Start ============== */
export type TriggerEvent = "click" | "hover";
/** ============= Popover Type End ============== */
