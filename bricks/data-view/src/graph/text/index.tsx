import React from "react";
import { ReactNextElement } from "@next-core/react-element";
import { createDecorators } from "@next-core/element";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./graph-text.shadow.css";
import { K, NS, locales } from "./i18n.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
initializeReactI18n(NS, locales);
const { defineElement, property } = createDecorators();
export interface GraphTextProps {
  text: string;
  value: string | number;
}

/**
 * Graph text
 * @author astrid
 */
@defineElement("data-view.graph-text", {
  styleTexts: [variablesStyleText, styleText],
})
class GraphText extends ReactNextElement implements GraphTextProps {
  /**
   * @kind string
   * @default -
   * @required true
   * @description 文本标题
   */
  @property()
  accessor text: string;

  /**
   * @kind string|number
   * @default -
   * @required  true
   * @description 文本值
   */
  @property()
  accessor value: string | number;

  render(): React.ReactNode {
    return <GraphTextComponent text={this.text} value={this.value} />;
  }
}

export function GraphTextComponent(props: GraphTextProps): React.ReactElement {
  const { t } = useTranslation(NS);
  return (
    <div className="content">
      <span className="text">{props.text}</span>
      <span className="symbol">{t(K.SYMBOL)}</span>
      <span className="value">{props.value}</span>
    </div>
  );
}

export { GraphText };
