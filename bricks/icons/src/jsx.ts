import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { GeneralIcon, GeneralIconProps } from "./general-icon";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "eo-icon": DetailedHTMLProps<HTMLAttributes<GeneralIcon>, GeneralIcon> &
        GeneralIconProps;
    }
  }
}
