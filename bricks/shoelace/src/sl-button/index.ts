// Define brick: sl-button
// istanbul ignore file
import { wrapLocalBrick } from "@next-core/react-element";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "../shared/common.js";

export interface SlButtonProps {
  variant?: string;
}

const SlButtonConstructor = customElements.get("sl-button") as any;
SlButtonConstructor.__tagName = "sl-button";

export const WrappedSlButton = wrapLocalBrick<any, SlButtonProps>(SlButtonConstructor);
