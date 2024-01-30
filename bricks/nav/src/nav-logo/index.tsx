import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { wrapBrick, ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { getRuntime } from "@next-core/runtime";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "@next-bricks/basic/link";

const { defineElement } = createDecorators();

export const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
export const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

/**
 * 导航栏图标
 */
export
@defineElement("nav.nav-logo", {
  styleTexts: [styleText],
})
class NavLogo extends ReactNextElement {
  render() {
    return <NavLogoComponent />;
  }
}

export function NavLogoComponent() {
  const brand = getRuntime().getBrandSettings();

  const logoNode = useMemo(() => {
    return brand.menu_bar_logo_url ? (
      <img src={brand.menu_bar_logo_url} className="personalized-logo" />
    ) : (
      <WrappedIcon
        category="blueprint"
        icon="easyops"
        lib="easyops"
        className="easyops-icon"
      />
    );
  }, [brand.menu_bar_logo_url]);

  return (
    <div className="logo-container">
      {brand.menu_bar_logo_no_link === "true" ? (
        logoNode
      ) : (
        <WrappedLink type="plain" url="/" className="logo-link">
          {logoNode}
        </WrappedLink>
      )}
    </div>
  );
}
