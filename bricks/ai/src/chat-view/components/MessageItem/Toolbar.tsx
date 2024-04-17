import React, { useMemo } from "react";
import { wrapBrick } from "@next-core/react-element";
import type { copyToClipboard as _copyToClipboard } from "@next-bricks/basic/data-providers/copy-to-clipboard";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import { MessageItem, useChatViewContext } from "../../ChatViewContext";
import { unwrapProvider } from "@next-core/utils/general";

const WrapperIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedToolTip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const copyToClipboard = unwrapProvider<typeof _copyToClipboard>(
  "basic.copy-to-clipboard"
);
const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
);

export function Toolbar({
  role,
  content,
  chatting,
}: MessageItem): React.ReactNode {
  const isAssistant = useMemo(
    () => role === "assistant" && content.type !== "load",
    [role, content.type]
  );
  const isChattingItem = useMemo(() => chatting, [chatting]);
  const { showLike } = useChatViewContext();

  const handleCopy = () => {
    copyToClipboard(content.text)
      .then(() => showNotification({ type: "success", message: "复制成功" }))
      .catch(() => showNotification({ type: "error", message: "复制失败" }));
  };

  return isAssistant && !isChattingItem ? (
    <div className="toolbar">
      {showLike && (
        <>
          <WrappedToolTip content="点赞">
            <WrapperIcon lib="antd" icon="like" theme="filled" />
          </WrappedToolTip>
          <WrappedToolTip content="还不够好">
            <WrapperIcon lib="antd" icon="dislike" theme="filled" />
          </WrappedToolTip>
        </>
      )}
      <WrappedToolTip content="点击复制">
        <WrapperIcon lib="antd" icon="copy" onClick={handleCopy} />
      </WrappedToolTip>
    </div>
  ) : null;
}
