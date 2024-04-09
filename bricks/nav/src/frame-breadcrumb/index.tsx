import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { useCurrentApp, useNavConfig } from "@next-core/react-runtime";
import { BreadcrumbItemConf } from "@next-core/types";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type { EoBreadcrumb } from "@next-bricks/basic/breadcrumb";
import type {
  EoBreadcrumbItem,
  BreadcrumbItemProps,
} from "@next-bricks/basic/breadcrumb-item";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { ExtendedLocationDescriptor } from "@next-bricks/basic/link";

const { defineElement, property } = createDecorators();

const WrappedBreadcrumb = wrapBrick<EoBreadcrumb, unknown>("eo-breadcrumb");
const WrappedBreadcrumbItem = wrapBrick<EoBreadcrumbItem, BreadcrumbItemProps>(
  "eo-breadcrumb-item"
);
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface Menu {
  title: string;
  icon?: GeneralIconProps;
  link?: ExtendedLocationDescriptor;
}

export interface EoFrameBreadcrumbProps {
  breadcrumb?: BreadcrumbItemConf[];
  noCurrentApp?: boolean;
  menu?: Menu;
}

/**
 * 面包屑
 */
export
@defineElement("eo-frame-breadcrumb", {
  styleTexts: [styleText],
})
class EoFrameBreadcrumb
  extends ReactNextElement
  implements EoFrameBreadcrumbProps
{
  /**
   * 面包屑配置
   */
  @property({
    attribute: false,
  })
  accessor breadcrumb: BreadcrumbItemConf[] | undefined;

  /**
   * 是否隐藏当前应用名称
   */
  @property({ type: Boolean })
  accessor noCurrentApp: boolean | undefined;

  /**
   * 菜单配置
   */
  @property({
    attribute: false,
  })
  accessor menu: Menu | undefined;

  render() {
    return (
      <EoFrameBreadcrumbComponent
        breadcrumb={this.breadcrumb}
        noCurrentApp={this.noCurrentApp}
        menu={this.menu}
      />
    );
  }
}

export function EoFrameBreadcrumbComponent(props: EoFrameBreadcrumbProps) {
  const { menu } = props;

  const navConfig = useNavConfig();
  const currentApp = useCurrentApp();
  const curAppBreadcrumb = currentApp?.breadcrumb;

  const currentAppBreadcrumbItems = curAppBreadcrumb?.items as Array<
    BreadcrumbItemConf & { icon: GeneralIconProps }
  >;
  const breadcrumbItems = props.breadcrumb?.length
    ? props.breadcrumb
    : navConfig?.breadcrumb;

  const noCurrentApp = props.noCurrentApp ?? curAppBreadcrumb?.noCurrentApp;
  const useCurrentMenuTitle = curAppBreadcrumb?.useCurrentMenuTitle;

  return (
    <WrappedBreadcrumb>
      <span slot="separator">/</span>
      {currentAppBreadcrumbItems?.map((item, index) => {
        return (
          <WrappedBreadcrumbItem key={index} url={item.to}>
            {item.icon ? (
              <WrappedIcon
                className="breadcrumb-item-prefix-icon"
                slot="prefix"
                {...item.icon}
              />
            ) : (
              index === 0 && (
                <WrappedIcon
                  className="breadcrumb-item-prefix-icon"
                  slot="prefix"
                  lib="antd"
                  icon="home"
                  theme="outlined"
                />
              )
            )}
            {item.text}
          </WrappedBreadcrumbItem>
        );
      })}
      {currentApp && !noCurrentApp ? (
        <WrappedBreadcrumbItem
          url={
            breadcrumbItems?.length &&
            currentApp.homepage &&
            !currentApp.internal
              ? currentApp.homepage
              : undefined
          }
        >
          {!currentAppBreadcrumbItems?.length && (
            <WrappedIcon
              {...currentApp.menuIcon}
              slot="prefix"
              className="breadcrumb-item-prefix-icon"
            />
          )}
          {currentApp.localeName}
        </WrappedBreadcrumbItem>
      ) : null}
      {useCurrentMenuTitle && menu ? (
        <WrappedBreadcrumbItem url={menu.link}>
          {menu.icon && (
            <WrappedIcon
              {...menu.icon}
              className="breadcrumb-item-prefix-icon"
              slot="prefix"
            />
          )}
          {menu.title}
        </WrappedBreadcrumbItem>
      ) : null}
      {breadcrumbItems?.map((item, index) => (
        <WrappedBreadcrumbItem key={index} url={item.to}>
          {item.text}
        </WrappedBreadcrumbItem>
      ))}
    </WrappedBreadcrumb>
  );
}
