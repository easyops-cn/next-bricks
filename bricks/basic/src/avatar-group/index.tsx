import React, { useEffect, useRef } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { AvatarSize } from "../avatar";

const { defineElement, property } = createDecorators();

export interface EoAvatarGroupProps {
  size?: AvatarSize;
}

/**
 * 头像组
 */
export
@defineElement("eo-avatar-group", {
  styleTexts: [styleText],
})
class EoAvatarGroup extends ReactNextElement implements EoAvatarGroupProps {
  /**
   * 尺寸
   */
  @property() accessor size: AvatarSize | undefined;

  render() {
    return <EoAvatarGroupComponent size={this.size} />;
  }
}

export function EoAvatarGroupComponent(props: EoAvatarGroupProps) {
  const { size } = props;
  const slotRef = useRef<HTMLSlotElement>(null);

  const updateAvatar = () => {
    const avatarItems = [...slotRef.current!.assignedElements()].filter(
      (element) => isAvatar(element)
    );

    avatarItems.forEach((avatar: any) => {
      avatar.bordered = true;
      if (size) {
        avatar.size = size;
      }
    });
  };

  useEffect(() => {
    const slot = slotRef.current;
    const handleSlotChange = () => {
      updateAvatar();
    };

    slot?.addEventListener("slotchange", handleSlotChange);

    return () => {
      slot?.removeEventListener("slotchange", handleSlotChange);
    };
  }, []);

  useEffect(() => {
    updateAvatar();
  }, [size]);

  return <slot ref={slotRef} />;
}

function isAvatar(element: Element) {
  return ["EO-AVATAR", "EO-EASYOPS-AVATAR"].includes(element.tagName);
}
