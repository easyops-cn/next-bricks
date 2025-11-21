import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { instantiateModalStack, type ModalStack } from "@next-core/runtime";
import classNames from "classnames";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";
import { initializeI18n } from "@next-core/i18n";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import { unwrapProvider } from "@next-core/utils/general";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";
import styleText from "./modal.shadow.css";
import { NS, locales, K, t } from "./i18n.js";

initializeI18n(NS, locales);

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

export interface ModalProps {
  curElement?: HTMLElement;
  modalTitle?: string;
  width?: string | number;
  height?: string | number;
  maskClosable?: boolean;
  confirmText?: string;
  cancelText?: string;
  hideCancelButton?: boolean;
  fullscreen?: boolean;
  fullscreenButton?: boolean;
  noFooter?: boolean;
  background?: string;
  headerBordered?: boolean;
  confirmDisabled?: boolean;
  confirmDanger?: boolean;
  closeWhenConfirm?: boolean;
  visible?: boolean;
  stackable?: boolean;
  keyboard?: boolean;
  themeVariant?: "default" | "elevo";
}

export interface ModalEvents {
  open?: Event;
  close?: Event;
  confirm?: Event;
  cancel?: Event;
}

export interface ModalMapEvents {
  onOpen: "open";
  onClose: "close";
  onConfirm: "confirm";
  onCancel: "cancel";
}

// 使用弱关联来引用其他构件，以便按需加载构件，并避免打包可能包含重复文件的问题。
const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

const { defineElement, property, event, method } = createDecorators();

/**
 * 模态框
 * @author sailor
 * @slot - 内容插槽
 * @slot footer - 底部左侧插槽
 * @slot sidebar - 弹窗左侧插槽
 * @category container-display
 */
@defineElement("eo-modal", {
  styleTexts: [styleText],
  alias: ["containers.general-modal"],
})
class Modal extends ReactNextElement implements ModalProps {
  /**
   * 标题
   */
  @property() accessor modalTitle: string | undefined;

  /**
   * 宽度
   *
   * @default "520px"
   */
  @property({ attribute: false }) accessor width: string | number | undefined;

  /**
   * 高度
   */
  @property({ attribute: false }) accessor height: string | number | undefined;

  /**
   * 点击遮罩层是否关闭模态框
   */
  @property({
    type: Boolean,
  })
  accessor maskClosable: boolean | undefined;

  /**
   * 全屏模式
   */
  @property({
    type: Boolean,
  })
  accessor fullscreen: boolean | undefined;

  /**
   * 是否显示全屏按钮
   */
  @property({ type: Boolean })
  accessor fullscreenButton: boolean | undefined;

  /**
   * 是否隐藏底部
   */
  @property({ type: Boolean })
  accessor noFooter: boolean | undefined;

  /**
   * 是否显示头部底边线（themeVariant: elevo 时默认不显示头部底边线）
   */
  @property({ type: Boolean, render: false })
  accessor headerBordered: boolean | undefined;

  /**
   * 背景
   */
  @property()
  accessor background: string | undefined;

  /**
   * 点击确定按钮时自动关闭弹窗
   *
   * @default true
   */
  @property({
    type: Boolean,
  })
  accessor closeWhenConfirm: boolean | undefined;

  /**
   * 确认按钮是否禁用
   */
  @property({
    type: Boolean,
  })
  accessor confirmDisabled: boolean | undefined;

  /**
   * 点击遮罩层是否关闭模态框
   */
  @property({
    type: Boolean,
  })
  accessor visible: boolean | undefined;

  /**
   * 确认按钮文本
   */
  @property() accessor confirmText: string | undefined;

  /**
   * 取消按钮文本
   */
  @property() accessor cancelText: string | undefined;

  /**
   * 确认按钮类型
   */
  @property({ type: Boolean }) accessor confirmDanger: boolean | undefined;

  /**
   * 是否隐藏取消按钮
   */
  @property({ type: Boolean }) accessor hideCancelButton: boolean | undefined;

  /** 是否支持键盘 esc 关闭 */
  @property({ type: Boolean })
  accessor keyboard: boolean | undefined;

  /** 主题变体 */
  @property()
  accessor themeVariant: "default" | "elevo" | undefined;

