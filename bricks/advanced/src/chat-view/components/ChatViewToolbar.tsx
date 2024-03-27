import React from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import { getHistory } from "@next-core/runtime";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedToolTip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

export function ChatViewToolbar(): React.ReactNode {
  const handleJump = () => {
    const history = getHistory();
    history.push("/ai-center");
  };

  return (
    <div className="chat-view-toolbar">
      <div className="username">AI助手</div>
      <div className="toolbar">
        <WrappedToolTip content="跳转至 AI-Center">
          <WrappedIcon lib="fa" icon="external-link-alt" onClick={handleJump} />
        </WrappedToolTip>
      </div>
    </div>
  );
}
