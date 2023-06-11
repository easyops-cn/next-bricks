import React, { useMemo } from "react";
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

export interface DrawerEvents {
  close?: Event;
  open?: Event;
}

export interface DrawerMapEvents {
  onClose: "drawer.close";
  onOpen: "drawer.open";
}

interface DrawerProps {
  customTitle?: string;
  width?: number;
  height?: number;
  closable?: boolean;
  placement?: Placement;
  mask?: boolean;
  maskClosable?: boolean;
  visible?: boolean;
  footerSlot?: boolean;
}
const { defineElement, property, event, method } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

/**
 * 通用抽屉构件
 * @author sailor
 * @slot - 抽屉内容插槽
 * @slot footer - 抽屉底部插槽
 */
@defineElement("containers.general-drawer", {
  styleTexts: [styleText],
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
        placement={this.placement}
        footerSlot={this.footerSlot}
        onDrawerClose={this.#handleDrawerClose}
      />
    );
  }
}

interface DrawerComponentProps extends DrawerProps {
  onDrawerClose: () => void;
}

export function DrawerComponent({
  customTitle,
  width = 500,
  height = 378,
  closable = true,
  mask = true,
  maskClosable = true,
  placement = "right",
  visible: open = false,
  footerSlot = false,
  onDrawerClose,
}: DrawerComponentProps) {
  const header = useMemo(
    () => (
      <div className="drawer-header">
        <span className="drawer-title">{customTitle}</span>
        <div className="drawer-operator">
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

  return (
    <div
      className={classNames("drawer", `drawer-${placement}`, {
        open: open,
      })}
    >
      {mask && (
        <div className="mask" onClick={() => maskClosable && onDrawerClose()} />
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
          <div className="drawer-body">
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
