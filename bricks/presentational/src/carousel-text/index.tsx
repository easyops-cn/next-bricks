import React, { CSSProperties, useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import ResizeObserver from "resize-observer-polyfill";
import styleText from "./styles.shadow.css";
import { useState } from "react";

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-carousel-text`
 */
export
@defineElement("eo-carousel-text", {
  styleTexts: [styleText],
})
class EoCarouselText extends ReactNextElement {
  /**
   * 展示内容
   */
  @property()
  accessor text: string = "";

  /**
   * 容器宽度
   * @default "100%"
   */
  @property()
  accessor containerWidth: CSSProperties["width"];

  /**
   * 字体大小
   * @default "var(--normal-font-size)"
   */
  @property()
  accessor fontSize: CSSProperties["fontSize"];

  /**
   * 字体颜色
   * @default "var(--text-color-default)"
   */
  @property()
  accessor fontColor: CSSProperties["color"];

  /**
   * 移动速度，单位 px/s
   * @default 100
   */
  @property()
  accessor speed: number;

  render() {
    return (
      <EoCarouselTextComponent
        text={this.text}
        speed={this.speed}
        fontColor={this.fontColor}
        fontSize={this.fontSize}
        containerWidth={this.containerWidth}
      />
    );
  }
}

export interface EoCarouselTextProps {
  text: string;
  speed?: number;
  fontColor: CSSProperties["color"];
  fontSize: CSSProperties["fontSize"];
  containerWidth: CSSProperties["width"];
}

export function EoCarouselTextComponent({
  text,
  fontColor,
  fontSize,
  containerWidth,
  speed: _speed,
}: EoCarouselTextProps) {
  const speed = _speed ?? 100;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const scroll = scrollRef.current;

    if (!container || !scroll) {
      return;
    }
    const observer = new ResizeObserver(() => {
      setStart(container.offsetWidth);
      setEnd(-scroll.offsetWidth);
    });

    observer.observe(container);
    observer.observe(scroll);

    return () => {
      observer.disconnect();
    };
  }, []);

  const ready = start && end;

  return (
    <div
      className={`container${ready ? " ready" : ""}`}
      style={
        {
          width: containerWidth,
          ...(ready
            ? {
                "--transform-start": `translateX(${start}px)`,
                "--transform-end": `translateX(${end}px)`,
                "--transform-duration": `${Math.abs(end - start) / speed}s`,
              }
            : null),
        } as any
      }
      ref={containerRef}
    >
      <div
        className="scroll"
        style={{
          color: fontColor,
          fontSize: fontSize,
        }}
        ref={scrollRef}
      >
        {text}
      </div>
    </div>
  );
}
