import { wrapBrick } from "@next-core/react-element";

export const WrappedSlDialog = wrapBrick<
  SlDialogElement,
  SlDialogProps,
  SlDialogEvents,
  SlDialogMapEvents
>("sl-dialog", {
  onSlHide: "sl-hide",
  onSlRequestClose: "sl-request-close",
});
export const WrappedSlButton = wrapBrick<HTMLElement, SlButtonProps>(
  "sl-button"
);
export const WrappedSlIcon = wrapBrick<HTMLElement, SlIconProps>("sl-icon");

export interface SlDialogProps {
  label?: string;
  open?: boolean;
  noHeader?: boolean;
}

export interface SlDialogEvents {
  "sl-hide": Event;
  "sl-request-close": Event;
}

export interface SlDialogMapEvents {
  onSlHide: "sl-hide";
  onSlRequestClose: "sl-request-close";
}

export interface SlDialogElement extends HTMLElement {
  show(): void;
  hide(): void;
}

export interface SlButtonProps {
  variant?: string;
}

export interface SlIconProps {
  name: string;
}
