import React, { useCallback, useEffect, useRef } from "react";
import { useChatViewContext } from "../ChatViewContext";
import classNames from "classnames";
import { debounce } from "lodash";
import { SessionItem as SessionItemProps } from "../ChatService";
import { CommonLoading } from "./Loading.js";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import type { showDialog as _showDialog } from "@next-bricks/basic/data-providers/show-dialog/show-dialog";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";

const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
);
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const showDialog = unwrapProvider<typeof _showDialog>("basic.show-dialog");

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
  const { activeSessionId, checkSession, deleteSession } = useChatViewContext();

  const handleCheckSession = useCallback(() => {
    checkSession(conversationId, true);
  }, [conversationId, checkSession]);

  const handleDeleteSession = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      showDialog({
        type: "confirm",
        title: "会话删除确认",
        content: `请输入 {{ expect }} 以确认删除`,
        expect: title.replace(/\s+/g, ""),
      }).then(async () => {
        const result = await deleteSession([conversationId]);
        showNotification({
          message: `删除会话${result ? "成功" : "失败"}`,
          type: result ? "success" : "error",
        });
      });
    },
    [conversationId, deleteSession, title]
  );

  return (
    <div
      key={title}
      className={classNames("session-item", {
        active: conversationId === activeSessionId,
      })}
      onClick={handleCheckSession}
    >
      <div className="content">
        <div className="title" title={title}>
          {title}
        </div>
      </div>

      <div className="session-close-btn" onClick={handleDeleteSession}>
        <WrappedIcon icon="close" lib="antd" />
      </div>
    </div>
  );
}
