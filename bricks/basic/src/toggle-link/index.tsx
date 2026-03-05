import React from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Link, LinkProps } from "../link/index.js";
import styleText from "./styles.shadow.css";

const WrappedLink = wrapBrick<Link, LinkProps>("eo-link");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const { defineElement, property, event } = createDecorators();

export interface ToggleLinkProps {
  open?: boolean;
  themeVariant?: "default" | "elevo";
}

export interface ToggleLinkEvents {
  toggle: CustomEvent<boolean>;
}

export interface ToggleLinkEventsMapping {
  onToggle: "toggle";
}

/**
 * 展开/折叠链接。
 *
 * @author -
 * @slot - 内容
 * @part link - 链接
 * @part icon - 图标
 *
 * @category interaction
 */
export
@defineElement("eo-toggle-link", {
  styleTexts: [styleText],
})
class ToggleLink extends ReactNextElement implements ToggleLinkProps {
  /**
   * 是否展开
   */
  @property({ type: Boolean, render: false })
  accessor open: boolean | undefined;

  /** 主题变体 */
  @property()
  accessor themeVariant: "default" | "elevo" | undefined;

  /**
   * 切换展开/折叠时触发
   * @detail 当前是否展开
   */
  @event({ type: "toggle" })
  accessor #toggle!: EventEmitter<boolean>;

  #handleToggle = () => {
    this.#toggle.emit((this.open = !this.open));
  };

  render() {
    return (
      <ToggleLinkComponent
        open={this.open}
        themeVariant={this.themeVariant}
        onToggle={this.#handleToggle}
      />
    );
  }
}

interface ToggleLinkComponentProps extends ToggleLinkProps {
  onToggle: () => void;
}

function ToggleLinkComponent({
  themeVariant,
  onToggle,
}: ToggleLinkComponentProps) {
  return (
    <WrappedLink themeVariant={themeVariant} part="link" onClick={onToggle}>
      <slot />
      <WrappedIcon part="icon" className="chevron" lib="fa" icon="angle-down" />
    </WrappedLink>
  );
}
