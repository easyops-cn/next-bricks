import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { AntdIconProps, WrappedAntdIcon } from "../antd-icon/index.js";
import { EasyOpsIconProps, WrappedEasyOpsIcon } from "../easyops-icon/index.js";
import { FaIconProps, WrappedFaIcon } from "../fa-icon/index.js";
import type { DefineLinearGradientProps, GradientDirection } from "../shared/DefineLinearGradient.js";

const { defineElement, property } = createDecorators();

export interface GeneralIconPropsOfAntd extends AntdIconProps {
  lib: "antd";
}

export interface GeneralIconPropsOfEasyOps extends EasyOpsIconProps {
  lib: "easyops";
}

export interface GeneralIconPropsOfFa extends FaIconProps {
  lib: "fa";
}

export type GeneralIconProps =
  | GeneralIconPropsOfAntd
  | GeneralIconPropsOfEasyOps
  | GeneralIconPropsOfFa;

export interface GeneralIconEvents {
  "icon.click": CustomEvent<{ icon: string }>;
}

@defineElement("icons.general-icon")
class GeneralIcon extends ReactNextElement implements DefineLinearGradientProps {
  @property() accessor lib: "antd" | "easyops" | "fa" | undefined;
  @property() accessor theme: string | undefined;
  @property() accessor icon: string | undefined;
  @property() accessor category: string | undefined;
  // Note: `prefix` is a native prop on Element, but it's only used in XML documents.
  @property() accessor prefix!: string;
  @property() accessor startColor: string | undefined;
  @property() accessor endColor: string | undefined;
  @property() accessor gradientDirection: GradientDirection | undefined;

  render() {
    const commonProps = {
      icon: this.icon,
      startColor: this.startColor,
      endColor: this.endColor,
      gradientDirection: this.gradientDirection,
    };
    return this.lib === "antd" ? (
      <WrappedAntdIcon theme={this.theme} {...commonProps} />
    ) : this.lib === "easyops" ? (
      // `easyops-icon`s don't support setting gradient color, since we use a
      // single svg path with fill to render the gradient color under the hood,
      // while `easyops-icon`s are using other svg elements.
      <WrappedEasyOpsIcon category={this.category} icon={this.icon} />
    ) : this.lib === "fa" ? (
      <WrappedFaIcon prefix={this.prefix} {...commonProps} />
    ) : null;
  }
}

// Prettier reports error if place `export` before decorators.
// https://github.com/prettier/prettier/issues/14240
export { GeneralIcon };
