// Define brick: sl-button
// istanbul ignore file
import { wrapLocalBrick } from "@next-core/react-element";
import "@shoelace-style/shoelace/dist/components/button/button.js";
import "../shared/common.js";

export interface SlButtonProps {
  variant?: string;
}

export const WrappedSlButton = wrapLocalBrick<HTMLElement, SlButtonProps>("sl-button");
