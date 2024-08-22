import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ResizeObserver from "resize-observer-polyfill";
import { MessageItem, useChatViewContext } from "../ChatViewContext";
import { Avatar } from "./MessageItem/Avatar.js";
import classNames from "classnames";
import { CommonLoading, MessageListLoading } from "./Loading.js";
import { MessageNode } from "./MessageItem/index.js";
import { QuickAnswerList } from "./QuickAnswerList/index.js";
import { StopBtn } from "./StopBtn.js";
import { DEFAULT_TYPE, RELATED_QUESTIONS_TYPE } from "../hooks/useChatViewInfo";

interface MessageListProps {
  showAvatar?: boolean;
}

export function MessageList({
  showAvatar = true,
}: MessageListProps): React.ReactNode {
  const chatViewRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const { msgLoading, msgEnd, msgList, loading, chatting } =
    useChatViewContext();

  const getMsgItemNode = useCallback(
    (item: MessageItem, index: number = 0) => {
      switch (item.type) {
        case RELATED_QUESTIONS_TYPE:
          return (
            <div
              className={classNames("message-item")}
              style={{ marginTop: "-36px", marginLeft: "44px" }}
              key={index}
            >
              <MessageNode {...item} />
            </div>
          );
        case DEFAULT_TYPE:
        default:
          return (
            <div
              className={classNames("message-item", {
                user: item.role === "user",
              })}
              key={index}
            >
              {showAvatar && <Avatar role={item.role} agentId={item.agentId} />}
              <MessageNode {...item} />
            </div>
          );
      }
    },
    [showAvatar]
  );

  const msgListNode = useMemo(() => {
    return msgList.map((item, index) => {
      if (item.chatting) {
        return (
          <>
            {getMsgItemNode(item, index)}
            {chatting &&
            index === msgList.length - 1 &&
            item.type !== RELATED_QUESTIONS_TYPE ? (
              <StopBtn />
            ) : null}
          </>
        );
      } else {
        return getMsgItemNode(item, index);
      }
    });
  }, [msgList, chatting, getMsgItemNode]);

  const [manualScrolled, setManualScrolled] = useState(false);
  const autoScrollingRef = useRef(false);

  useEffect(() => {
    const chatView = chatViewRef.current;
    if (!chatView) {
      return;
    }
    const handleScroll = () => {
      if (!autoScrollingRef.current) {
        // Make a small buffer of 6px
        setManualScrolled(
          chatView.scrollTop + chatView.clientHeight! + 6 <
            chatView.scrollHeight
        );
      }
    };
    chatView.addEventListener("scroll", handleScroll);
    return () => {
      chatView.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const element = messageListRef.current;
    const chatView = chatViewRef.current;
    if (manualScrolled || !element || !chatView) {
      // Do not auto-scroll if manual scroll detected
      return;
    }
    const observer = new ResizeObserver(() => {
      autoScrollingRef.current = true;
      chatView.scroll({ top: chatView.scrollHeight });
      requestAnimationFrame(() => {
        autoScrollingRef.current = false;
      });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [manualScrolled]);

  return (
    <div className="chat-view" ref={chatViewRef}>
      <div className="message-list" ref={messageListRef}>
        <div className="message-list-box">
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
