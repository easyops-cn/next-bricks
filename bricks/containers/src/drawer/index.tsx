import React, { useEffect, useRef, CSSProperties, useState } from "react";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { createDecorators, type EventEmitter } from "@next-core/element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import { unwrapProvider } from "@next-core/utils/general";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";
import { instantiateModalStack, type ModalStack } from "@next-core/runtime";
import classNames from "classnames";
import "@next-core/theme";
import type { Placement } from "../interface.js";
import styleText from "./drawer.shadow.css";

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

export interface DrawerEvents {
  close?: Event;
  open?: Event;
}

export interface DrawerMapEvents {
  onClose: "close";
  onOpen: "open";
}

export interface DrawerProps {
  curElement?: HTMLElement;
  customTitle?: string;
  subTitle?: string;
  width?: number | string;
  height?: number | string;
  closable?: boolean;
  placement?: Placement;
  mask?: boolean;
  maskClosable?: boolean;
  visible?: boolean;
  footerSlot?: boolean;
  scrollToTopWhenOpen?: boolean;
  stackable?: boolean;
  maskStyle?: CSSProperties;
  keyboard?: boolean;
  themeVariant?: "default" | "elevo";
}

const { defineElement, property, event, method } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

/**
 * 通用抽屉构件
 * @en A general-purpose drawer brick
 * @author sailor
 * @slot - 抽屉内容插槽
 * @slotEn - The drawer content slot
 * @slot headerLeft - 头部左上角（标题右侧）
 * @slotEn headerLeft - The top-left of the header (to the right of the title)
 * @slot extra - 头部右上角（关闭按钮左侧）
 * @slotEn extra - The top-right of the header (to the left of the close button)
 * @slot footer - 抽屉底部插槽
 * @slotEn footer - The drawer footer slot
 * @category container-display
 */
@defineElement("eo-drawer", {
  styleTexts: [styleText],
  alias: ["containers.general-drawer"],
})
class Drawer extends ReactNextElement implements DrawerProps {
  /**
   * 标题
   * @en Title
   */
  @property() accessor customTitle: string | undefined;

  /**
   * 副标题
   * @en Subtitle
   */
  @property() accessor subTitle: string | undefined;

  /**
   * 宽度(placement为left，right时生效)
   * @en Width (takes effect when `placement` is left or right)
   */
  @property({ attribute: false })
  accessor width: number | string | undefined;

  /**
   * 高度(placement为top，bottom时生效)
   * @en Height (takes effect when `placement` is top or bottom)
   */
  @property({ attribute: false })
  accessor height: number | string | undefined;

  /**
   * 是否显示右上角的关闭按钮
   * @en Whether to show the close button in the top-right corner
   */
  @property({
    type: Boolean,
  })
  accessor closable: boolean | undefined;

  /**
   * 是否展示遮罩层
   * @en Whether to show the mask
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor mask: boolean | undefined;

  /**
   * 点击遮罩层是否关闭抽屉
   * @en Whether clicking the mask closes the drawer
   */
  @property({
    type: Boolean,
  })
  accessor maskClosable: boolean | undefined;

  /**
   * 抽屉是否显示
   * @en Whether the drawer is displayed
   */
  @property({
    type: Boolean,
  })
  accessor visible: boolean | undefined;

  /**
   * 是否存在底部插槽，启用后显示 footer 插槽区域
   * @en Whether a footer slot exists; when enabled, the footer slot area is displayed
   */
  @property({
    type: Boolean,
  })
  accessor footerSlot: boolean | undefined;

  /**
   * 抽屉弹出方向，可选 "left" | "right" | "top" | "bottom"
   * @en Direction from which the drawer pops up; can be "left" | "right" | "top" | "bottom"
   */
  @property() accessor placement: Placement | undefined;

  /**
   * 打开抽屉时内容区是否自动滚动到顶部
   *
   * 注意：仅初始设置有效。
   * @en Whether the content area automatically scrolls to the top when the drawer is opened
   *
   * Note: only the initial setting takes effect.
   */
  @property({ attribute: false })
  accessor scrollToTopWhenOpen = true;

  /**
   * 自定义遮罩层的样式
   * @en Custom mask style
   */
  @property({ attribute: false })
  accessor maskStyle = {};

  /**
   * 是否支持键盘 esc 关闭
   * @en Whether the drawer can be closed with the keyboard ESC key
   */
  @property({ type: Boolean })
  accessor keyboard: boolean | undefined;

  /**
   * 主题变体，可选 "default" | "elevo"，通过 CSS 属性选择器控制样式
   * @en Theme variant; can be "default" | "elevo". The style is controlled via CSS attribute selectors.
   */
  @property({ render: false })
  accessor themeVariant: "default" | "elevo" | undefined;

  /**
   * 是否可堆叠，开启后每次打开抽屉会将新的抽屉置于上层（zIndex ++）
   *
   * 注意：仅初始设置有效。
   * @en Whether it can be stacked; when enabled, each time a drawer is opened, the new drawer is placed on top (zIndex ++)
   *
   * Note: only the initial setting takes effect.
   *
   * @deprecated
   */
  @property({ type: Boolean })
  accessor stackable: boolean | undefined;

