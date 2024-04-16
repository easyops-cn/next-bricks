import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import moment from "moment";
import { GeneralIcon, GeneralIconProps } from "@next-bricks/icons/general-icon";

export interface CurrentTimeProps {
  format: string;
  icon?: GeneralIconProps;
}

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const { defineElement, property } = createDecorators();

/**
 * 构件 `eo-current-time`
 */
export
@defineElement("eo-current-time", {
  styleTexts: [styleText],
})
class EoCurrentTime extends ReactNextElement {
  /**
   * 时间格式
   */
  @property()
  accessor format: string = "YYYY-MM-DD HH:mm:ss";

  /**
   * 前置图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  render() {
    return <EoCurrentTimeComponent format={this.format} icon={this.icon} />;
  }
}

export function EoCurrentTimeComponent({ format, icon }: CurrentTimeProps) {
  const [timer, setTimer] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setRefresh((r) => r + 1);
      setTimer(moment(Date.now()).format(format));
    }, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [refresh]);

  return (
    <div className="container">
      {icon && timer ? (
        <WrappedIcon {...(icon as GeneralIconProps)} className="front-icon" />
      ) : null}
      <span>{timer}</span>
    </div>
  );
}
