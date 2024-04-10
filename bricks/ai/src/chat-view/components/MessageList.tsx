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
import { MessageListLoading } from "./Loading.js";
import { MessageNode } from "./MessageItem/index.js";
import { QuickAnswerList } from "./QuickAnswerList/index.js";
import { throttle } from "lodash";

interface MessageListProps {
  showAvatar?: boolean;
}

const DEFAULT_OFFSET_HEIGHT = 80;

export function MessageList({
  showAvatar = true,
}: MessageListProps): React.ReactNode {
  const messageListRef = useRef<HTMLDivElement>(null);
  const messgetListBoxRef = useRef<HTMLDivElement>(null);
  const [preHeight, setPreHeight] = useState<number>(0);
  const flag = useRef<boolean>(false);
  const isCustomScroll = useRef<boolean>(false);

  const { msgList, msgItem, loading, chatting } = useChatViewContext();

  const getMsgItemNode = useCallback(
    (item: MessageItem, index: number = 0) => {
      return (
        <div
          className={classNames("message-item", { user: item.role === "user" })}
          key={item.ctime ?? index}
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

  const msgItemNode = useMemo(() => {
    if (msgItem) {
      return getMsgItemNode({
        ...msgItem,
        chatting: true,
      });
    }
    return null;
  }, [msgItem, getMsgItemNode]);

  const handleScroll = throttle(() => {
    const computedHeight =
      messageListRef.current!.scrollHeight -
      messageListRef.current!.clientHeight;
    const isBottom =
      computedHeight === messageListRef.current!.scrollTop ||
      // 缓冲20高度
      computedHeight - 20 < messageListRef.current!.scrollTop;
    if (isCustomScroll.current) {
      if (isBottom) {
        flag.current = false;
        isCustomScroll.current = false;
      }
      return;
    }
    if (!isBottom) {
      // fixed：有时候在数据返回时页面会跳一下，导致计算异常，这里做临时兼容处理
      if (!flag.current) {
        flag.current = true;
      } else {
        isCustomScroll.current = true;
      }
    }
  }, 200);

  useEffect(() => {
    if (chatting) {
      isCustomScroll.current = false;
      flag.current = false;
    }
  }, [chatting]);

  useEffect(() => {
    const element = messgetListBoxRef.current;
    if (element) {
      const observer = new ResizeObserver((entries) => {
        let newHeight: number = 0;
        if (isCustomScroll.current) return;
        for (const entry of entries) {
          newHeight = entry.contentRect.height - DEFAULT_OFFSET_HEIGHT;
        }
        if (newHeight === preHeight && !loading && !chatting) {
          // msgItem置为空，合并到msgList, 高度不变，并且聊天结束
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
    <div className="message-list" ref={messageListRef} onScroll={handleScroll}>
      <div className="message-list-box" ref={messgetListBoxRef}>
        <QuickAnswerList />
        {msgListNode}
        {msgItemNode}
      </div>
      <MessageListLoading loading={loading} />
    </div>
  );
}
