import React, { CSSProperties } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./flex-layout.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * flex 布局容器
 * @en Flex layout container
 * @author sailor
 * @category container-layout
 * @slot - flex 容器内的子元素
 * @slotEn - The child elements inside the flex container
 */
@defineElement("eo-flex-layout", {
  styleTexts: [styleText],
  alias: ["containers.flex-layout"],
})
class FlexLayout extends ReactNextElement {
  /**
   * 定义 [flex-direction](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-direction)
   * @en Defines [flex-direction](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex-direction)
   */
  @property()
  accessor flexDirection: CSSProperties["flexDirection"] | undefined;

  /**
   * 定义 [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content)
   * @en Defines [justify-content](https://developer.mozilla.org/zh-CN/docs/Web/CSS/justify-content)
   */
  @property()
  accessor justifyContent: CSSProperties["justifyContent"] | undefined;

  /**
   * 定义 [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)
   * @en Defines [align-items](https://developer.mozilla.org/en-US/docs/Web/CSS/align-items)
   */
  @property() accessor alignItems: CSSProperties["alignItems"] | undefined;

  /**
   * 定义 [align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)
   * @en Defines [align-content](https://developer.mozilla.org/en-US/docs/Web/CSS/align-content)
   */
  @property() accessor alignContent: CSSProperties["alignContent"] | undefined;

  /**
   * 定义 [flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)
   * @en Defines [flex-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-wrap)
   */
  @property() accessor flexWrap: CSSProperties["flexWrap"] | undefined;

  /**
   * 定义 [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
   * @en Defines [gap](https://developer.mozilla.org/en-US/docs/Web/CSS/gap)
   */
  @property() accessor gap: string | undefined;

  render() {
    const flexProps: CSSProperties = {
      flexDirection: this.flexDirection,
      justifyContent: this.justifyContent,
      alignItems: this.alignItems,
      alignContent: this.alignContent,
      flexWrap: this.flexWrap,
      gap: this.gap,
    };

    Object.entries(flexProps).forEach(([key, value]) => {
      if (value != null) {
        this.style[key as "flexDirection"] = value;
      }
    });

    return <slot />;
  }
}

export { FlexLayout };
