import type {
  ALLOWED_BUTTON_TYPES,
  ALLOWED_COMPONENT_SIZES,
  ALLOWED_SHAPES,
} from "./constants";

/* ============== Common Type Start ============== */

export type Target = "_self" | "_blank" | "_parent" | "_top";

export type UIType = "default" | "dashboard";

export type Shape = (typeof ALLOWED_SHAPES)[number];

/* ============== Common Type Start ============== */

/* ============== Button Type Start ============== */

export type ButtonType = (typeof ALLOWED_BUTTON_TYPES)[number];

export type ComponentSize = (typeof ALLOWED_COMPONENT_SIZES)[number];

/* ============== Button Type End ============== */

/* ============== Link Type Start ============== */

export type LinkType = "link" | "text" | "plain";

/* ============== Link Type End ============== */

/** ============= Popover Type Start ============== */
export type TriggerEvent = "click" | "hover";
/** ============= Popover Type End ============== */
