import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { getRuntime } from "@next-core/runtime";
import { getNewUIStatus } from "../utils.js";
interface PageTitleProps {
  pageTitle: string;
  pageTitleScale?: number;
  dashboardMode?: boolean;
}

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-page-title`
 */
export
@defineElement("eo-page-title", {
  styleTexts: [styleText],
})
class EoPageTitle extends ReactNextElement {
  /**
   * 页面标题
   */
  @property()
  accessor pageTitle: string | undefined;

  /**
   * 页面标题比例
   */
  @property()
  accessor pageTitleScale: number | undefined;

  /**
   * 是否以 dashboard 模式显示
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor dashboardMode: boolean | undefined;

  render() {
    return (
      <EoPageTitleComponent
        pageTitle={this.pageTitle ?? ""}
        pageTitleScale={this.pageTitleScale}
        dashboardMode={this.dashboardMode}
      />
    );
  }
}

export function EoPageTitleComponent(props: PageTitleProps) {
  const { pageTitle, pageTitleScale, dashboardMode } = props;
  getRuntime().applyPageTitle(pageTitle);
  const scale = (dashboardMode && pageTitleScale) || 1;
  const isShowNewUiMode = getNewUIStatus();
  const decoratorStyle =
    scale === 1
      ? {}
      : {
          backgroundSize: `${518 * scale}px ${45 * scale}px`,
        };

  return (
    <>
      {dashboardMode && (
        <span className="page-title-before" style={decoratorStyle}></span>
      )}
      <span
        className="page-title-content"
        style={{
          display: "block",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          ...(dashboardMode
            ? {
                fontSize: 38 * scale,
                height: "100%",
                ...(scale === 1
                  ? null
                  : {
                      backgroundSize: `100% ${45 * scale}px`,
                    }),
              }
            : {
                fontSize: isShowNewUiMode
                  ? "var(--title-font-size-larger)"
                  : "var(--page-title-font-size)",
                fontWeight: isShowNewUiMode
                  ? "normal"
                  : "var(--page-title-font-weight)",
                lineHeight: "32px",
              }),
        }}
      >
        {pageTitle}
      </span>
      {dashboardMode && (
        <span className="page-title-after" style={decoratorStyle}></span>
      )}
    </>
  );
}
