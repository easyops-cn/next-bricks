import React from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type { EoAvatar, AvatarProps, AvatarSize } from "../avatar/index.js";
import { useUserInfoByNameOrInstanceId } from "./useUserInfoByNameOrInstanceId.js";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedAvatar = wrapBrick<EoAvatar, AvatarProps>("eo-avatar");

export interface EoEasyopsAvatarProps {
  nameOrInstanceId?: string;
  size?: AvatarSize;
}

/**
 * easyops 头像
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

  render() {
    return (
      <EoEasyopsAvatarComponent
        nameOrInstanceId={this.nameOrInstanceId}
        size={this.size}
      />
    );
  }
}

export function EoEasyopsAvatarComponent(props: EoEasyopsAvatarProps) {
  const { nameOrInstanceId, size } = props;

  const { user } = useUserInfoByNameOrInstanceId(nameOrInstanceId);

  return <WrappedAvatar src={user?.user_icon} name={user?.name} size={size} />;
}
