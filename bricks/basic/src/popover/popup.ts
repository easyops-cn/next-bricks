import { wrapBrick } from "@next-core/react-element";

export const ARROW_SIZE = 6;
export const POPUP_DISTANCE = 0;

export const popupVisibleStyle: Record<string, any> = {
  opacity: 1,
  scale: 1,
};
export const popupInvisibleStyle: Record<string, any> = {
  opacity: 0,
  scale: 0.9,
};
export const popupAnimationOptions = {
  duration: 100,
  easing: "ease",
};

export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "right"
  | "right-start"
  | "right-end"
  | "left"
  | "left-start"
  | "left-end";

export type ArrowPlacement = "start" | "end" | "center" | "anchor";

export type AutoSize = "horizontal" | "vertical" | "both";

export type Sync = "width" | "height" | "both";

export interface SlPopupProps {
  popup?: HTMLElement;
  anchor?: HTMLElement | string;
  active?: boolean;
  placement?: Placement;
  strategy?: "absolute" | "fixed";
  distance?: number;
  skidding?: number;
  arrow?: boolean;
  arrowPlacement?: ArrowPlacement;
  arrowPadding?: number;
  flip?: boolean;
  flipFallbackPlacements?: string;
  flipFallbackStrategy?: "best-fit" | "initial";
  flipBoundary?: Element | Element[];
  flipPadding?: number;
  shift?: boolean;
  shiftBoundary?: Element | Element[];
  shiftPadding?: number;
  autoSize?: number;
  sync?: Sync;
  autoSizeBoundary?: Element | Element[];
  autoSizePadding?: number;
}

export interface SlPopupEvents {
  "sl-reposition": Event;
}

export interface SlPopupMapEvents {
  onSlReposition: "sl-reposition";
}

export interface SlPopupElement extends HTMLElement {
  reposition(): void;
  popup?: HTMLElement;
  active?: boolean;
}

export const WrappedSlPopup = wrapBrick<
  SlPopupElement,
  SlPopupProps,
  SlPopupEvents,
  SlPopupMapEvents
>("sl-popup", {
  onSlReposition: "sl-reposition",
});
