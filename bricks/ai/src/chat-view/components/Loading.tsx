import React from "react";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { wrapBrick } from "@next-core/react-element";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export function MessageListLoading() {
  return <div className="message-list-loading-wrapper"></div>;
}

export function ChatItemLoading() {
  return (
    <div className="chart-item-loading-wrapper">
      <div className="load">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export function CommonLoading() {
  return (
    <div className="common-loading-wrapper">
      <WrappedIcon icon="loading" lib="antd" spinning />
    </div>
  );
}
