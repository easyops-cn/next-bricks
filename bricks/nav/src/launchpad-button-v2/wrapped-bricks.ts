import { wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import type { showDialog as _showDialog } from "@next-bricks/basic/data-providers/show-dialog/show-dialog";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";

export const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
export const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

// Use `unwrapProvider` to get the original function of a provider
export const showDialog =
  unwrapProvider<typeof _showDialog>("basic.show-dialog");

export const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
);
