// Define brick: sl-icon
// istanbul ignore file
import { wrapLocalBrick } from "@next-core/react-element";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "../shared/common.js";

export interface SlIconProps {
  name: string;
}

const SlIconConstructor = customElements.get("sl-icon") as any;
SlIconConstructor.__tagName = "sl-icon";

export const WrappedSlIcon = wrapLocalBrick<any, SlIconProps>(SlIconConstructor);
