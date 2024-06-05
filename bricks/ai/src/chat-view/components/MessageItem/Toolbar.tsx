import React, { useCallback, useMemo } from "react";
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
import classNames from "classnames";
import { useMsgItemContext } from "./MsgItemContext";
import { getBasePath } from "@next-core/runtime";

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
  taskId,
  tag,
}: MessageItem): React.ReactNode {
  const isAssistant = useMemo(
    () => role === "assistant" && content.type !== "load",
    [role, content.type]
  );
  const isChattingItem = useMemo(() => chatting, [chatting]);
  const { showLike, showShare, readonly, handleIsLike } = useChatViewContext();
  const { agentId, conversationId } = useMsgItemContext();
  const handleCopy = () => {
    copyToClipboard(content.text)
      .then(() => showNotification({ type: "success", message: "复制成功" }))
      .catch(() => showNotification({ type: "error", message: "复制失败" }));
  };

  const handleShare = () => {
    copyToClipboard(
      `${location.origin}${getBasePath()}ai-center/share?agentId=${agentId}&conversationId=${conversationId}`
    )
      .then(() =>
        showNotification({ type: "success", message: "会话链接已复制到剪贴板" })
      )
      .catch(() =>
        showNotification({ type: "error", message: "会话链接复制失败" })
      );
  };

  const handleLikeOrIsLike = useCallback(
    async (islike: boolean) => {
      const result = await handleIsLike(taskId!, islike);
      showNotification({
        message: `${islike ? "点赞" : "操作"}${result ? "成功" : "失败"}`,
        type: result ? "success" : "error",
      });
    },
    [taskId, handleIsLike]
  );

  return isAssistant && !isChattingItem ? (
    <div className="message-toolbar">
      {showLike && !readonly && (
        <>
          <WrappedToolTip content="点赞" hoist>
            <WrapperIcon
              className={classNames("like", {
                active: tag?.isLike === true,
              })}
              lib="easyops"
              icon="like"
              onClick={() => handleLikeOrIsLike(true)}
            />
          </WrappedToolTip>
          <WrappedToolTip content="还不够好" hoist>
            <WrapperIcon
              className={classNames("unlike", {
                active: tag?.isLike === false,
              })}
              lib="easyops"
              icon="unlike"
              onClick={() => handleLikeOrIsLike(false)}
            />
          </WrappedToolTip>
          <div className="split" />
        </>
      )}
      <WrappedToolTip content="点击复制" hoist>
        <WrapperIcon lib="antd" icon="copy" onClick={handleCopy} />
      </WrappedToolTip>
      {showShare && (
        <WrappedToolTip content="点击分享" hoist>
          <WrapperIcon lib="antd" icon="share-alt" onClick={handleShare} />
        </WrappedToolTip>
      )}
    </div>
  ) : null;
}
