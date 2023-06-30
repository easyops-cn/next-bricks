import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import styleText from "./styles.shadow.css";
import variablesStyleText from "../data-view-variables.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

const { defineElement, property } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

/**
 * 大屏提示构件
 * @author astrid
 */
interface BrickNotificationProps {
  message: string;
  icon?: GeneralIconProps | undefined;
}
@defineElement("data-view.brick-notification", {
  styleTexts: [variablesStyleText, styleText],
})
class BrickNotification
  extends ReactNextElement
  implements BrickNotificationProps
{
  /**
   * 提示内容
   * @default -
   */
  @property()
  accessor message: string;
  /**
   * 图标
   * @default -
   */
  @property({ attribute: false })
  accessor icon: GeneralIconProps | undefined;

  render() {
    return (
      <BrickNotificationComponent message={this.message} icon={this.icon} />
    );
  }
}
export function BrickNotificationComponent(props: BrickNotificationProps) {
  return (
    <div className="container">
      <WrappedIcon
        className="icon"
        {...(!props.icon ? { lib: "fa", icon: "volume-down" } : props.icon)}
      />
      <span className="message">{props.message}</span>
    </div>
  );
}

export { BrickNotification };
