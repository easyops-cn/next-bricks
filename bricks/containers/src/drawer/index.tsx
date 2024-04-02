import React, { useEffect, useMemo, useRef, CSSProperties } from "react";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { createDecorators, type EventEmitter } from "@next-core/element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import classNames from "classnames";
import type { Placement } from "../interface.js";
import "@next-core/theme";
import styleText from "./drawer.shadow.css";
import { unwrapProvider } from "@next-core/utils/general";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);
export interface DrawerEvents {
  close?: Event;
  open?: Event;
}

export interface DrawerMapEvents {
  onClose: "drawer.close";
  onOpen: "drawer.open";
}

interface DrawerProps {
  curElement?: HTMLElement;
  customTitle?: string;
  width?: number;
  height?: number;
  closable?: boolean;
  placement?: Placement;
  mask?: boolean;
  maskClosable?: boolean;
  visible?: boolean;
  footerSlot?: boolean;
  scrollToTopWhenOpen?: boolean;
}
const { defineElement, property, event, method } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

/**
 * 通用抽屉构件
 * @author sailor
 * @slot - 抽屉内容插槽
 * @slot headerLeft - 头部左上角
 * @slot extra - 头部右上角
 * @slot footer - 抽屉底部插槽
 * @category container-display
 */
@defineElement("eo-drawer", {
  styleTexts: [styleText],
  alias: ["containers.general-drawer"],
})
class Drawer extends ReactNextElement implements DrawerProps {
  /**
   * 标题
   */
  @property() accessor customTitle: string | undefined;

  /**
   * 宽度(placement为left，right时生效)
   */
  @property({
    type: Number,
  })
  accessor width: number | undefined;

  /**
   * 高度(placement为top，bottom时生效)
   */
  @property({
    type: Number,
  })
  accessor height: number | undefined;

  /**
   * 是否显示右上角的关闭按钮
   */
  @property({
    type: Boolean,
  })
  accessor closable: boolean | undefined;

  /**
   * 是否展示遮罩层
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor mask: boolean | undefined;

  /**
   * 点击遮罩层是否关闭抽屉
   */
  @property({
    type: Boolean,
  })
  accessor maskClosable: boolean | undefined;

  /**
   * 抽屉是否显示
   */
  @property({
    type: Boolean,
  })
  accessor visible: boolean | undefined;

  /**
   * 是否存在底层插槽
   */
  @property({
    type: Boolean,
  })
  accessor footerSlot: boolean | undefined;

  /**
   * 抽屉方向
   */
  @property() accessor placement: Placement | undefined;

  /**
   * 打开抽屉时内容区是否自动滚动到顶部
   */
  @property({ attribute: false })
  accessor scrollToTopWhenOpen = true;

  /**
   * 自定义遮罩层的样式
   */
  @property({ attribute: false })
  accessor maskStyle = {};

  /**
   * 抽屉开启事件
   */
  @event({ type: "open" })
  accessor #drawerOpenEvent!: EventEmitter<void>;

  #handleDrawerOpen = () => {
    this.visible = true;
    this.#drawerOpenEvent.emit();
  };

  /**
   * 抽屉关闭事件
   */
  @event({ type: "close" })
  accessor #drawerCloseEvent!: EventEmitter<void>;

  #handleDrawerClose = () => {
    this.visible = false;
    this.#drawerCloseEvent.emit();
  };

  /**
   * 抽屉开启方法
   */
  @method()
  open() {
    this.#handleDrawerOpen();
  }

  /**
   * 抽屉关闭方法
   */
  @method()
  close() {
    this.#handleDrawerClose();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
  }

  render() {
    return (
      <DrawerComponent
        customTitle={this.customTitle}
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
      />
    );
  }
}

interface DrawerComponentProps extends DrawerProps {
  onDrawerClose: () => void;
  maskStyle?: CSSProperties;
}

export function DrawerComponent({
  customTitle,
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
}: DrawerComponentProps) {
  const contentRef = useRef<HTMLDivElement>();
  const header = useMemo(
    () => (
      <div className="drawer-header">
        <div className="drawer-header-left">
          <span className="drawer-title">{customTitle}</span>
          <slot name="headerLeft"></slot>
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
    ),
    [closable, customTitle, onDrawerClose]
  );

  const mergeMaskStyle = {
    backgroundColor: "var(--antd-modal-mask-bg)",
    ...maskStyle,
  } as CSSProperties;

  useEffect(() => {
    lockBodyScroll(curElement, open);
    scrollToTopWhenOpen && open && contentRef.current?.scrollTo(0, 0);
  }, [open]);
  return (
    <div
      className={classNames("drawer", `drawer-${placement}`, {
        open: open,
      })}
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
        <div className="drawer-content">
          {header}
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
