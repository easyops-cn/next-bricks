import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type {
  EoAvatar,
  AvatarProps,
  AvatarSize,
  AvatarGapSize,
} from "../avatar/index.js";
import { useUserInfoByNameOrInstanceId } from "./useUserInfoByNameOrInstanceId.js";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedAvatar = wrapBrick<EoAvatar, AvatarProps>("eo-avatar");

export interface EoEasyopsAvatarProps {
  nameOrInstanceId?: string;
  size?: AvatarSize;
  gapSize?: AvatarGapSize;
  bordered?: boolean;
  showName?: boolean;
}

/**
 * EasyOps 头像
 *
 * @part eo-avatar - eo-avatar 元素
 * @part avatar - 头像容器
 * @part avatar-img - 显示为图片时的头像容器
 * @part avatar-icon - 显示为图标时的头像容器
 * @part avatar-text - 显示为文本时的头像容器
 * @part name - 用户名
 * @category display-component
 */
export
@defineElement("eo-easyops-avatar", {
  styleTexts: [styleText],
})
class EoEasyopsAvatar extends ReactNextElement implements EoEasyopsAvatarProps {
  /**
   * 用户名或 instanceId
   */
  @property() accessor nameOrInstanceId: string | undefined;

  /**
   * 尺寸
   */
  @property() accessor size: AvatarSize = "medium";

  /**
   * 头像和名称间距大小
   *
   * @default "medium"
   */
  @property() accessor gapSize: AvatarGapSize | undefined;

  /**
   * 是否有边框
   */
  @property({
    type: Boolean,
  })
  accessor bordered: boolean | undefined;

  /**
   * 是否展示用户名称
   */
  @property({
    type: Boolean,
  })
  accessor showName: boolean | undefined;

  render() {
    return (
      <EoEasyopsAvatarComponent
        nameOrInstanceId={this.nameOrInstanceId}
        size={this.size}
        bordered={this.bordered}
        showName={this.showName}
      />
    );
  }
}

export function EoEasyopsAvatarComponent(props: EoEasyopsAvatarProps) {
  const { nameOrInstanceId, size, gapSize, bordered, showName } = props;

  const { user } = useUserInfoByNameOrInstanceId(nameOrInstanceId);

  return (
    <WrappedAvatar
      src={user?.user_icon}
      name={user?.name}
      size={size}
      gapSize={gapSize}
      bordered={bordered}
      showName={showName}
      part="eo-avatar"
      exportparts="avatar, avatar-img, avatar-icon, avatar-text, name"
    />
  );
}