  /**
   * @detail 无
   * @detailEn None
   * @description 抽屉开启事件
   * @en The drawer is opened
   */
  @event({ type: "open" })
  accessor #drawerOpenEvent!: EventEmitter<void>;

  #handleDrawerOpen = () => {
    if (this.visible !== true) {
      this.visible = true;
      this.#drawerOpenEvent.emit();
    }
  };

  /**
   * @detail 无
   * @detailEn None
   * @description 抽屉关闭事件
   * @en The drawer is closed
   */
  @event({ type: "close" })
  accessor #drawerCloseEvent!: EventEmitter<void>;

  #handleDrawerClose = () => {
    if (this.visible !== false) {
      this.visible = false;
      this.#drawerCloseEvent.emit();
    }
  };

  /**
   * 抽屉开启方法
   * @en Open the drawer
   */
  @method()
  open(): void {
    this.#handleDrawerOpen();
  }

  /**
   * 抽屉关闭方法
   * @en Close the drawer
   */
  @method()
  close(): void {
    this.#handleDrawerClose();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
    this.#stack?.pull();
  }

  #stack = instantiateModalStack?.();

  render() {
    return (
      <DrawerComponent
        customTitle={this.customTitle}
        subTitle={this.subTitle}
        width={this.width}
        height={this.height}
        closable={this.closable}
        visible={this.visible}
        mask={this.mask}
        maskClosable={this.maskClosable}
        maskStyle={this.maskStyle}
        placement={this.placement}
        footerSlot={this.footerSlot}
        onDrawerClose={this.#handleDrawerClose}
        scrollToTopWhenOpen={this.scrollToTopWhenOpen}
        curElement={this}
        keyboard={this.keyboard}
        themeVariant={this.themeVariant}
        stackable={this.stackable}
        stack={this.#stack}
      />
    );
  }
}

interface DrawerComponentProps extends DrawerProps {
  stack?: ModalStack;
  onDrawerClose: () => void;
}

export function DrawerComponent({
  customTitle,
  subTitle,
  width = 500,
  height = 378,
  closable = true,
  mask = true,
  maskClosable = true,
  maskStyle,
  placement = "right",
  visible: open = false,
  footerSlot = false,
  onDrawerClose,
  scrollToTopWhenOpen,
  curElement,
  stackable,
  stack,
  keyboard,
}: DrawerComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>();

  const mergeMaskStyle = {
    backgroundColor: "var(--antd-modal-mask-bg)",
    ...maskStyle,
  } as CSSProperties;

  const previousActiveElement = useRef<Element | null>(null);

  const [zIndex, setZIndex] = useState<number>(undefined);
  useEffect(
    () => {
      lockBodyScroll(curElement, open);
      scrollToTopWhenOpen && open && contentRef.current?.scrollTo(0, 0);

      if (stack && stackable) {
        if (open) {
          setZIndex(stack.push());
        } else {
          stack.pull();
          setZIndex(undefined);
        }
      }

      if (open) {
        let activeElement = document.activeElement;
        while (activeElement?.shadowRoot?.activeElement) {
          activeElement = activeElement.shadowRoot.activeElement;
        }
        previousActiveElement.current = activeElement;
      } else {
        // Restore focus to the previously focused element when the drawer is closed
        if (previousActiveElement.current) {
          (previousActiveElement.current as HTMLElement).focus?.();
          previousActiveElement.current = null;
        }
      }
    },
    // Only re-run the effect if open changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !keyboard || !open) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        onDrawerClose();
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboard, onDrawerClose, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        containerRef.current?.focus();
      }, 0);
    }
  }, [open]);

  return (
    <div
      className={classNames("drawer", `drawer-${placement}`, {
        open,
      })}
      style={{ zIndex }}
    >
      {mask && (
        <div
          className="mask"
          style={mergeMaskStyle}
          onClick={() => maskClosable && onDrawerClose()}
        />
      )}
      <div
        className={classNames("drawer-wrapper", `drawer-wrapper-${placement}`)}
        style={{
          width: ["left", "right"].includes(placement) ? width : "",
          height: ["top", "bottom"].includes(placement) ? height : "",
        }}
      >
        <div className="drawer-content" tabIndex={-1} ref={containerRef}>
          <div className="drawer-header">
            <div className="drawer-header-left">
              {subTitle ? <div className="sub-title">{subTitle}</div> : null}
              <div className="title-wrapper">
                <span className="drawer-title">{customTitle}</span>
                <slot name="headerLeft"></slot>
              </div>
            </div>
            <div className="drawer-header-right">
              <slot name="extra"></slot>
              {closable && (
                <WrappedIcon
                  className="close-btn"
                  lib="antd"
                  theme="outlined"
                  icon="close"
                  onClick={onDrawerClose}
                />
              )}
            </div>
          </div>
          <div className="drawer-body" ref={contentRef}>
            <slot></slot>
          </div>
          {footerSlot && (
            <div className="drawer-footer">
              <slot name="footer"></slot>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export { Drawer };
