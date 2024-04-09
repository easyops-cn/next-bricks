import React, { useState } from "react";
import { useChatViewContext } from "../../ChatViewContext";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

const WrapperIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface AgentDetailItem {
  name: string;
  description: string;
  icon: GeneralIconProps & { color: string };
  starterPrompts?: string[];
  instanceId: string;
  [key: string]: any;
}

function QuickAnswerCardItem({
  name,
  description,
  icon,
  starterPrompts,
}: AgentDetailItem) {
  const { setSearchStr } = useChatViewContext();

  const handleCardClick = () => {
    starterPrompts?.length && setSearchStr(starterPrompts[0]);
  };

  return (
    <div className="quick-answer-card-item" onClick={handleCardClick}>
      <WrapperIcon
        className="icon"
        {...(icon ?? {
          icon: "default-app",
          lib: "easyops",
          category: "app",
        })}
        style={{ color: `var(--theme-${icon?.color ?? "geekblue"}-color)` }}
      />
      <div className="content">
        <div className="title">{name}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );
}

export function QuickAnswerList() {
  const { quickAnswerConfig, msgList } = useChatViewContext();
  const [showMoreBtn, setShowMoreBtn] = useState<boolean>(true);

  const handleShowMoreClick = () => {
    setShowMoreBtn(false);
  };

  return quickAnswerConfig?.list.length && msgList.length === 0 ? (
    <div className="quick-answer-wrapper">
      <div className="tip">
        {quickAnswerConfig.tip ?? "你好，我是AI机器人，我能为你提供以下服务:"}
      </div>
      <div className="quick-answer-list">
        {quickAnswerConfig.list
          .slice(0, showMoreBtn ? 3 : quickAnswerConfig.list.length)
          .map((item) => (
            <QuickAnswerCardItem key={item.instanceId} {...item} />
          ))}
      </div>
      {showMoreBtn ? (
        <div className="show-more-wrapper">
          <span className="show-more-btn" onClick={handleShowMoreClick}>
            显示更多
          </span>
        </div>
      ) : null}
    </div>
  ) : null;
}
