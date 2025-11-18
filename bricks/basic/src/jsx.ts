import type { DetailedHTMLProps, HTMLAttributes } from "react";
import type { Button, ButtonProps } from "./button";
import type { EoActions, ActionsProps, SimpleAction } from "./actions";
import type { Link, LinkProps } from "./link";
import type { ToggleLink, ToggleLinkProps } from "./toggle-link";
import type { EoBreadcrumb } from "./breadcrumb";
import type { EoBreadcrumbItem, BreadcrumbItemProps } from "./breadcrumb-item";
import type { EoText, TextProps } from "./text";
import type { EoMenuGroup } from "./menu-group";
import type { DropdownButton, DropdownButtonProps } from "./dropdown-button";
import type {
  EoDropdownActions,
  DropdownActionsProps,
} from "./dropdown-actions";
import type { EoAvatarGroup, EoAvatarGroupProps } from "./avatar-group";
import type { Tag, TagProps } from "./tag";
import type { EoAvatar, AvatarProps } from "./avatar";
import type { MenuItem, MenuComponentProps } from "./menu-item";
import type { EoSidebarSubMenu } from "./sidebar-sub-menu";
import type { Menu, MenuProps } from "./menu";
import type { List, ListProps } from "./list";
import type { Popover, PopoverProps } from "./popover";
import type { EoContextMenu, EoContextMenuProps } from "./context-menu";
import type { TagList, TagListProps, TagListItem } from "./tag-list";
import type { EoPageTitle, PageTitleProps } from "./page-title";
import type { EoImage, ImageProps } from "./image";
import type { EoEasyopsAvatar, EoEasyopsAvatarProps } from "./easyops-avatar";
import type {
  EoMiniActions,
  EoMiniActionsProps,
  SimpleActionType,
} from "./mini-actions";
import type {
  DropdownSelect,
  DropdownSelectProps,
  DropdownSelectOption,
} from "./dropdown-select";
import type {
  EoFrameBreadcrumb,
  EoFrameBreadcrumbProps,
} from "./frame-breadcrumb";
import type {
  LoadingContainer,
  LoadingContainerProps,
} from "./loading-container";
import type {
  EoBroadcastChannel,
  BroadcastChannelProps,
} from "./broadcast-channel";
import type {
  EoFormatterNumber,
  EoFormatterNumberProps,
} from "./formatter-number";
import type {
  EoMessageListener,
  EoMessageListenerProps,
  MessageDetail,
} from "./message-listener";
import type {
  EoMenuItemSubMenu,
  EoMenuSubMenuProps,
} from "./menu-item-sub-menu";
import type { EoViewport, ViewportProps } from "./viewport";
import type { Iframe, IframeProps } from "./iframe";
import type { EoAppBarWrapper, AppBarWrapperProps } from "./app-bar-wrapper";
import type { EoTooltip, ToolTipProps } from "./tooltip";
import type { EoCounterBadge, BadgeProps } from "./counter-badge";
import type { EoSidebar, EoSidebarProps } from "./sidebar";
import type { ExpandedState } from "./sidebar/utils";
import type { EoSidebarMenu, EoSidebarMenuProps } from "./sidebar/sidebar-menu";
import type {
  EoSidebarMenuGroup,
  EoSidebarMenuGroupProps,
} from "./sidebar/sidebar-menu-group";
import type {
  EoSidebarMenuSubmenu,
  EoSidebarMenuSubmenuProps,
} from "./sidebar/sidebar-menu-submenu";
import type {
  EoSidebarMenuItem,
  EoSidebarMenuItemProps,
} from "./sidebar/sidebar-menu-item";
import type { EoBatchAgent } from "./batch-agent";
import type { EoEventAgent } from "./event-agent";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "eo-actions": DetailedHTMLProps<HTMLAttributes<EoActions>, EoActions> &
        ActionsProps & {
          onActionClick?: (event: CustomEvent<SimpleAction>) => void;
          onItemDragStart?: (event: CustomEvent<SimpleAction>) => void;
          onItemDragEnd?: (event: CustomEvent<SimpleAction>) => void;
        };
      "eo-app-bar-wrapper": DetailedHTMLProps<
        HTMLAttributes<EoAppBarWrapper>,
        EoAppBarWrapper
      > &
        AppBarWrapperProps;
      "eo-avatar": DetailedHTMLProps<HTMLAttributes<EoAvatar>, EoAvatar> &
        AvatarProps;
      "eo-avatar-group": DetailedHTMLProps<
        HTMLAttributes<EoAvatarGroup>,
        EoAvatarGroup
      > &
        EoAvatarGroupProps;
      "eo-batch-agent": DetailedHTMLProps<
        HTMLAttributes<EoBatchAgent>,
        EoBatchAgent
      > & {
        onTrigger?: (event: CustomEvent<{ type: string }>) => void;
      };
      "eo-breadcrumb": DetailedHTMLProps<
        HTMLAttributes<EoBreadcrumb>,
        EoBreadcrumb
      >;
      "eo-breadcrumb-item": DetailedHTMLProps<
        HTMLAttributes<EoBreadcrumbItem>,
        EoBreadcrumbItem
      > &
        BreadcrumbItemProps;
      "eo-broadcast-channel": DetailedHTMLProps<
        HTMLAttributes<EoBroadcastChannel>,
        EoBroadcastChannel
      > &
        BroadcastChannelProps & {
          onMessage?: (event: CustomEvent<unknown>) => void;
        };
      "eo-button": DetailedHTMLProps<HTMLAttributes<Button>, Button> &
        ButtonProps;
      "eo-context-menu": DetailedHTMLProps<
        HTMLAttributes<EoContextMenu>,
        EoContextMenu
      > &
        EoContextMenuProps & {
          onActionClick?: (event: CustomEvent<SimpleAction>) => void;
          onItemDragStart?: (event: CustomEvent<SimpleAction>) => void;
          onItemDragEnd?: (event: CustomEvent<SimpleAction>) => void;
        };
      "eo-counter-badge": DetailedHTMLProps<
        HTMLAttributes<EoCounterBadge>,
        EoCounterBadge
      > &
        BadgeProps;
      "eo-dropdown-actions": DetailedHTMLProps<
        HTMLAttributes<EoDropdownActions>,
        EoDropdownActions
      > &
        DropdownActionsProps & {
          onActionClick?: (event: CustomEvent<SimpleAction>) => void;
          onVisibleChange?: (event: CustomEvent<boolean>) => void;
        };
      "eo-dropdown-button": DetailedHTMLProps<
        HTMLAttributes<DropdownButton>,
        DropdownButton
      > &
        DropdownButtonProps & {
          onActionClick?: (event: CustomEvent<SimpleAction>) => void;
          onVisibleChange?: (event: CustomEvent<boolean>) => void;
        };
      "eo-dropdown-select": DetailedHTMLProps<
        HTMLAttributes<DropdownSelect>,
        DropdownSelect
      > &
        DropdownSelectProps & {
          onChange?: (event: CustomEvent<DropdownSelectOption>) => void;
        };
      "eo-easyops-avatar": DetailedHTMLProps<
        HTMLAttributes<EoEasyopsAvatar>,
        EoEasyopsAvatar
      > &
        EoEasyopsAvatarProps;
      "eo-event-agent": DetailedHTMLProps<
        HTMLAttributes<EoEventAgent>,
        EoEventAgent
      > & {
        onTrigger?: (event: CustomEvent<unknown>) => void;
      };
      "eo-formatter-number": DetailedHTMLProps<
        HTMLAttributes<EoFormatterNumber>,
        EoFormatterNumber
      > &
        EoFormatterNumberProps;
      "eo-frame-breadcrumb": DetailedHTMLProps<
        HTMLAttributes<EoFrameBreadcrumb>,
        EoFrameBreadcrumb
      > &
        EoFrameBreadcrumbProps;
      "eo-iframe": DetailedHTMLProps<HTMLAttributes<Iframe>, Iframe> &
        IframeProps & {
          onLoad?: (event: CustomEvent<void>) => void;
        };
      "eo-image": DetailedHTMLProps<HTMLAttributes<EoImage>, EoImage> &
        ImageProps & {
          onVisibleChange?: (event: CustomEvent<boolean>) => void;
        };
      "eo-link": DetailedHTMLProps<HTMLAttributes<Link>, Link> & LinkProps;
      "eo-list": DetailedHTMLProps<HTMLAttributes<List>, List> & ListProps;
      "eo-loading-container": DetailedHTMLProps<
        HTMLAttributes<LoadingContainer>,
        LoadingContainer
      > &
        LoadingContainerProps;
      "eo-menu": DetailedHTMLProps<HTMLAttributes<Menu>, Menu> & MenuProps;
      "eo-menu-group": DetailedHTMLProps<
        HTMLAttributes<EoMenuGroup>,
        EoMenuGroup
      >;
      "eo-menu-item": DetailedHTMLProps<HTMLAttributes<MenuItem>, MenuItem> &
        MenuComponentProps;
      "eo-menu-item-sub-menu": DetailedHTMLProps<
        HTMLAttributes<EoMenuItemSubMenu>,
        EoMenuItemSubMenu
      > &
        EoMenuSubMenuProps;
      "eo-message-listener": DetailedHTMLProps<
        HTMLAttributes<EoMessageListener>,
        EoMessageListener
      > &
        EoMessageListenerProps & {
          onMessage?: (event: CustomEvent<MessageDetail>) => void;
        };
      "eo-mini-actions": DetailedHTMLProps<
        HTMLAttributes<EoMiniActions>,
        EoMiniActions
      > &
        EoMiniActionsProps & {
          onActionClick?: (event: CustomEvent<SimpleActionType>) => void;
          onVisibleChange?: (event: CustomEvent<boolean>) => void;
        };
      "eo-page-title": DetailedHTMLProps<
        HTMLAttributes<EoPageTitle>,
        EoPageTitle
      > &
        PageTitleProps;
      "eo-popover": DetailedHTMLProps<HTMLAttributes<Popover>, Popover> &
        PopoverProps & {
          onVisibleChange?: (event: CustomEvent<boolean>) => void;
          onBeforeVisibleChange?: (event: CustomEvent<boolean>) => void;
        };
      "eo-sidebar": DetailedHTMLProps<HTMLAttributes<EoSidebar>, EoSidebar> &
        EoSidebarProps & {
          onActualWidthChange?: (event: CustomEvent<number>) => void;
          onExpandedStateChange?: (event: CustomEvent<ExpandedState>) => void;
        };
      "eo-sidebar-menu": DetailedHTMLProps<
        HTMLAttributes<EoSidebarMenu>,
        EoSidebarMenu
      > &
        EoSidebarMenuProps;
      "eo-sidebar-menu-group": DetailedHTMLProps<
        HTMLAttributes<EoSidebarMenuGroup>,
        EoSidebarMenuGroup
      > &
        EoSidebarMenuGroupProps;
      "eo-sidebar-menu-item": DetailedHTMLProps<
        HTMLAttributes<EoSidebarMenuItem>,
        EoSidebarMenuItem
      > &
        EoSidebarMenuItemProps;
      "eo-sidebar-menu-submenu": DetailedHTMLProps<
        HTMLAttributes<EoSidebarMenuSubmenu>,
        EoSidebarMenuSubmenu
      > &
        EoSidebarMenuSubmenuProps;
      "eo-sidebar-sub-menu": DetailedHTMLProps<
        HTMLAttributes<EoSidebarSubMenu>,
        EoSidebarSubMenu
      >;
      "eo-tag": DetailedHTMLProps<HTMLAttributes<Tag>, Tag> &
        TagProps & {
          onCheck?: (event: CustomEvent<TagProps>) => void;
          onClose?: (event: CustomEvent<TagProps>) => void;
        };
      "eo-tag-list": DetailedHTMLProps<HTMLAttributes<TagList>, TagList> &
        TagListProps & {
          onCheck?: (
            event: CustomEvent<{
              item: TagListItem | string | undefined;
              list: TagListItem[];
            }>
          ) => void;
          onClose?: (
            event: CustomEvent<{
              item: TagListItem | string | undefined;
              list: TagListItem[];
            }>
          ) => void;
          onTagClick?: (
            event: CustomEvent<TagListItem | string | undefined>
          ) => void;
        };
      "eo-text": DetailedHTMLProps<HTMLAttributes<EoText>, EoText> &
        TextProps & {
          onChange?: (event: CustomEvent<string>) => void;
          onUpdate?: (event: CustomEvent<string>) => void;
        };
      "eo-toggle-link": DetailedHTMLProps<
        HTMLAttributes<ToggleLink>,
        ToggleLink
      > &
        ToggleLinkProps & {
          onToggle?: (event: CustomEvent<boolean>) => void;
        };
      "eo-tooltip": DetailedHTMLProps<HTMLAttributes<EoTooltip>, EoTooltip> &
        ToolTipProps & {
          onOpenChange?: (event: CustomEvent<boolean>) => void;
          onAfterOpenChange?: (event: CustomEvent<boolean>) => void;
        };
      "eo-viewport": DetailedHTMLProps<HTMLAttributes<EoViewport>, EoViewport> &
        ViewportProps;
    }
  }
}
