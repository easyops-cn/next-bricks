import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "../../link/index.jsx";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface EoSidebarMenuItemProps {
  url?: LinkProps["url"];
  href?: LinkProps["href"];
  icon?: GeneralIconProps;
  target?: LinkProps["target"];
  selected?: boolean;
  menuCollapsed?: boolean;
}

/**
 * 侧栏菜单项 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
 * @en Sidebar menu item. It has been migrated to the `nav` bricks package and will no longer be updated in the `basic` bricks package.
 * @deprecated
 * @category navigation
 */
export
@defineElement("eo-sidebar-menu-item", {
  styleTexts: [styleText],
})
class EoSidebarMenuItem
  extends ReactNextElement
  implements EoSidebarMenuItemProps
{
  /**
   * 菜单项对应的系统内地址
   * @en Internal address of the system corresponding to the menu item
   */
  @property({ attribute: false })
  accessor url: LinkProps["url"] | undefined;

  /**
   * 菜单项对应的外部链接地址
   * @en External link address corresponding to the menu item
   */
  @property()
  accessor href: LinkProps["href"] | undefined;

  /**
   * 菜单项链接打开的目标
   * @en Target for opening the menu item link
   */
  @property()
  accessor target: LinkProps["target"] | undefined;

  /**
   * 菜单项的图标
   * @en Icon of the menu item
   */
  @property({ attribute: false })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 是否选中
   * @en Whether it is selected
   */
  @property({ type: Boolean })
  accessor selected: boolean | undefined;

  /**
   * 菜单整体是否收起状态
   * @en Whether the whole menu is collapsed
   */
  @property({ type: Boolean })
  accessor menuCollapsed: boolean | undefined;

  render() {
    return (
      <EoSidebarMenuItemComponent
        url={this.url}
        href={this.href}
        target={this.target}
        icon={this.icon}
        selected={this.selected}
      />
    );
  }
}

export function EoSidebarMenuItemComponent(props: EoSidebarMenuItemProps) {
  const { url, href, target, icon, selected } = props;

  return (
    <WrappedLink type="plain" url={url} href={href} target={target}>
      <div className={"menu-item"}>
        <span className="menu-item-icon-container">
          <WrappedIcon
            {...icon}
            className="menu-item-icon"
            {...(icon && "imgSrc" in icon
              ? { imgStyle: { filter: selected ? "brightness(7)" : undefined } }
              : {})}
          />
        </span>
        <span className="menu-item-text">
          <slot />
        </span>
      </div>
    </WrappedLink>
  );
}
