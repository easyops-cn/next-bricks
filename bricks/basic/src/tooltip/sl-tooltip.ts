import { wrapBrick } from "@next-core/react-element";

export const ARROW_SIZE = 7;
export const DISTANCE = 4;

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

export interface SlTooltipProps {
  content?: string;
  placement?: Placement;
  disabled?: boolean;
  distance?: number;
  open?: boolean;
  skidding?: number;
  trigger?: string;
  hoist?: boolean;
  updateComplete?: () => void;
}

export interface SlTooltipEvents {
  "sl-show": Event;
  "sl-after-show": Event;
  "sl-hide": Event;
  "sl-after-hide": Event;
}

export interface SlTooltipEventsMapping {
  onSlShow: "sl-show";
  onSlAfterShow: "sl-after-show";
  onSlHide: "sl-hide";
  onSlAfterHide: "sl-after-hide";
}

export interface SlTooltipElement extends HTMLElement {
  show(): void;
  hide(): void;
}

export const WrappedSlTooltip = wrapBrick<
  SlTooltipElement,
  SlTooltipProps,
  SlTooltipEvents,
  SlTooltipEventsMapping
>("sl-tooltip", {
  onSlShow: "sl-show",
  onSlAfterShow: "sl-after-show",
  onSlHide: "sl-hide",
  onSlAfterHide: "sl-after-hide",
});
