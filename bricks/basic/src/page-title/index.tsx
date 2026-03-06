import React, { useEffect } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { getRuntime } from "@next-core/runtime";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

export interface PageTitleProps {
  pageTitle: string;
}

const { defineElement, property } = createDecorators();

/**
 * 页面标题构件，设置后同时更新浏览器标签页标题，在 dashboard 模式下以更大字号（38px）显示
 *
 * @category text
 */
export
@defineElement("eo-page-title", {
  styleTexts: [styleText],
})
class EoPageTitle extends ReactNextElement {
  /**
   * 页面标题，设置后会同时更新浏览器页面标题。当页面处于 dashboard 模式时，标题以更大的字号（38px）显示。
   */
  @property()
  accessor pageTitle: string | undefined;

  render() {
    return <EoPageTitleComponent pageTitle={this.pageTitle ?? ""} />;
  }
}

export function EoPageTitleComponent({ pageTitle }: PageTitleProps) {
  const dashboardMode = document.documentElement.dataset.mode === "dashboard";

  useEffect(() => {
    getRuntime().applyPageTitle(pageTitle);
  }, [pageTitle]);

  return (
    <span className={dashboardMode ? "dashboard" : undefined}>{pageTitle}</span>
  );
}
