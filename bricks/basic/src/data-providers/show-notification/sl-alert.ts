import { wrapBrick } from "@next-core/react-element";

export const WrappedSlAlert = wrapBrick<
  SlAlertElement,
  SlAlertProps,
  SlAlertEvents,
  SlAlertMapEvents
>("sl-alert", {
  onSlHide: "sl-hide",
});

export interface SlAlertProps {
  open?: boolean;
}

export interface SlAlertEvents {
  "sl-hide": Event;
}

export interface SlAlertMapEvents {
  onSlHide: "sl-hide";
}

export interface SlAlertElement extends HTMLElement {
  toast(): void;
  show(): void;
  hide(): void;
}
