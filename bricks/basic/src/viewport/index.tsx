import React, { useEffect } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface ViewportProps {
  width?: string;
  initialScale?: number;
  minimumScale?: number;
  maximumScale?: number;
  userScalable?: string;
}

/**
 * 设置 `<meta name="viewport" />` 以适配移动端。
 *
 * @category layout
 */
export
@defineElement("eo-viewport", {
  styleTexts: [styleText],
})
class EoViewport extends ReactNextElement implements ViewportProps {
  /**
   * 视口宽度
   * @default "device-width"
   */
  @property()
  accessor width: string | undefined;

  /**
   * 初始缩放比例
   * @default 1
   */
  @property({ type: Number })
  accessor initialScale: number | undefined;

  /**
   * 最小缩放比例
   * @default 0.1
   */
  @property({ type: Number })
  accessor minimumScale: number | undefined;

  /**
   * 最大缩放比例
   * @default 10
   */
  @property({ type: Number })
  accessor maximumScale: number | undefined;

  /**
   * 是否允许用户缩放
   * @default "1"
   */
  @property()
  accessor userScalable: string | undefined;

  render() {
    return (
      <ViewportComponent
        width={this.width}
        initialScale={this.initialScale}
        minimumScale={this.minimumScale}
        maximumScale={this.maximumScale}
        userScalable={this.userScalable}
      />
    );
  }
}

export function ViewportComponent({
  width: _width,
  initialScale: _initialScale,
  minimumScale: _minimumScale,
  maximumScale: _maximumScale,
  userScalable: _userScalable,
}: ViewportProps) {
  const width = _width ?? "device-width";
  const initialScale = _initialScale ?? 1;
  const minimumScale = _minimumScale ?? 0.1;
  const maximumScale = _maximumScale ?? 10;
  const userScalable = _userScalable ?? "1";

  useEffect(() => {
    const existedMeta = document.querySelector(
      'meta[name="viewport"]'
    ) as HTMLMetaElement;
    if (existedMeta) {
      // Ignore if the meta tag already exists
      return;
    }

    const meta = document.createElement("meta");
    meta.name = "viewport";
    const viewportSettings = [
      `width=${width}`,
      `initial-scale=${initialScale}`,
      `minimum-scale=${minimumScale}`,
      `maximum-scale=${maximumScale}`,
      `user-scalable=${userScalable}`,
    ];
    meta.content = viewportSettings.join(", ");
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, [initialScale, maximumScale, minimumScale, userScalable, width]);

  return null;
}
