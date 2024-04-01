import React, { useMemo } from "react";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import { useChatViewContext, type MessageItem } from "../../ChatViewContext";

const WrappedToolTip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrapperIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export function ContentTip({ role, content }: MessageItem): React.ReactNode {
  const isUser = useMemo(() => role === "user", [role]);

  const { chartting, setSearchStr } = useChatViewContext();

  const handleCopy = () => {
    setSearchStr(content.map((item) => item.text).toString());
  };

  return isUser && !chartting ? (
    <div className="content-tip">
      <WrappedToolTip content="点击再次提问">
        <WrapperIcon lib="antd" icon="edit" onClick={handleCopy} />
      </WrappedToolTip>
    </div>
  ) : null;
}
