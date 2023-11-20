import { wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import type {
  EoDropdownActions,
  DropdownActionsProps,
  DropdownActionsEvents,
  DropdownActionsEventsMapping,
} from "@next-bricks/basic/dropdown-actions";
import type { showDialog as _showDialog } from "@next-bricks/basic/data-providers/show-dialog/show-dialog";

export const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
export const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
export const WrappedDropdownActions = wrapBrick<
  EoDropdownActions,
  DropdownActionsProps,
  DropdownActionsEvents,
  DropdownActionsEventsMapping
>("eo-dropdown-actions", {
  onActionClick: "action.click",
  onVisibleChange: "visible.change",
});

// Use `unwrapProvider` to get the original function of a provider
export const showDialog =
  unwrapProvider<typeof _showDialog>("basic.show-dialog");
