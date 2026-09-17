import React, {
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import { WrappedSlResizeObserver } from "./sl-resize-observer.js";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const TEXT_NODE_PADDING = 4;
const TEXT_NODE_MIN_FONT_SIZE = 10;

export type AvatarSize = "large" | "medium" | "small" | "xs";
export type AvatarGapSize = "medium" | "large";

export interface AvatarProps {
  size?: AvatarSize;
  gapSize?: AvatarGapSize;
  shape?: "circle" | "round-square";
  src?: string;
  alt?: string;
  icon?: GeneralIconProps;
  name?: string;
  bordered?: boolean;
  showName?: boolean;
}

/**
 * 头像构件，支持图片、图标、文本三种展示模式，图片加载失败时自动降级为图标或文本；文本模式会根据容器宽度自动缩放字号
 * @en An avatar brick that supports three display modes: image, icon, and text; when the image fails to load it automatically falls back to an icon or text, and in text mode the font size is automatically scaled according to the container width
 * @part avatar - 头像容器
 * @partEn avatar - The avatar container
 * @part avatar-img - 显示为图片时的头像容器
 * @partEn avatar-img - The avatar container when displayed as an image
 * @part avatar-icon - 显示为图标时的头像容器
 * @partEn avatar-icon - The avatar container when displayed as an icon
 * @part avatar-text - 显示为文本时的头像容器
 * @partEn avatar-text - The avatar container when displayed as text
 * @part name - 用户名
 * @partEn name - The user name
 * @category display-component
 */
export
@defineElement("eo-avatar", {
  styleTexts: [styleText],
})
class EoAvatar extends ReactNextElement implements AvatarProps {
  /**
   * 尺寸
   * @en Size
   */
  @property() accessor size: AvatarSize = "medium";

  /**
   * 头像和名称间距大小
   * @en Spacing between the avatar and the name
   *
   * @default "medium"
   */
  @property({ render: false }) accessor gapSize: "medium" | "large" | undefined;

  /**
   * 形状
   * @en Shape
   */
  @property() accessor shape: "circle" | "round-square" = "circle";

  /**
   * 图片地址
   * @en Image address
   */
  @property() accessor src: string | undefined;

  /**
   * 图像无法显示时的替代文本
   * @en Alternative text when the image cannot be displayed
   */
  @property() accessor alt: string | undefined;

  /**
   * 图标
   * @en Icon
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 用户名
   * @en User name
   */
  @property() accessor name: string | undefined;

  /**
   * 是否有边框
   * @en Whether there is a border
   */
  @property({
    type: Boolean,
  })
  accessor bordered: boolean | undefined;

  /**
   * 是否展示名称
   * @en Whether to show the name
   */
  @property({
    type: Boolean,
  })
  accessor showName: boolean | undefined;

  render() {
    return (
      <EoAvatarComponent
        size={this.size}
        shape={this.shape}
        src={this.src}
        alt={this.alt}
        icon={this.icon}
        name={this.name}
        bordered={this.bordered}
        showName={this.showName}
      />
    );
  }
}

export function EoAvatarComponent(props: AvatarProps) {
  const { shape, size, src, alt, icon, name, bordered } = props;

  const avatarNodeRef = useRef<HTMLSpanElement>(null);
  const textNodeRef = useRef<HTMLSpanElement>(null);

  const [isImgLoadError, setIsImgLoadError] = useState<boolean>();
  const [textNodeScale, setTextNodeScale] = useState(1);
  const [textNodeHidden, setTextNodeHidden] = useState(false);
  const [showName, setShowName] = useState(name);

  useEffect(() => {
    setShowName(name);
    setTextNodeHidden(false);
  }, [name]);

  const handleImgLoadError = () => {
    setIsImgLoadError(true);
  };

  // istanbul ignore next
  const onTextNodeResize = useCallback(
    (e: CustomEvent<{ entries: ResizeObserverEntry[] }>) => {
      for (const entry of e.detail.entries) {
        if (entry.target === textNodeRef.current) {
          setTextNodeHidden(true);
          const textNodeWidth = textNodeRef.current.offsetWidth;
          const textNodeHeight = textNodeRef.current.offsetHeight;
          const avatarNodeWidth = avatarNodeRef.current?.offsetWidth;

          if (avatarNodeWidth && textNodeWidth) {
            if (avatarNodeWidth > TEXT_NODE_PADDING * 2) {
              let _scale =
                (avatarNodeWidth - TEXT_NODE_PADDING * 2) / textNodeWidth;
              _scale = _scale > 1 ? 1 : _scale;
              const fontSize = textNodeHeight * _scale;
              if (
                fontSize < TEXT_NODE_MIN_FONT_SIZE &&
                showName &&
                showName.length > 2
              ) {
                setShowName((pre) => pre?.slice(0, -1));
                return;
              } else {
                setTextNodeScale(_scale);
                setTextNodeHidden(false);
                return;
              }
            }
          }
          setTextNodeHidden(false);
        }
      }
    },
    [showName]
  );

  const Img = useMemo(() => {
    setIsImgLoadError(false);
    return (
      <img
        src={src}
        alt={alt}
        onError={handleImgLoadError}
        className="avatar-img"
      />
    );
  }, [src, alt]);

  const Icon = useMemo(() => {
    return <WrappedIcon className="avatar-icon" {...icon!} />;
  }, [icon]);

  const Text = useMemo(() => {
    return (
      <WrappedSlResizeObserver onSlResize={onTextNodeResize}>
        <span
          ref={textNodeRef}
          className="avatar-text"
          style={{
            transform: `scale(${textNodeScale})`,
            visibility: textNodeHidden ? "hidden" : "visible",
          }}
        >
          {showName}
        </span>
      </WrappedSlResizeObserver>
    );
  }, [showName, textNodeHidden, textNodeScale, onTextNodeResize]);

  let type: "img" | "icon" | "text";
  let avatarNode: ReactElement;
  if (src && !isImgLoadError) {
    type = "img";
    avatarNode = Img;
  } else if (icon) {
    type = "icon";
    avatarNode = Icon;
  } else {
    type = "text";
    avatarNode = Text;
  }

  return (
    <>
      <span
        className={classNames(
          "avatar",
          `shape-${shape}`,
          `size-${size}`,
          `type-${type}`,
          {
            bordered: !!bordered,
          }
        )}
        ref={avatarNodeRef}
        part={`avatar avatar-${type}`}
        title={name}
      >
        {avatarNode}
      </span>
      {props.showName && (
        <span className="name" part="name">
          {name}
        </span>
      )}
    </>
  );
}
