import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface AppBarWrapperProps {
  isFixed?: boolean;
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
  /** 固定定位
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor isFixed: boolean | undefined;

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
        extraAppBarContentStyle={this.extraAppBarContentStyle}
      />
    );
  }
}

export function EoAppBarWrapperComponent({
  isFixed = true,
  displayCenter = false,
  extraAppBarContentStyle = {},
}: AppBarWrapperProps) {
  // TODO: when AppBarTips rendered, setAppbarHeight should be used to set
  const [appbarHeight, setAppbarHeight] = React.useState<string>(
    `var(--app-bar-height)`
  );

  React.useEffect(() => {
    const mainElement = document.getElementById("main-mount-point");
    const iframeMainElement = document.getElementById(
      "legacy-iframe-mount-point"
    );
    mainElement && (mainElement.style.marginTop = "");
    iframeMainElement && (iframeMainElement.style.marginTop = "");
  }, []);

  return (
    <div
      className="app-bar-container"
      style={{
        height: appbarHeight,
      }}
    >
      <div
        className="app-bar"
        style={{
          position: isFixed ? "fixed" : "absolute",
        }}
      >
        {/* TODO: need AppBarTips */}
        <div
          className="app-bar-content"
          style={{
            justifyContent: displayCenter ? "space-around" : "space-between",
            ...extraAppBarContentStyle,
          }}
        >
          <div className="leftContainer">
            <slot name="left"></slot>
          </div>
          <div className="rightContainer">
            <slot name="right"></slot>
          </div>
        </div>
      </div>
    </div>
  );
}
