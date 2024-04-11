import React from "react";
import { useChatViewContext } from "../ChatViewContext";
import { wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

export function StopBtn() {
  const { stopChat } = useChatViewContext();

  const handleStopChat = () => {
    stopChat();
  };
  return (
    <div className="stop-responding-wrapper">
      <WrappedLink className="stop-btn" onClick={handleStopChat}>
        停止生成
      </WrappedLink>
    </div>
  );
}
