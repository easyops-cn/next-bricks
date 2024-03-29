import React, { CSSProperties, Ref, useCallback, useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
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
  SimpleActionType,
  ActionType,
} from "@next-bricks/basic/mini-actions";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import classNames from "classnames";
import "./host-contenxt.css";

const { defineElement, property, event } = createDecorators();

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

interface TagConfig {
  text?: string;
  icon?: GeneralIconProps;
  bgColor?: string;
  color?: string;
}

export enum TagColor {
  blue = "blue",
  cyan = "cyan",
  geekblue = "geekblue",
  grayblue = "grayblue",
  gray = "gray",
  green = "green",
  orange = "orange",
  purple = "purple",
  red = "red",
  yellow = "yellow",
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
  hasCover?: boolean;
  coverImage?: string;
  coverColor?: string;
  tagConfig?: TagConfig;
  avatarPosition?: "content" | "cover";
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
   * 是否有顶部小标题
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
   * 是否使用卡片封面
   */
  @property()
  accessor hasCover: boolean;

  /**
   * 卡片封面背景图片
   */
  @property({
    attribute: false,
  })
  accessor coverImage: string;

  /**
   * 卡片封面背景颜色（使用纯色背景）
   */
  @property({
    attribute: false,
  })
  accessor coverColor: string;

  /**
   * 图标是否放置在卡片封面
   */
  @property()
  accessor avatarPosition: "content" | "cover";

  @property({
    attribute: false,
  })
  accessor tagConfig: TagConfig | undefined;

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

  #handleActionClick = (action: SimpleActionType) => {
    this.dispatchEvent(new CustomEvent(action.event));
  };

  /**
   * 徽标点击事件
   */
  @event({ type: "tag.click" })
  accessor #tagClickEvent!: EventEmitter<void>;

  #handleTagClick = () => {
    this.#tagClickEvent.emit();
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
        hasCover={this.hasCover}
        coverImage={this.coverImage}
        coverColor={this.coverColor}
        tagConfig={this.tagConfig}
        avatarPosition={this.avatarPosition}
        onActionClick={this.#handleActionClick}
        onTagClick={this.#handleTagClick}
      />
    );
  }
}

interface EoCardItemComponentProps extends EoCardItemProps {
  callback?: Ref<HTMLDivElement>;
  onActionClick?: (action: SimpleActionType) => void;
  onTagClick?: () => void;
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
    hasCover,
    coverImage,
    coverColor,
    avatarPosition,
    tagConfig,
    onActionClick,
    onTagClick,
  } = props;

  const handleActionClick = useCallback(
    (event: CustomEvent<SimpleActionType>) => {
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
        size = avatarPosition === "cover" ? 68 : 40,
        containerSize = avatarPosition === "cover" ? 90 : 40,
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
        containerSize = avatarPosition === "cover" ? 90 : 40,
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

  const useDefineColor = useMemo(() => {
    return Object.values(TagColor).includes(tagConfig?.bgColor as TagColor);
  }, [tagConfig]);

  const handleTagClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onTagClick?.();
  };

  // const shouldRenderCover = useMemo(() => {
  //   return coverColor || coverImage;
  // }, [coverColor, coverImage]);

  return (
    <WrappedLink type="plain" url={url} target={target} href={href}>
      <div className="card-wrapper" ref={callback}>
        {hasCover && (
          <div className="card-cover-wrapper">
            <div
              className="card-cover-content"
              style={{
                ...(coverImage && { backgroundImage: `url(${coverImage})` }),
                ...(coverColor && { backgroundColor: coverColor }),
              }}
            >
              {MiniActions}
              {avatarPosition === "cover" && Avatar}
            </div>
          </div>
        )}
        {hasHeader ? (
          <div className="card-header">
            <div className="auxiliary-text">{auxiliaryText}</div>
            {!hasCover && MiniActions}
          </div>
        ) : (
          !hasCover && MiniActions
        )}
        <div className="card-content">
          {avatarPosition !== "cover" && Avatar}
          <div className="card-content-container">
            <div className="card-title">{cardTitle}</div>
            <div className="card-description">{description}</div>
          </div>
          {tagConfig && (
            <div
              className={classNames("card-tag", {
                [`color-${tagConfig.bgColor}`]: useDefineColor,
                "icon-tag": tagConfig.text ? false : tagConfig.icon,
                "text-tag": tagConfig.text,
              })}
              style={{
                ...(useDefineColor
                  ? {}
                  : {
                      color: tagConfig.color,
                      background: tagConfig.bgColor,
                    }),
              }}
              onClick={handleTagClick}
            >
              {tagConfig.text ? (
                tagConfig.text
              ) : tagConfig.icon ? (
                <WrappedIcon {...tagConfig.icon} />
              ) : null}
            </div>
          )}
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
