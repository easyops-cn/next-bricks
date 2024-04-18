import React, { useEffect, useMemo, useRef, useState } from "react";
import { useChatViewContext } from "../../ChatViewContext";
import { wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "@next-bricks/basic/link";

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");

export interface AgentDetailItem {
  name: string;
  description: string;
  icon: GeneralIconProps & { color: string };
  starterPrompts?: string[];
  instanceId: string;
  [key: string]: any;
}

const CARD_ITEM_HEIGHT = 85;
const HEIGHT_GAP = 24;

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

  const iconColor = useMemo(() => icon?.color ?? "geekblue", [icon]);

  return (
    <div
      className="quick-answer-card-item"
      style={{
        height: CARD_ITEM_HEIGHT,
        background: `linear-gradient(rgba(var(--theme-${iconColor}-color-rgb-channel), 0.1), rgba(var(--theme-${iconColor}-color-rgb-channel), 0.08))`,
      }}
      onClick={handleCardClick}
    >
      <div className="left">
        <WrappedIcon
          className="icon"
          {...(icon ?? {
            icon: "default-app",
            lib: "easyops",
            category: "app",
          })}
          style={{
            background: `rgba(var(--theme-${iconColor}-color-rgb-channel), 0.5)`,
          }}
        />
      </div>
      <div className="content">
        <div className="title">{name}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );
}

export function QuickAnswerList() {
  const { quickAnswerConfig, msgList, loading } = useChatViewContext();
  const [showMoreBtn, setShowMoreBtn] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);
  const hadClickShowMoreBtn = useRef<boolean>(false);

  const handleShowMoreClick = () => {
    hadClickShowMoreBtn.current = true;
    setShowMoreBtn(false);
  };

  useEffect(() => {
    const element = listRef.current;
    if (element) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (
            entry.contentRect.height >
            CARD_ITEM_HEIGHT * 3 + HEIGHT_GAP * 2
          ) {
            if (!hadClickShowMoreBtn.current) {
              setShowMoreBtn(true);
            }
          } else {
            setShowMoreBtn(false);
          }
        }
      });
      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [showMoreBtn]);

  return quickAnswerConfig?.list.length && msgList.length === 0 && !loading ? (
    <div className="quick-answer-wrapper">
      <div className="tip">
        {quickAnswerConfig.tip ??
          "你好，我是运维数智人—Murphy，我能为你提供以下服务:"}
      </div>
      <div
        className="quick-answer-list"
        style={{
          ...(showMoreBtn
            ? {
                maxHeight: CARD_ITEM_HEIGHT * 3 + HEIGHT_GAP * 2 + 10,
                overflow: "hidden",
              }
            : {}),
        }}
        ref={listRef}
      >
        {quickAnswerConfig.list.map((item) => (
          <QuickAnswerCardItem key={item.instanceId} {...item} />
        ))}
      </div>
      {showMoreBtn ? (
        <div className="show-more-wrapper">
          <WrappedLink
            icon={{
              lib: "antd",
              icon: "down",
            }}
            className="show-more-btn"
            onClick={handleShowMoreClick}
          >
            显示更多
          </WrappedLink>
        </div>
      ) : null}
    </div>
  ) : null;
}