  /**
   * 是否可堆叠，开启后每次打开抽屉会将新的抽屉置于上层（zIndex ++）
   *
   * 注意：仅初始设置有效。
   *
   * @deprecated
   */
  @property({ type: Boolean })
  accessor stackable: boolean | undefined;

  /**
   * 打开弹窗事件
   */
  @event({ type: "open" }) accessor #modalOpen!: EventEmitter<void>;
  #handleModelOpen() {
    this.#modalOpen.emit();
  }

  /**
   * 关闭弹窗事件
   */
  @event({ type: "close" })
  accessor #modalClose!: EventEmitter<void>;
  #handleModelClose() {
    this.#modalClose.emit();
  }

  /**
   * 确认按钮事件
   */
  @event({ type: "confirm" })
  accessor #modalConfirm!: EventEmitter<void>;
  #handleModelConfirm = (isClose: boolean) => {
    if (this.confirmDisabled) return;
    this.#modalConfirm.emit();
    if (isClose) {
      this.close();
    }
  };

  /**
   * 取消按钮事件
   */
  @event({ type: "cancel" })
  accessor #modalCancel!: EventEmitter<void>;
  #handleModelCancel = () => {
    this.#modalCancel.emit();
    this.close();
  };

  /**
   * 打开模态框方法
   */
  @method()
  open() {
    if (this.visible !== true) {
      this.visible = true;
      this.#handleModelOpen();
    }
  }

  /**
   * 关闭模态框方法
   */
  @method({ bound: true })
  close() {
    if (this.visible !== false) {
      this.visible = false;
      this.#handleModelClose();
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
    this.#stack?.pull();
  }

  #closeModal = () => {
    this.visible = false;
    this.#handleModelClose();
  };

  #stack = instantiateModalStack?.();

  render() {
    return (
      <ModalComponent
        modalTitle={this.modalTitle}
        width={this.width}
        height={this.height}
        maskClosable={this.maskClosable}
        visible={this.visible}
        confirmText={this.confirmText}
        cancelText={this.cancelText}
        hideCancelButton={this.hideCancelButton}
        fullscreen={this.fullscreen}
        fullscreenButton={this.fullscreenButton}
        noFooter={this.noFooter}
        background={this.background}
        confirmDisabled={this.confirmDisabled}
        confirmDanger={this.confirmDanger}
        closeWhenConfirm={this.closeWhenConfirm}
        onModalClose={this.#closeModal}
        onModalConfirm={this.#handleModelConfirm}
        onModalCancel={this.#handleModelCancel}
        curElement={this}
        keyboard={this.keyboard}
        themeVariant={this.themeVariant}
        stackable={this.stackable}
        stack={this.#stack}
      />
    );
  }
}

export { Modal };

interface ModalComponentProps extends ModalProps {
  stack?: ModalStack;
  onModalClose: () => void;
  onModalConfirm: (isClose: boolean) => void;
  onModalCancel: () => void;
}

function ModalComponent({
  modalTitle,
  width,
  height,
  maskClosable,
  confirmText = t(K.CONFIRM),
  cancelText = t(K.CANCEL),
  hideCancelButton,
  visible: open = false,
  fullscreen: propFullscreen,
  fullscreenButton,
  noFooter,
  background,
  confirmDisabled,
  closeWhenConfirm = true,
  confirmDanger,
  onModalConfirm,
  onModalCancel,
  onModalClose,
  curElement,
  stack,
  stackable,
  keyboard,
  themeVariant,
}: ModalComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sidebarSlotRef = useRef<HTMLSlotElement>(null);
  const [hasSidebarContent, setHasSidebarContent] = useState(false);
  const [fullscreen, setFullscreen] = useState(!!propFullscreen);

  useEffect(() => {
    setFullscreen(!!propFullscreen);
  }, [propFullscreen]);

  const handleWrapperClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>): void => {
      if (maskClosable) {
        if (!containerRef.current?.contains(e.target as Element)) {
          onModalClose();
        }
      }
    },
    [maskClosable, onModalClose]
  );

  const handleConfirmClick = useCallback(() => {
    onModalConfirm(closeWhenConfirm);
  }, [onModalConfirm, closeWhenConfirm]);

  const handleCancelClick = useCallback(() => {
    onModalCancel();
  }, [onModalCancel]);

  const header = useMemo(
    () => (
      <div className="modal-header">
        <span className="modal-title">{modalTitle}</span>
        <div className="header-right">
          {fullscreenButton && (
            <>
              <WrappedIcon
                className="fullscreen-btn"
                lib="lucide"
                icon={fullscreen ? "minimize-2" : "maximize-2"}
                onClick={() => {
                  setFullscreen((prev) => !prev);
                }}
                data-testid="fullscreen-button"
              />
              <div className="divider" />
            </>
          )}
          <WrappedIcon
            className="close-btn"
            lib="antd"
            theme="outlined"
            icon="close"
            onClick={onModalClose}
            data-testid="close-button"
          />
        </div>
      </div>
    ),
    [fullscreen, fullscreenButton, modalTitle, onModalClose]
  );

  const body = useMemo(
    () => (
      <div
        className={classNames("modal-body", {
          fullscreen,
        })}
      >
        <slot></slot>
      </div>
    ),
    [fullscreen]
  );

  const footer = useMemo(
    () =>
      noFooter ? null : (
        <div className="modal-footer">
          <slot name="footer"></slot>
          <div className="modal-footer-buttons">
            {!hideCancelButton && (
              <WrappedButton
                type="text"
                onClick={handleCancelClick}
                themeVariant={themeVariant}
                data-testid="cancel-button"
              >
                {cancelText}
              </WrappedButton>
            )}
            <WrappedButton
              type="primary"
              danger={confirmDanger}
              disabled={confirmDisabled}
              themeVariant={themeVariant}
              onClick={handleConfirmClick}
              data-testid="confirm-button"
            >
              {confirmText}
            </WrappedButton>
          </div>
        </div>
      ),
    [
      noFooter,
      hideCancelButton,
      cancelText,
      confirmText,
      confirmDisabled,
      confirmDanger,
      themeVariant,
      handleCancelClick,
      handleConfirmClick,
    ]
  );
  const sidebar = useMemo(
    () => (
      <div className="modal-sidebar">
        <slot name="sidebar" ref={sidebarSlotRef}></slot>
      </div>
    ),
    []
  );

  // 检测 sidebar 插槽是否有内容
  useEffect(() => {
    const checkSidebarContent = () => {
      if (sidebarSlotRef.current) {
        const hasContent = sidebarSlotRef.current.assignedElements().length > 0;
        setHasSidebarContent(hasContent);
      }
    };

    const sidebarSlot = sidebarSlotRef.current;
    if (sidebarSlot) {
      sidebarSlot.addEventListener("slotchange", checkSidebarContent);
    }

    // 当弹窗打开时，延迟检查以确保 DOM 已渲染
    if (open) {
      setTimeout(checkSidebarContent, 0);
    }

    return () => {
      if (sidebarSlot) {
        sidebarSlot.removeEventListener("slotchange", checkSidebarContent);
      }
    };
  }, [open]);

  const previousActiveElement = useRef<Element | null>(null);

  const [zIndex, setZIndex] = useState<number>(undefined);
  useEffect(
    () => {
      lockBodyScroll(curElement, open);

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
        while (activeElement) {
          const activeInShadow = activeElement.shadowRoot?.activeElement;
          if (activeInShadow) {
            activeElement = activeInShadow;
          } else {
            break;
          }
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
        onModalClose();
      }
    };
    container.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboard, onModalClose, open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        containerRef.current?.focus();
      }, 0);
    }
  }, [open]);

  return open ? (
    <div className="modal-root">
      <div className="mask" style={{ zIndex }} />
      <div
        className="modal-wrap"
        style={{ zIndex }}
        onClick={handleWrapperClick}
      >
        <div
          className={classNames("modal", {
            fullscreen,
            "has-sidebar": hasSidebarContent,
            "has-height": !!height || fullscreen,
          })}
          style={
            fullscreen ? { width: "100%", height: "100%" } : { width, height }
          }
        >
          <div
            className="modal-container"
            tabIndex={-1}
            ref={containerRef}
            style={{ background }}
          >
            {sidebar}
            <div className="modal-main-content">
              {header}
              {body}
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
