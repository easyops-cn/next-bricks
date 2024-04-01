import React from "react";

interface LoadingProps {
  loading?: boolean;
}

export function MessageListLoading({ loading }: LoadingProps) {
  return loading ? <div className="message-list-loading-wrapper"></div> : null;
}

export function ChatItemLoading({ loading }: LoadingProps) {
  return loading ? (
    <div className="chart-item-loading-wrapper">
      <div className="load">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  ) : null;
}
