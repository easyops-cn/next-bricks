// Define brick: sl-icon
// istanbul ignore file
import { wrapLocalBrick } from "@next-core/react-element";
import "@shoelace-style/shoelace/dist/components/icon/icon.js";
import "../shared/common.js";

export interface SlIconProps {
  name: string;
}

export const WrappedSlIcon = wrapLocalBrick<HTMLElement, SlIconProps>("sl-icon");
