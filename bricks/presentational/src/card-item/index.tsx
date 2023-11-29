import React, { CSSProperties, Ref, useCallback, useMemo } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { Link, LinkProps } from "@next-bricks/basic/link";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type {
  EoMiniActions,
  EoMiniActionsProps,
  EoMiniActionsEvents,
  EoMiniActionsEventsMapping,
  ActionType,
} from "@next-bricks/basic/mini-actions";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedMiniActions = wrapBrick<
  EoMiniActions,
  EoMiniActionsProps,
  EoMiniActionsEvents,
  EoMiniActionsEventsMapping
>("eo-mini-actions", {
  onActionClick: "action.click",
});

interface IconAvatar {
  containerSize?: string;
  icon: GeneralIconProps;
  color?: string;
  size?: number;
  shape?: "circle" | "square" | "round-square";
  bgColor?: string;
}

interface ImgAvatar {
  containerSize?: string;
  imgSrc: string;
  imgStyle?: CSSProperties;
  shape?: "circle" | "square" | "round-square";
  bgColor?: string;
}

export interface EoCardItemProps {
  hasHeader?: boolean;
  cardTitle: string;
  description?: string;
  auxiliaryText?: string;
  avatar?: IconAvatar | ImgAvatar;
  href?: LinkProps["href"];
  url?: LinkProps["url"];
  target?: LinkProps["target"];
  actions?: ActionType[];
  hasExpandedArea1?: boolean;
  hasExpandedArea2?: boolean;
  styleType?: "grayish";
}

/**
 * 信息类卡片 —— 通用卡片
 * @slot expanded-area-1 - 扩展区域 1，通常放置标签信息
 * @slot expanded-area-2 - 扩展区域 2，通常放置操作和其他属性信息（图标/头像/小字描述/统计信息）
 * @category card-info
 */
export
@defineElement("eo-card-item", {
  styleTexts: [styleText],
})
class EoCardItem extends ReactNextElement implements EoCardItemProps {
  /**
   * 是否有顶部
   */
  @property({
    type: Boolean,
  })
  accessor hasHeader: boolean | undefined;

  /**
   * 卡片标题
   */
  @property()
  accessor cardTitle!: string;

  /**
   * 描述信息
   */
  @property()
  accessor description: string | undefined;

  /**
   * 顶部辅助文字
   */
  @property()
  accessor auxiliaryText: string | undefined;

  /**
   * 图标
   */
  @property({
    attribute: false,
  })
  accessor avatar: IconAvatar | ImgAvatar | undefined;

  /**
   * 设置 `href` 时将使用原生 `<a>` 标签，通常用于外链的跳转
   */
  @property() accessor href: LinkProps["href"] | undefined;

  /**
   * 链接地址
   */
  @property({
    attribute: false,
  })
  accessor url: LinkProps["url"] | undefined;

  /**
   * 链接跳转目标
   */
  @property() accessor target: LinkProps["target"] | undefined;

  /**
   * 操作按钮组
   */
  @property({
    attribute: false,
  })
  accessor actions: ActionType[] | undefined;

  /**
   * 卡片样式类型
   */
  @property()
  accessor styleType: "grayish" | undefined;

  /**
   * 是否有扩展区域 1
   * @internal
   */
  @property({
    type: Boolean,
  })
  accessor hasExpandedArea1: boolean | undefined;

  /**
   * 是否有扩展区域 2
   * @internal
   */
  @property({
    type: Boolean,
  })
  accessor hasExpandedArea2: boolean | undefined;

  #handleActionClick = (action: ActionType) => {
    this.dispatchEvent(new CustomEvent(action.event));
  };

  #renderCallback = () => {
    const expandedArea1 = this.#getSlotBySelector(
      "slot[name='expanded-area-1']"
    );
    const expandedArea2 = this.#getSlotBySelector(
      "slot[name='expanded-area-2']"
    );
    expandedArea1?.addEventListener("slotchange", () => {
      this.hasExpandedArea1 = expandedArea1.assignedElements().length > 0;
    });
    expandedArea2?.addEventListener("slotchange", () => {
      this.hasExpandedArea2 = expandedArea2.assignedElements().length > 0;
    });
  };

  #getSlotBySelector(selector: string): HTMLSlotElement {
    return this.shadowRoot?.querySelector(selector) as HTMLSlotElement;
  }

  render() {
    return (
      <EoCardItemComponent
        hasHeader={this.hasHeader}
        cardTitle={this.cardTitle}
        description={this.description}
        auxiliaryText={this.auxiliaryText}
        avatar={this.avatar}
        actions={this.actions}
        href={this.href}
        url={this.url}
        target={this.target}
        callback={this.#renderCallback}
        onActionClick={this.#handleActionClick}
      />
    );
  }
}

interface EoCardItemComponentProps extends EoCardItemProps {
  callback?: Ref<HTMLDivElement>;
  onActionClick?: (action: ActionType) => void;
}

export function EoCardItemComponent(props: EoCardItemComponentProps) {
  const {
    hasHeader,
    cardTitle,
    description,
    auxiliaryText,
    actions,
    avatar,
    url,
    target,
    href,
    callback,
    onActionClick,
  } = props;

  const handleActionClick = useCallback(
    (event: CustomEvent<ActionType>) => {
      onActionClick?.(event.detail);
    },
    [onActionClick]
  );

  const MiniActions = useMemo(() => {
    return (
      <WrappedMiniActions
        onActionClick={handleActionClick}
        onClickCapture={(e) => {
          e.preventDefault();
        }}
        className="operator"
        actions={actions}
      />
    );
  }, [actions, handleActionClick]);

  const Avatar = useMemo(() => {
    if (!avatar) return;
    if ("icon" in avatar && avatar.icon) {
      const {
        icon,
        shape = "round-square",
        bgColor,
        color,
        size,
        containerSize = 40,
      } = avatar;
      return (
        <div
          className={classNames("card-avatar", shape && `card-avatar-${shape}`)}
          style={{
            background: bgColor,
            width: containerSize,
            height: containerSize,
          }}
        >
          <WrappedIcon {...icon} style={{ color: color, fontSize: size }} />
        </div>
      );
    } else if ("imgSrc" in avatar && avatar.imgSrc) {
      const {
        imgSrc,
        shape = "round-square",
        bgColor,
        imgStyle,
        containerSize = 40,
      } = avatar;
      return (
        <div
          className={classNames("card-avatar", shape && `card-avatar-${shape}`)}
          style={{
            background: bgColor,
            width: containerSize,
            height: containerSize,
          }}
        >
          <img src={imgSrc} width={"100%"} height={"100%"} style={imgStyle} />
        </div>
      );
    }
  }, [avatar]);

  return (
    <WrappedLink type="plain" url={url} target={target} href={href}>
      <div className="card-wrapper" ref={callback}>
        {hasHeader ? (
          <div className="card-header">
            <div className="auxiliary-text">{auxiliaryText}</div>
            {MiniActions}
          </div>
        ) : (
          MiniActions
        )}
        <div className="card-content">
          {Avatar}
          <div className="card-content-container">
            <div className="card-title">{cardTitle}</div>
            <div className="card-description">{description}</div>
          </div>
        </div>
        <div className="card-expanded-area-1">
          <slot name="expanded-area-1" />
        </div>
        <div className="card-expanded-area-2">
          <slot name="expanded-area-2" />
        </div>
      </div>
    </WrappedLink>
  );
}
