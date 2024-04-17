import React from "react";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { wrapBrick } from "@next-core/react-element";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
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

export function CommonLoading() {
  return (
    <div className="common-loading-wrapper">
      <WrappedIcon icon="loading" lib="antd" spinning />
    </div>
  );
}
