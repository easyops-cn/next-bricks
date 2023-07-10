import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

interface LightsComponentTitleProps {
  componentTitle: string;
  theme: "light"|"dark";
}
/**
 * 构件 `data-view.lights-component-title`
 * @author astrid
 */

export
@defineElement("data-view.lights-component-title", {
  styleTexts: [styleText],
})
class LightsComponentTitle
  extends ReactNextElement
  implements LightsComponentTitleProps
{
  /**
   * 组件标题
   * @default -
   */
  @property()
  accessor componentTitle: string;
  /**
   * @default 
   * @required 
   * @description 
   */
  @property()
  accessor theme: "light"|"dark";
  render() {
    return (
      <LightsComponentTitleComponent componentTitle={this.componentTitle} theme={this.theme} />
    );
  }
}
export function LightsComponentTitleComponent(
  props: LightsComponentTitleProps
) {
  const {componentTitle, theme="light"} = props;
  return (
    <div className="wrapper">
      <div className={theme==="dark"?"darkContent":"lightContent"}>
        {theme==="light"&&<div className="lightIcon"></div>}
        {theme==="dark"&&<div className="darkIcon"></div>}
        <div className={theme==="dark"?"darkTitle":"lightTitle"}>{componentTitle}</div>
      </div>
    </div>
  );
}
