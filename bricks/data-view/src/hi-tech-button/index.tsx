import React, { useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./styles.shadow.css";
import SVGFile from "./component.js";
import variablesStyleText from "../data-view-variables.shadow.css";

export type buttonType =
  | "default"
  | "parallelogram"
  | "stereoscopic"
  | "shading"
  | "round";

export interface HiTechButtonProps {
  type?: buttonType;
  disabled?: boolean;
  buttonStyle?: React.CSSProperties;
}

const { defineElement, property } = createDecorators();

/**
 * 大屏按钮
 * @author jiezhou
 * @slot - 按钮内容
 */
@defineElement("data-view.hi-tech-button", {
  styleTexts: [variablesStyleText, styleText],
})
class HiTechButton extends ReactNextElement implements HiTechButtonProps {
  /** 按钮类型 */
  @property() accessor type: buttonType | undefined;

  /**
   * 按钮样式
   * @group other
   */
  @property({ attribute: false }) accessor buttonStyle:
    | React.CSSProperties
    | undefined;

  /**
   * 是否禁用
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor disabled: boolean | undefined;

  render() {
    return (
      <HiTechButtonComponent
        type={this.type}
        buttonStyle={this.buttonStyle}
        disabled={this.disabled}
      />
    );
  }
}

export function HiTechButtonComponent({
  type = "default",
  buttonStyle,
  disabled,
}: HiTechButtonProps) {
  const button = useMemo(
    () => (
      <button
        disabled={disabled}
        className={`buttonWrapper ${type}`}
        style={buttonStyle}
      >
        {type === "default" && SVGFile.normalButtonSvg()}
        {type === "parallelogram" && SVGFile.parallelogramButtonSvg()}
        {type === "stereoscopic" && SVGFile.stereoscopicButtonSvg()}
        {type === "shading" && SVGFile.shadingButtonSvg()}
        {type === "round" && SVGFile.roundButtonSvg()}
        <div className="button-container">
          <slot />
        </div>
      </button>
    ),
    [type]
  );

  return button;
}

export { HiTechButton };
