import React, { Suspense, lazy } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapLocalBrick } from "@next-core/react-element";
import { DefineLinearGradient, DefineLinearGradientProps, GradientDirection } from "../shared/DefineLinearGradient.js";
import linearGradientStyleText from "../shared/DefineLinearGradient.shadow.css";

const { defineElement, property } = createDecorators();

export interface AntdIconProps extends DefineLinearGradientProps {
  /** Defaults to "outlined" */
  theme?: string;
  icon?: string;
}

@defineElement("icons.antd-icon", {
  styleTexts: [linearGradientStyleText]
})
class AntdIcon extends ReactNextElement implements AntdIconProps {
  @property() accessor theme: string | undefined;
  @property() accessor icon: string | undefined;
  @property() accessor startColor: string | undefined;
  @property() accessor endColor: string | undefined;
  @property() accessor gradientDirection: GradientDirection | undefined;

  render() {
    return <AntdIconComponent theme={this.theme} icon={this.icon} startColor={this.startColor} endColor={this.endColor} gradientDirection={this.gradientDirection} />;
  }
}

function AntdIconComponent({ theme: _theme, icon, startColor, endColor, gradientDirection }: AntdIconProps) {
  const theme = _theme ?? "outlined";

  if (!icon) {
    return null;
  }

  const Icon = lazy(
    () =>
      import(
        /* webpackChunkName: "antd-icons/" */
        `./generated/${theme}/${icon}.svg`
      )
  );

  return (
    <Suspense>
      <Icon />
      <DefineLinearGradient startColor={startColor} endColor={endColor} gradientDirection={gradientDirection} />
    </Suspense>
  );
}

export const WrappedAntdIcon = wrapLocalBrick<AntdIcon, AntdIconProps>(
  AntdIcon
);

// Prettier reports error if place `export` before decorators.
// https://github.com/prettier/prettier/issues/14240
export { AntdIcon };
