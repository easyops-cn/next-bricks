import React from "react";
import { ReactNextElement } from "@next-core/react-element";
import { createDecorators } from "@next-core/element";
import baseImg from "../../asset/images/base.png";
import variablesStyleText from "../../data-view-variables.shadow.css";
import styleText from "./graph-node.shadow.css";

const { defineElement, property } = createDecorators();

export interface GraphNodeProps {
  url: string;
}

/**
 * Graph Node
 * @author astrid
 */
@defineElement("data-view.graph-node", {
  styleTexts: [variablesStyleText, styleText],
})
class GraphNode extends ReactNextElement implements GraphNodeProps {
  //
  /**
   * @kind string
   * @default -
   * @required true
   * @description 图片路径
   */
  @property()
  accessor url: string;

  render(): React.ReactNode {
    return <GraphNodeComponent url={this.url} />;
  }
}

export function GraphNodeComponent(props: GraphNodeProps): React.ReactElement {
  return (
    <div className="wrapper">
      <div className="node">
        <img src={props.url} alt="node-image" />
      </div>
      <img src={baseImg} alt="base-image" />
    </div>
  );
}

export { GraphNode };
