import React, { ReactElement, useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export type AvatarSize = "large" | "medium" | "small" | "xs";

export interface AvatarProps {
  size?: AvatarSize;
  shape?: "circle" | "round-square";
  src?: string;
  alt?: string;
  icon?: GeneralIconProps;
  name?: string;
}

/**
 * 头像
 * @part avatar - 头像容器
 * @part avatar-img - 显示为图片时的头像容器
 * @part avatar-icon - 显示为图标时的头像容器
 * @part avatar-text - 显示为文本时的头像容器
 */
export
@defineElement("eo-avatar", {
  styleTexts: [styleText],
})
class EoAvatar extends ReactNextElement implements AvatarProps {
  /**
   * 尺寸
   */
  @property() accessor size: AvatarSize = "medium";

  /**
   * 形状
   */
  @property() accessor shape: "circle" | "round-square" = "circle";

  /**
   * 图片地址
   */
  @property() accessor src: string | undefined;

  /**
   * 图像无法显示时的替代文本
   */
  @property() accessor alt: string | undefined;

  /**
   * 图标
   */
  @property({
    attribute: false,
  })
  accessor icon: GeneralIconProps | undefined;

  /**
   * 用户名
   */
  @property() accessor name: string | undefined;

  render() {
    return (
      <EoAvatarComponent
        size={this.size}
        shape={this.shape}
        src={this.src}
        alt={this.alt}
        icon={this.icon}
        name={this.name}
      />
    );
  }
}

export function EoAvatarComponent(props: AvatarProps) {
  const { shape, size, src, alt, icon, name } = props;

  const [isImgLoadError, setIsImgLoadError] = useState<boolean>();

  const handleImgLoadError = () => {
    setIsImgLoadError(true);
  };

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
    return <span className="avatar-text">{name}</span>;
  }, [name]);

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
    <span
      className={classNames(
        "avatar",
        `shape-${shape}`,
        `size-${size}`,
        `type-${type}`
      )}
      part={`avatar avatar-${type}`}
      title={name}
    >
      {avatarNode}
    </span>
  );
}
