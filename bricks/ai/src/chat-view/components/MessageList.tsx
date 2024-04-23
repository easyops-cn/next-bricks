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
  const messageListRef = useRef<HTMLDivElement>(null);
  const messgetListBoxRef = useRef<HTMLDivElement>(null);
  const [preHeight, setPreHeight] = useState<number>(0);
  const isCustomScroll = useRef<boolean>(false);

  const {
    msgLoading,
    msgEnd,
    msgList,
    msgItem,
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
          key={item.key ?? index}
        >
          {showAvatar && <Avatar role={item.role} />}
          <MessageNode {...item} />
        </div>
      );
    },
    [showAvatar]
  );

  const msgListNode = useMemo(() => {
    if (msgList.length) {
      return msgList.map(getMsgItemNode);
    }
    return null;
  }, [msgList, getMsgItemNode]);

  const msgItemNode = useMemo(
    () =>
      msgItem ? (
        <>
          {getMsgItemNode({
            ...msgItem,
            chatting: true,
          })}
          <StopBtn />
        </>
      ) : null,
    [msgItem, getMsgItemNode]
  );

  const handleScroll = useCallback(() => {
    const messageList = messageListRef.current;
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
      if (!msgLoading && !msgEnd && scrollTop < CACHE_HEIGHT) {
        checkSession();
      }
    }
  }, [msgEnd, msgLoading, checkSession]);

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
          messageListRef.current!.scroll({
            top: Number.MAX_SAFE_INTEGER,
          });
        }
        if (newHeight > preHeight && chatting) {
          messageListRef.current!.scroll({
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
      className="message-list"
      ref={messageListRef}
      onScroll={debounceHandleScroll}
    >
      <div className="message-list-box" ref={messgetListBoxRef}>
        {msgEnd && msgList.length ? (
          <div className="message-start-tip">会话开始</div>
        ) : null}
        {msgLoading && <CommonLoading />}
        <QuickAnswerList />
        {msgListNode}
        {msgItemNode}
      </div>
      <MessageListLoading loading={loading} />
    </div>
  );
}
