import type {
  ALLOWED_BUTTON_TYPES,
  ALLOWED_COMPONENT_SIZES,
  ALLOWED_SHAPES,
} from "./constants";

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
  | "text"
  | "icon"
  | "ai"
  | "ai-alt"
  | "neutral"
  | "flat";

export type ComponentSize = "large" | "medium" | "small" | "xs";

/* ============== Button Type End ============== */

/* ============== Link Type Start ============== */

export type LinkType = "link" | "text" | "plain";

/* ============== Link Type End ============== */

/** ============= Popover Type Start ============== */
export type TriggerEvent = "click" | "hover";
/** ============= Popover Type End ============== */

/* ====== Type checks ====== */
export type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
    ? true
    : false;
export type Expect<T extends true> = T;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type cases = [
  Expect<Equal<Shape, (typeof ALLOWED_SHAPES)[number]>>,
  Expect<Equal<ButtonType, (typeof ALLOWED_BUTTON_TYPES)[number]>>,
  Expect<Equal<ComponentSize, (typeof ALLOWED_COMPONENT_SIZES)[number]>>,
];
