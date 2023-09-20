import { wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

export const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
export const WrappedGeneralIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "eo-icon"
);
