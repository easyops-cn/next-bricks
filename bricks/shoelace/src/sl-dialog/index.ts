// Define brick: sl-dialog
// istanbul ignore file
import { wrapLocalBrick } from "@next-core/react-element";
import "@shoelace-style/shoelace/dist/components/dialog/dialog.js";
import "../shared/common.js";

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

const SlDialogConstructor = customElements.get("sl-dialog") as any;
SlDialogConstructor.__tagName = "sl-dialog";

export const WrappedSlDialog = wrapLocalBrick<any, SlDialogProps, SlDialogEvents, SlDialogMapEvents>(SlDialogConstructor, {
  onSlHide: "sl-hide",
  onSlRequestClose: "sl-request-close",
});
