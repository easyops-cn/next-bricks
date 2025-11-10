import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { GeneralIcon, GeneralIconProps } from "./general-icon";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "eo-icon": DetailedHTMLProps<HTMLAttributes<GeneralIcon>, GeneralIcon> &
        GeneralIconProps;
    }
  }
}
