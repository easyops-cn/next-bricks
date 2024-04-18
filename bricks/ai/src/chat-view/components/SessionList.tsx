import React, { useCallback, useEffect, useRef } from "react";
import { useChatViewContext } from "../ChatViewContext";
import classNames from "classnames";
import { debounce } from "lodash";
import { SessionItem as SessionItemProps } from "../ChatService";
import { CommonLoading } from "./Loading.js";

const SESSION_ITEM_HEIGHT = 42;
const BUFFER_NUMBER = 5;
const CACHE_HEIGHT = 100;

export function SessionList(): React.ReactNode {
  const { sessionEnd, sessionLoading, sessionList, querySessionHistory } =
    useChatViewContext();
  const sessionWrapperRef = useRef<HTMLDivElement>(null);
  const sessionListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 计算视图内可以展示多少条会话历史数据
    let limit = 20;
    const sessionWrapper = sessionWrapperRef.current;
    if (sessionWrapper) {
      // limit = 视图高度 % 单条高度 + 缓冲长度
      limit =
        Math.floor(sessionWrapper.clientHeight / SESSION_ITEM_HEIGHT) +
        BUFFER_NUMBER;
    }
    querySessionHistory(limit);
  }, []);

  const checkSessionList = useCallback(() => {
    if (sessionLoading || sessionEnd) return;
    const sessionList = sessionListRef.current;
    if (sessionList) {
      const { scrollTop, scrollHeight, clientHeight } = sessionList;
      // 如果滚动的高度 + 视图高度 + 缓冲高度 > 视图的滚动高度，请求新的数据
      if (scrollTop + clientHeight + CACHE_HEIGHT > scrollHeight) {
        querySessionHistory();
      }
    }
  }, [querySessionHistory, sessionLoading, sessionEnd]);

  const handleScroll = debounce(checkSessionList, 200);

  return (
    <div className="session-list-wrapper" ref={sessionWrapperRef}>
      <div className="session-title">历史对话</div>
      <div
        className="session-list"
        ref={sessionListRef}
        onScroll={handleScroll}
      >
        {sessionList.map((item, index) => {
          return <SessionItem key={index} {...item} />;
        })}
        {sessionLoading && <CommonLoading />}
        {/* {sessionEnd && <div className="session-end-tip">到底啦</div>} */}
      </div>
    </div>
  );
}

function SessionItem({ title, conversationId }: SessionItemProps) {
  const { checkSession, activeSessionId } = useChatViewContext();

  const handleCheckSession = useCallback(() => {
    checkSession(conversationId, true);
  }, [conversationId, checkSession]);

  return (
    <div
      key={title}
      className={classNames("session-item", {
        active: conversationId === activeSessionId,
      })}
      onClick={handleCheckSession}
    >
      {title}
    </div>
  );
}
