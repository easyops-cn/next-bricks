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
import { Loading } from "./MessageItem/Loading";
import { MessageNode } from "./MessageItem/index.js";

interface MessageListProps {
  showAvatar?: boolean;
}

const DEFAULT_OFFSET_HEIGHT = 80;

export function MessageList({
  showAvatar = true,
}: MessageListProps): React.ReactNode {
  const messageListRef = useRef<HTMLDivElement>(null);
  const messgetListBoxRef = useRef<HTMLDivElement>(null);
  // const preHeight = useRef<number>(0);
  const [preHeight, setPreHeight] = useState<number>(0);

  const { msgList, msgItem, loading, chartting } = useChatViewContext();

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

  useEffect(() => {
    const element = messgetListBoxRef.current;
    if (element) {
      const observer = new ResizeObserver((entries) => {
        let newHeight: number = 0;
        for (const entry of entries) {
          newHeight = entry.contentRect.height - DEFAULT_OFFSET_HEIGHT;
        }
        if (newHeight > preHeight && !loading && !chartting) {
          messageListRef.current!.scroll({
            top: Number.MAX_SAFE_INTEGER,
          });
          setPreHeight(newHeight);
        }
        if (newHeight > preHeight && chartting) {
          messageListRef.current!.scroll({
            top: Number.MAX_SAFE_INTEGER,
          });
          setPreHeight(Math.max(preHeight, newHeight));
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [chartting, loading, preHeight]);

  return (
    <div className="message-list" ref={messageListRef}>
      <div className="message-list-box" ref={messgetListBoxRef}>
        {msgListNode}
        {msgItemNode}
      </div>
      <Loading loading={loading} />
    </div>
  );
}
