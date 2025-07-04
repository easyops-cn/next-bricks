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
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import { unwrapProvider } from "@next-core/utils/general";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";
import type { requireModalStack as _requireModalStack } from "@next-bricks/basic/data-providers/require-modal-stack";
import styleText from "./modal.shadow.css";

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

const requireModalStack = unwrapProvider<typeof _requireModalStack>(
  "basic.require-modal-stack"
);

export interface ModalProps {
  curElement?: HTMLElement;
  modalTitle?: string;
  width?: string | number;
  maskClosable?: boolean;
  confirmText?: string;
  cancelText?: string;
  hideCancelButton?: boolean;
  fullscreen?: boolean;
  confirmDisabled?: boolean;
  confirmDanger?: boolean;
  closeWhenConfirm?: boolean;
  visible?: boolean;
  stackable?: boolean;
  keyboard?: boolean;
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
   */
  @property() accessor width: string | number | undefined;

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
        maskClosable={this.maskClosable}
        visible={this.visible}
        confirmText={this.confirmText}
        cancelText={this.cancelText}
        hideCancelButton={this.hideCancelButton}
        fullscreen={this.fullscreen}
        confirmDisabled={this.confirmDisabled}
        confirmDanger={this.confirmDanger}
        closeWhenConfirm={this.closeWhenConfirm}
        onModalClose={this.#closeModal}
        onModalConfirm={this.#handleModelConfirm}
        onModalCancel={this.#handleModelCancel}
        curElement={this}
        keyboard={this.keyboard}
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
  maskClosable,
  confirmText = "确定",
  cancelText = "取消",
  hideCancelButton,
  visible: open = false,
  fullscreen,
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
}: ModalComponentProps) {
  const modalStack = useMemo(() => requireModalStack(), []);

  useEffect(() => {
    return () => {
      modalStack.pull();
    };
  }, [modalStack]);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(open);

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
        <WrappedIcon
          className="close-btn"
          lib="antd"
          theme="outlined"
          icon="close"
          onClick={onModalClose}
          data-testid="close-button"
        />
      </div>
    ),
    [modalTitle, onModalClose]
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
    () => (
      <div className="modal-footer">
        <slot name="footer"></slot>
        <div className="modal-footer-buttons">
          {!hideCancelButton && (
            <WrappedButton
              type="text"
              onClick={handleCancelClick}
              data-testid="cancel-button"
            >
              {cancelText}
            </WrappedButton>
          )}
          <WrappedButton
            type="primary"
            danger={confirmDanger}
            disabled={confirmDisabled}
            onClick={handleConfirmClick}
            data-testid="confirm-button"
          >
            {confirmText}
          </WrappedButton>
        </div>
      </div>
    ),
    [
      hideCancelButton,
      cancelText,
      confirmText,
      confirmDisabled,
      confirmDanger,
      handleCancelClick,
      handleConfirmClick,
    ]
  );

  const [zIndex, setZIndex] = useState<number>(undefined);
  useEffect(
    () => {
      lockBodyScroll(curElement, open);
      setIsOpen(open);
      if (open) {
        modalStack.push();
      } else {
        modalStack.pull();
      }

      if (stack && stackable) {
        if (open) {
          setZIndex(stack.push());
        } else {
          stack.pull();
          setZIndex(undefined);
        }
      }
    },
    // Only re-run the effect if open changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [open]
  );

  useEffect(() => {
    if (!open || !keyboard) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      const key =
        event.key ||
        /* istanbul ignore next: compatibility */ event.keyCode ||
        /* istanbul ignore next: compatibility */ event.which;
      if (modalStack.isTop() && (key === "Escape" || key === 27)) {
        onModalClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [keyboard, onModalClose, open, modalStack]);

  return isOpen ? (
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
          })}
          style={{ width: width }}
        >
          <div className="modal-container" ref={containerRef}>
            {header}
            {body}
            {footer}
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
