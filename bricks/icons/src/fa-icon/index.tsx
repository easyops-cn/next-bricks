import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapLocalBrick } from "@next-core/react-element";
import { hasOwnProperty } from "@next-core/utils/general";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type IconDefinition, config } from "@fortawesome/fontawesome-svg-core";
import {
  DefineLinearGradient,
  DefineLinearGradientProps,
  GradientDirection,
} from "../shared/DefineLinearGradient.js";
import styleText from "./generated/fa-icon.shadow.css";
import linearGradientStyleText from "../shared/DefineLinearGradient.shadow.css";

config.autoAddCss = false;

const iconCache = new Map<string, Promise<IconDefinition | null>>();

async function resolveIconDefinition(
  url: string
): Promise<IconDefinition | null> {
  try {
    return await (await fetch(url, { mode: "cors" })).json();
  } catch {
    return null;
  }
}

async function getIconDefinition(
  prefix: string,
  icon: string | undefined
): Promise<IconDefinition | null> {
  if (icon) {
    const alias = (await import("./generated/alias.json")).default;
    const actualIcon =
      hasOwnProperty(alias, prefix) &&
      hasOwnProperty((alias as Alias)[prefix], icon)
        ? (alias as Alias)[prefix][icon]
        : icon;
    const url = `${
      // istanbul ignore next
      process.env.NODE_ENV === "test" ? "" : __webpack_public_path__
    }chunks/fa-icons/${prefix}/${actualIcon}.json`;
    let iconResolver = iconCache.get(url);
    if (!iconResolver) {
      iconResolver = resolveIconDefinition(url);
      iconCache.set(url, iconResolver);
    }
    return await iconResolver;
  } else {
    return null;
  }
}

const { defineElement, property } = createDecorators();

export interface FaIconProps extends DefineLinearGradientProps {
  /** Defaults to "fas" */
  prefix?: string;
  icon?: string;
  spin?: boolean;
}

export
@defineElement("icons.fa-icon", {
  styleTexts: [styleText, linearGradientStyleText],
})
class FaIcon extends ReactNextElement implements FaIconProps {
  // Note: `prefix` is a native prop on Element, but it's only used in XML documents.
  /**
   * 图标前缀
   * @default "fas"
   */
  @property() accessor prefix!: string;

  /** 图标名 */
  @property() accessor icon: string | undefined;

  /** 是否自动旋转 */
  @property({ type: Boolean }) accessor spin: boolean | undefined;

  /** 渐变色起始颜色 */
  @property() accessor startColor: string | undefined;

  /** 渐变色终止颜色 */
  @property() accessor endColor: string | undefined;

  /** 渐变色方向 */
  @property() accessor gradientDirection: GradientDirection | undefined;

  render() {
    return (
      <FaIconComponent
        prefix={this.prefix}
        icon={this.icon}
        spin={this.spin}
        startColor={this.startColor}
        endColor={this.endColor}
        gradientDirection={this.gradientDirection}
      />
    );
  }
}

function FaIconComponent({
  prefix: _prefix,
  icon,
  spin,
  startColor,
  endColor,
  gradientDirection,
}: FaIconProps) {
  const prefix = _prefix ?? "fas";
  const [iconDefinition, setIconDefinition] = useState<IconDefinition | null>(
    null
  );

  useEffect(() => {
    let ignore = false;
    getIconDefinition(prefix, icon).then((result) => {
      if (!ignore) {
        if (!result && icon) {
          // eslint-disable-next-line no-console
          console.error("FontAwesome Icon not found:", prefix, icon);
        }
        setIconDefinition(result);
      }
    });
    return () => {
      ignore = true;
    };
  }, [icon, prefix]);

  if (!iconDefinition) {
    return null;
  }

  return (
    <>
      <FontAwesomeIcon icon={iconDefinition} spin={spin} />
      <DefineLinearGradient
        startColor={startColor}
        endColor={endColor}
        gradientDirection={gradientDirection}
      />
    </>
  );
}

interface Alias {
  [category: string]: {
    [icon: string]: string;
  };
}

export const WrappedFaIcon = wrapLocalBrick<FaIcon, FaIconProps>(FaIcon);
