import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import classNames from "classnames";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface AppBarWrapperProps {
  isFixed?: boolean;
  position?: "static" | "fixed";
  displayCenter?: boolean;
  extraAppBarContentStyle?: React.CSSProperties;
}

/**
 * 应用顶部容器
 * @slot left - 左侧内容区
 * @slot right - 右侧内容区
 */
export
@defineElement("eo-app-bar-wrapper", {
  styleTexts: [styleText],
  alias: ["basic.app-bar-wrapper"],
})
class EoAppBarWrapper extends ReactNextElement implements AppBarWrapperProps {
  /**
   * 是否固定定位。
   *
   * @default true
   * @deprecated 使用 `position` 属性代替
   */
  @property({
    type: Boolean,
  })
  accessor isFixed: boolean | undefined;

  /**
   * 设置定位方式：静态定位或固定定位。
   *
   * 设置时优先级高于 `isFixed`。
   *
   * @default "fixed"
   */
  @property()
  accessor position: "static" | "fixed" | undefined;

  /**
   * 居中显示
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor displayCenter: boolean | undefined;

  /** 自定义样式 */
  @property({
    attribute: false,
  })
  accessor extraAppBarContentStyle: React.CSSProperties | undefined;

  render() {
    return (
      <EoAppBarWrapperComponent
        displayCenter={this.displayCenter}
        isFixed={this.isFixed}
        position={this.position}
        extraAppBarContentStyle={this.extraAppBarContentStyle}
      />
    );
  }
}

export function EoAppBarWrapperComponent({
  isFixed = true,
  position,
  displayCenter = false,
  extraAppBarContentStyle = {},
}: AppBarWrapperProps) {
  React.useEffect(() => {
    const mainElement = document.getElementById("main-mount-point");
    const iframeMainElement = document.getElementById(
      "legacy-iframe-mount-point"
    );
    mainElement && (mainElement.style.marginTop = "");
    iframeMainElement && (iframeMainElement.style.marginTop = "");
  }, []);

  return (
    <div className="app-bar-container">
      <div
        className={classNames(
          "app-bar",
          position === "static"
            ? "static"
            : position === "fixed" || isFixed
            ? "fixed"
            : "absolute"
        )}
      >
        {/* TODO: need AppBarTips */}
        <div
          className="app-bar-content"
          style={{
            justifyContent: displayCenter ? "space-around" : "space-between",
            ...extraAppBarContentStyle,
          }}
        >
          <div className="left">
            <slot name="left" />
          </div>
          <div className="right">
            <slot name="right" />
          </div>
        </div>
      </div>
    </div>
  );
}
