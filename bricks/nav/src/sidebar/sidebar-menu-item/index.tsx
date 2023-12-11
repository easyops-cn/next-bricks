import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "@next-bricks/basic/link";
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
 * 侧栏菜单项
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
   */
  @property({ attribute: false })
  accessor url: LinkProps["url"] | undefined;

  /**
   * 菜单项对应的外部链接地址
   */
  @property()
  accessor href: LinkProps["href"] | undefined;

  /**
   * 菜单项链接打开的目标
   */
  @property()
  accessor target: LinkProps["target"] | undefined;

  /**
   * 菜单项的图标
   */
  @property({ attribute: false })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 是否选中
   */
  @property({ type: Boolean })
  accessor selected: boolean | undefined;

  /**
   * 菜单整体是否收起状态
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
