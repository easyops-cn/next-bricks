import React, { useEffect } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface ViewportProps {
  width?: string;
  initialScale?: number;
}

/**
 * 设置 `<meta name="viewport" />` 以适配移动端。
 */
export
@defineElement("eo-viewport", {
  styleTexts: [styleText],
})
class Viewport extends ReactNextElement implements ViewportProps {
  /**
   * @default "device-width"
   */
  @property()
  accessor width: string | undefined;

  /**
   * @default 1
   */
  @property({ type: Number })
  accessor initialScale: number | undefined;

  render() {
    return (
      <ViewportComponent width={this.width} initialScale={this.initialScale} />
    );
  }
}

export function ViewportComponent({
  width: _width,
  initialScale: _initialScale,
}: ViewportProps) {
  const width = _width ?? "device-width";
  const initialScale = _initialScale ?? 1;

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content = `width=${width}, initial-scale=${initialScale}`;
    document.head.appendChild(meta);
    return () => {
      meta.remove();
    };
  }, [initialScale, width]);

  return null;
}
