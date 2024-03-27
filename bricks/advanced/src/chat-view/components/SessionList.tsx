import React from "react";
import {
  SessionItem as SessionItemProps,
  useChatViewContext,
} from "../ChatViewContext";
import classNames from "classnames";

export function SessionList(): React.ReactNode {
  const { sessionList } = useChatViewContext();

  return (
    <div className="session-list-wrapper">
      <div className="session-title">历史对话</div>
      <div className="session-list">
        {sessionList.map((item, index) => {
          return <SessionItem key={index} {...item} />;
        })}
      </div>
    </div>
  );
}

function SessionItem({ title, id }: SessionItemProps) {
  const { updateSession, activeSessionId } = useChatViewContext();

  const handleUpdateSession = () => {
    updateSession(id);
  };

  return (
    <div
      className={classNames("session-item", {
        active: id === activeSessionId,
      })}
      onClick={handleUpdateSession}
    >
      {title}
    </div>
  );
}
