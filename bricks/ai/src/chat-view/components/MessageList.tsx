import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MessageItem, useChatViewContext } from "../ChatViewContext";
import { Avatar } from "./MessageItem/Avatar.js";
import classNames from "classnames";
import { CommonLoading, MessageListLoading } from "./Loading.js";
import { MessageNode } from "./MessageItem/index.js";
import { QuickAnswerList } from "./QuickAnswerList/index.js";
import { debounce } from "lodash";
import { StopBtn } from "./StopBtn.js";

interface MessageListProps {
  showAvatar?: boolean;
}

const DEFAULT_OFFSET_HEIGHT = 80;
const CACHE_HEIGHT = 200;

export function MessageList({
  showAvatar = true,
}: MessageListProps): React.ReactNode {
  const chatViewRef = useRef<HTMLDivElement>(null);
  const messgetListBoxRef = useRef<HTMLDivElement>(null);
  const [preHeight, setPreHeight] = useState<number>(0);
  const isCustomScroll = useRef<boolean>(false);

  const {
    msgLoading,
    msgEnd,
    msgList,
    loading,
    activeSessionId,
    chatting,
    checkSession,
  } = useChatViewContext();

  const getMsgItemNode = useCallback(
    (item: MessageItem, index: number = 0) => {
      return (
        <div
          className={classNames("message-item", { user: item.role === "user" })}
          key={index}
        >
          {showAvatar && <Avatar role={item.role} />}
          <MessageNode {...item} />
        </div>
      );
    },
    [showAvatar]
  );

  const msgListNode = useMemo(() => {
    return msgList.map((item, index) => {
      if (item.chatting) {
        return (
          <>
            {getMsgItemNode(item, index)}
            {chatting && index === msgList.length - 1 ? <StopBtn /> : null}
          </>
        );
      } else {
        return getMsgItemNode(item, index);
      }
    });
  }, [msgList, chatting, getMsgItemNode]);

  const handleScroll = useCallback(() => {
    const messageList = chatViewRef.current;
    if (messageList) {
      const { scrollHeight, clientHeight, scrollTop } = messageList;
      // 滚动到底部所需的高度 = 总高度 - 视图高度
      const isBottom = scrollHeight - clientHeight === scrollTop;
      if (!isBottom) {
        isCustomScroll.current = true;
      } else if (isBottom && isCustomScroll.current) {
        // 自动吸低
        isCustomScroll.current = false;
      }
      if (
        !msgLoading &&
        !msgEnd &&
        scrollTop < CACHE_HEIGHT &&
        activeSessionId
      ) {
        checkSession();
      }
    }
  }, [msgEnd, msgLoading, activeSessionId, checkSession]);

  const debounceHandleScroll = debounce(handleScroll, 200);

  useEffect(() => {
    if (chatting || activeSessionId) {
      // 聊天或者会话变更时，重置滚动状态
      isCustomScroll.current = false;
    }
  }, [chatting, activeSessionId]);

  useEffect(() => {
    const element = messgetListBoxRef.current;
    if (element) {
      const observer = new ResizeObserver((entries) => {
        let newHeight: number = 0;
        // 如果存在用户行为，不触发自动滚动行为
        if (isCustomScroll.current) return;
        for (const entry of entries) {
          newHeight = entry.contentRect.height - DEFAULT_OFFSET_HEIGHT;
        }
        if (!loading && !chatting) {
          // 高度变化，代表消息新增，自动滚动到最下
          chatViewRef.current!.scroll({
            top: Number.MAX_SAFE_INTEGER,
          });
        }
        if (newHeight > preHeight && chatting) {
          chatViewRef.current!.scroll({
            top: Number.MAX_SAFE_INTEGER,
          });
          setPreHeight(Math.max(preHeight, newHeight));
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [chatting, loading, preHeight]);

  return (
    <div
      className="chat-view"
      ref={chatViewRef}
      onScroll={debounceHandleScroll}
    >
      <div className="message-list">
        <div className="message-list-box" ref={messgetListBoxRef}>
          {msgEnd && msgList.length ? (
            <div className="message-start-tip">会话开始</div>
          ) : null}
          {msgLoading && <CommonLoading />}
          <QuickAnswerList />
          {msgListNode}
        </div>
        {loading && <MessageListLoading />}
      </div>
    </div>
  );
}
