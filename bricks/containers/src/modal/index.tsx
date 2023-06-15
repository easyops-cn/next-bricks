import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import classNames from "classnames";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import styleText from "./modal.shadow.css";

/**
 * Wrap usage:
 *
 * ```ts
 * import type { Modal, ModalProps, ModalEvents, ModalMapEvents } from "@next-bricks/basic/modal";
 *
 * const WrappedModal = wrapBrick<Modal, ModalProps, ModalEvents, ModalMapEvents>("containers.general-modal", {
 *   onClose: "close",
 *   onConfirm: "confirm",
 *   onCancel: "cancel",
 * });
 *
 * <WrappedModal
 *  modalTitle="..."
 *  onClose={() => { ... }}
 * />
 * ```
 */

export interface ModalProps {
  modalTitle?: string;
  width?: string | number;
  maskClosable?: boolean;
  confirmText?: string;
  cancelText?: string;
  hideCancelButton?: boolean;
  fullscreen?: boolean;
  confirmDisabled?: boolean;
  closeWhenConfirm?: boolean;
  visible?: boolean;
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
const WrappedButton = wrapBrick<Button, ButtonProps>("basic.general-button");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>(
  "icons.general-icon"
);

const { defineElement, property, event, method } = createDecorators();

@defineElement("containers.general-modal", {
  styleTexts: [styleText],
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
   * 是否隐藏取消按钮
   */
  @property({ type: Boolean }) accessor hideCancelButton: boolean | undefined;

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
    this.visible = true;
    this.#handleModelOpen();
  }

  /**
   * 关闭模态框方法
   */
  @method({ bound: true })
  close() {
    this.visible = false;
    this.#handleModelClose();
  }

  #closeModal = () => {
    this.visible = false;
    this.#handleModelClose();
  };

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
        closeWhenConfirm={this.closeWhenConfirm}
        onModalClose={this.#closeModal}
        onModalConfirm={this.#handleModelConfirm}
        onModalCancel={this.#handleModelCancel}
      />
    );
  }
}

export { Modal };

interface ModalComponentProps extends ModalProps {
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
  onModalConfirm,
  onModalCancel,
  onModalClose,
}: ModalComponentProps) {
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
        {!hideCancelButton && (
          <WrappedButton type="text" onClick={handleCancelClick}>
            {cancelText}
          </WrappedButton>
        )}
        <WrappedButton
          type="primary"
          disabled={confirmDisabled}
          onClick={handleConfirmClick}
        >
          {confirmText}
        </WrappedButton>
      </div>
    ),
    [
      hideCancelButton,
      cancelText,
      confirmText,
      confirmDisabled,
      handleCancelClick,
      handleConfirmClick,
    ]
  );

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  return isOpen ? (
    <div className="modal">
      <div className="mask" />
      <div className="modal-wrap" onClick={handleWrapperClick}>
        <div
          className={classNames("modal-container", {
            fullscreen,
          })}
          style={{
            width: width,
          }}
          ref={containerRef}
        >
          {header}
          {body}
          {footer}
        </div>
      </div>
    </div>
  ) : null;
}
