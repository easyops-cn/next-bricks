import React, { useCallback, useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { Tooltip } from "antd";

const { defineElement, property } = createDecorators();

/**
 * 超出宽度鼠标悬浮显示tooltip
 * 构件 `eo-text-tooltip`
 */
export
@defineElement("eo-text-tooltip", {
  styleTexts: [styleText],
})
class EoTextTooltip extends ReactNextElement {
  /**
   * 文案
   * @default
   */
  @property({ type: String })
  accessor label: string | undefined;

  /**
   * 省略行数
   * @default 1
   */
  @property({ type: Number })
  accessor lineClamp: number = 1;

  render() {
    return (
      <EoTextTooltipComponent label={this.label} lineClamp={this.lineClamp} />
    );
  }
}

interface TooltipPropsEoTextTooltipProps {
  label?: string;
  lineClamp?: number;
}

export function EoTextTooltipComponent(props: TooltipPropsEoTextTooltipProps) {
  const { lineClamp, label } = props;
  const ref = useRef<HTMLDivElement>(null);
  // 是否显示tooltip
  const [show, setShow] = useState(false);
  // 判断是否需要显示省略号
  const isEllipsis = useCallback(() => {
    const parentDom = ref.current;
    /* istanbul ignore if */
    if (!parentDom) return false;
    const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } = parentDom;
    return offsetWidth < scrollWidth || offsetHeight < scrollHeight;
  }, [lineClamp, label]);
  useEffect(() => {
    setShow(isEllipsis());
  }, [isEllipsis]);
  return (
    <Tooltip title={show ? label : null}>
      <div
        ref={ref}
        className="ellipsisWrap"
        style={
          {
            "--line-clamp": lineClamp,
          } as React.CSSProperties
        }
      >
        {label}
      </div>
    </Tooltip>
  );
}
