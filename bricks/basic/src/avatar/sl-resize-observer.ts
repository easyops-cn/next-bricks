import { wrapBrick } from "@next-core/react-element";

export interface SlResizeObserverProps {
  disabled?: boolean;
}

export interface SlResizeObserverEvents {
  "sl-resize": CustomEvent<{ entries: ResizeObserverEntry[] }>;
}

export interface SlResizeObserverEventsMapping {
  onSlResize: "sl-resize";
}

export interface SlResizeObserverElement extends HTMLElement {}

export const WrappedSlResizeObserver = wrapBrick<
  SlResizeObserverElement,
  SlResizeObserverProps,
  SlResizeObserverEvents,
  SlResizeObserverEventsMapping
>("sl-resize-observer", {
  onSlResize: "sl-resize",
});
