import React, { CSSProperties, useState, useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classnames from "classnames";

type OrientationType = "left" | "center" | "right";
type dividerType = "horizontal" | "vertical" | "radiation";
export interface EoDividerProps {
  orientation?: OrientationType;
  dashed?: boolean;
  type?: dividerType;
  proportion?: [number, number];
  dividerStyle?: CSSProperties;
}
const { defineElement, property } = createDecorators();

/**
 * 分割线
 * @author zhendonghuang
 * @category container-display
 */
export
@defineElement("eo-divider", {
  styleTexts: [styleText],
})
class EoDivider extends ReactNextElement {
  /**
   * 标题位置，在horizontal类型的分割线中使用
   * @default center
   */
  @property({
    attribute: false,
  })
  accessor orientation: OrientationType | undefined;

  /**
   * 是否虚线
   * @default false
   */
  @property({
    type: Boolean,
  })
  accessor dashed: boolean | undefined;

  /**
   * 水平|垂直|放射类型,注意radiation是个特殊的类型，该样式是特定的
   * @default "horizontal"
   */
  @property()
  accessor type: dividerType | undefined;

  /**
   * 当用于数值显示的情况，eg: 如果要展示"1/3"，那么传入就是[1,3], 该字段只适配于 type 为 radiation
   */
  @property({
    attribute: false,
  })
  accessor proportion: [number, number] | undefined;

  /**
   * 分割线自定义样式
   */
  @property({
    attribute: false,
  })
  accessor dividerStyle: CSSProperties | undefined;

  render() {
    return (
      <EoDividerComponent
        orientation={this.orientation}
        dashed={this.dashed}
        type={this.type}
        proportion={this.proportion}
        dividerStyle={this.dividerStyle}
      />
    );
  }
}

export function EoDividerComponent(props: EoDividerProps) {
  const {
    orientation = "center",
    dashed,
    type = "horizontal",
    proportion,
    dividerStyle = {},
  } = props;

  const slotRef = useRef<HTMLSlotElement>(null);
  const [hasDefaultSlot, setHasDefaultSlot] = useState<boolean>();
  const handleSlotChange = () => {
    setHasDefaultSlot(slotRef.current?.assignedNodes().length > 0);
  };

  const renderProportion = (): React.ReactNode => {
    return (
      <span className="proportionText">
        <strong>{proportion[0]}</strong>
        {proportion[1] && `/${proportion[1]}`}
      </span>
    );
  };

  useEffect(() => {
    const defaultSlot = slotRef.current;
    defaultSlot?.addEventListener("slotchange", handleSlotChange);
    return () => {
      defaultSlot?.removeEventListener("slotchange", handleSlotChange);
    };
  }, []);
  return (
    <div
      className={classnames(
        "dividerContent",
        orientation,
        { dashed, hasDefaultSlot },
        type
      )}
      style={dividerStyle}
    >
      {<slot ref={slotRef}></slot>}
      {type === "radiation" && proportion && renderProportion()}
    </div>
  );
}
