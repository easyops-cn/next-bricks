import React, { Ref } from "react";
import { createDecorators } from "@next-core/element";
import { ReactUseBrick } from "@next-core/react-runtime";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { UseSingleBrickConf } from "@next-core/types";

import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type { LinkProps } from "@next-bricks/basic/link";
import type { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import { getHistory } from "@next-core/runtime";

// --- NOTE: uncomment these lines below to enable i18n for your brick ---
// import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
// import { K, NS, locales } from "./i18n.js";
// initializeReactI18n(NS, locales);

const { defineElement, property } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");

/**
 * 信息卡片
 * @author dophijing
 * @category card-info
 */
export
@defineElement("eo-info-card-item", {
  styleTexts: [styleText],
})
class EoInfoCardItem extends ReactNextElement {
  /**
   * title
   */
  @property()
  accessor cardTitle: string;

  /**
   * description
   */
  @property()
  accessor description: string;

  /**
   * 链接地址
   */
  @property()
  accessor url: string | undefined;

  /**
   * 图标
   */
  @property({
    attribute: false,
  })
  accessor cardIcon: IconAvatar | undefined;

  /**
   * 详细列表
   */
  @property({
    attribute: false,
  })
  accessor detailList: InfoCardDetail[];

  /**
   * 链接跳转目标
   */
  @property() accessor target: LinkProps["target"] | undefined;

  /**
   * 是否有Icon
   * @internal
   */
  @property({
    type: Boolean,
  })
  accessor hasIcon: boolean | undefined;

  /**
   * 是否hoverable
   * @internal
   */
  @property({
    type: Boolean,
  })
  accessor hoverable: boolean | undefined;

  #getSlotBySelector(selector: string): HTMLSlotElement {
    return this.shadowRoot?.querySelector(selector) as HTMLSlotElement;
  }

  #renderCallback = () => {
    const iconSlot = this.#getSlotBySelector("slot[name='icon']");
    const actionSlot = this.#getSlotBySelector("slot[name='action']");

    this.hasIcon = iconSlot.childNodes.length > 0;
    iconSlot?.addEventListener("slotchange", () => {
      this.hasIcon = iconSlot.assignedElements().length > 0;
    });

    actionSlot?.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
    });
  };

  render() {
    return (
      <EoInfoCardItemComponent
        url={this.url}
        target={this.target}
        cardTitle={this.cardTitle}
        description={this.description}
        cardIcon={this.cardIcon}
        detailList={this.detailList}
        callback={this.#renderCallback}
        hoverable={this.hoverable}
      />
    );
  }
}

interface IconAvatar {
  icon: GeneralIconProps;
  color?: string;
  size?: number;
  shape?: "circle" | "square" | "round-square";
  bgColor?: string;
}

interface InfoCardDetail {
  title?: string;
  desc?: string;
  useBrick?: UseSingleBrickConf;
}

interface EoInfoCardItemComponentProps {
  url?: string;
  target?: LinkProps["target"];
  cardTitle: string;
  description?: string;
  cardIcon?: IconAvatar | undefined;
  detailList?: InfoCardDetail[];
  callback?: Ref<HTMLDivElement>;
  hoverable?: boolean;
}

export function EoInfoCardItemComponent({
  url,
  target,
  cardTitle,
  description,
  cardIcon,
  detailList,
  callback,
  hoverable = true,
}: EoInfoCardItemComponentProps) {
  // const { t } = useTranslation(NS);
  // const hello = t(K.HELLO);

  const getDetailItem = (detail: InfoCardDetail, index: number) => (
    <div
      className="card-detail-wrapper"
      key={index}
      onClick={(e) => e.stopPropagation()}
    >
      {detail.title && <h5>{detail.title}</h5>}

      {detail.useBrick && (
        <ReactUseBrick useBrick={detail.useBrick} data={detail} />
      )}
      {!detail.useBrick && detail.desc && (
        <WrappedTooltip content={detail.desc} hoist placement="top">
          <div className="card-detail-desc">{detail.desc}</div>
        </WrappedTooltip>
      )}
    </div>
  );

  const handleCardClick = () => {
    if (url) {
      const history = getHistory();
      target ? window.open(url, target) : history.push(url);
    }
  };

  return (
    <div
      className={classNames("card-wrapper", { hoverable })}
      ref={callback}
      onClick={handleCardClick}
    >
      <div className="card-content">
        <div className="card-icon">
          <slot name="icon">
            {cardIcon && (
              <div
                className={classNames(
                  "card-avatar",
                  cardIcon.shape &&
                    `card-avatar-${cardIcon.shape ?? "round-square"}`
                )}
                style={{
                  background:
                    cardIcon.bgColor ?? "var(--theme-blue-background)",
                }}
              >
                <WrappedIcon
                  {...cardIcon.icon}
                  style={{
                    color: cardIcon.color ?? "var(--theme-blue-color)",
                    fontSize: cardIcon.size ?? "20px",
                  }}
                />
              </div>
            )}
          </slot>
        </div>
        <div className="card-content-container">
          <div className="card-title">
            <span>{cardTitle}</span> <slot name="title" />
          </div>
          <div className="card-description">{description}</div>
        </div>
      </div>
      <div className="card-right-section">
        <div
          className="card-detail-list-wrapper"
          style={
            detailList?.length >= 4
              ? {
                  gridTemplateColumns: `repeat(${detailList?.length}, minmax(0, 1fr))`,
                }
              : { display: "flex", justifyContent: "flex-end" }
          }
        >
          {detailList?.map(getDetailItem)}
        </div>

        <div className="card-action-wrapper">
          <slot name="action" />
        </div>
      </div>
    </div>
  );
}
