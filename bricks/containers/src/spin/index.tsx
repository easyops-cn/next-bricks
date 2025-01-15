import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

interface EoSpinProps {
  size: "small" | "default" | "large";
  tip?: string;
  spinning?: boolean;
}

/**
 * 加载中
 *
 * @author nlicro
 * @slot - 容器内容
 * @category container-display
 */
export
@defineElement("eo-spin", {
  styleTexts: [styleText],
})
class EoSpin extends ReactNextElement implements EoSpinProps {
  /**
   * 加载指示符大小
   */
  @property()
  accessor size: "small" | "default" | "large" = "default";

  /**
   * 自定义描述文案
   */
  @property()
  accessor tip: string | undefined;

  /**
   * 是否为加载中状态
   */
  @property({
    type: Boolean,
  })
  accessor spinning: boolean | undefined;

  render() {
    return (
      <EoSpinComponent
        size={this.size}
        tip={this.tip}
        spinning={this.spinning}
      />
    );
  }
}

export function EoSpinComponent(props: EoSpinProps) {
  const { tip, spinning } = props;

  return (
    <div className="spin-wrapper">
      <div className="spin-container">
        <slot />
      </div>
      {spinning && (
        <div className="spin-item">
          <div className="spin-dot">
            <div className="spin-dot-item" />
            <div className="spin-dot-item" />
            <div className="spin-dot-item" />
            <div className="spin-dot-item" />
            <div className="spin-dot-item" />
          </div>
          <div className="spin-tip">{tip}</div>
        </div>
      )}
    </div>
  );
}
