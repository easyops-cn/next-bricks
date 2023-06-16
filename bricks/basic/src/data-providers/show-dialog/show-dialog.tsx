import React, { useCallback, useMemo, useRef } from "react";
import { createProviderClass } from "@next-core/utils/general";
import { i18n, initializeI18n } from "@next-core/i18n";
import { createRoot } from "react-dom/client";
import { wrapBrick } from "@next-core/react-element";
import type { AntdIcon, AntdIconProps } from "@next-bricks/icons/antd-icon";
import { K, NS, locales } from "./i18n.js";
import { SlDialogElement, WrappedSlDialog } from "./sl-dialog.js";
import { Button, ButtonProps } from "../../button/index.js";
import styles from "./dialog.module.css";

initializeI18n(NS, locales);

const WrappedButton = wrapBrick<Button, ButtonProps>("basic.general-button");
const WrappedAntdIcon = wrapBrick<AntdIcon, AntdIconProps>("icons.antd-icon");

export interface DialogProps {
  type?: "success" | "error" | "warn" | "info" | "confirm";
  title?: string;
  content: string;
  contentStyle?: React.CSSProperties;
}

export function showDialog(props: DialogProps) {
  const container = document.createElement("div");
  document.body.append(container);
  const root = createRoot(container);

  let onOk: (() => void) | undefined;
  let onCancel: (() => void) | undefined;

  const promise = new Promise<void>((resolve, reject) => {
    onOk = resolve;
    onCancel = reject;
  });

  const onHide = () => {
    root.unmount();
    container.remove();
  };

  root.render(
    <DialogComponent
      {...props}
      onOk={onOk}
      onCancel={onCancel}
      onHide={onHide}
    />
  );

  return promise;
}

export function DialogComponent({
  type,
  title,
  content,
  contentStyle,
  onOk,
  onCancel,
  onHide,
}: DialogProps & {
  onOk?(): void;
  onCancel?(): void;
  onHide?(): void;
}) {
  const ref = useRef<SlDialogElement | null>(null);
  const icon = useMemo(() => {
    switch (type) {
      case "success":
        return {
          icon: "check-circle",
          color: styles.success,
        };
      case "error":
        return {
          icon: "close-circle",
          color: styles.danger,
        };
      case "warn":
      case "confirm":
        return {
          icon: "exclamation-circle",
          color: styles.warning,
        };
      case "info":
        return {
          icon: "info-circle",
          color: styles.primary,
        };
    }
  }, [type]);

  const onSlRequestClose = useCallback((e: Event) => {
    e.preventDefault();
  }, []);

  const onOkClick = useCallback(() => {
    ref.current?.hide();
    onOk?.();
  }, [onOk]);

  const onCancelClick = useCallback(() => {
    ref.current?.hide();
    onCancel?.();
  }, [onCancel]);

  return (
    <WrappedSlDialog
      label={title ?? "Dialog"}
      open
      noHeader
      className={styles.dialog}
      onSlHide={onHide}
      onSlRequestClose={onSlRequestClose}
      ref={ref}
    >
      <div className={styles.body}>
        {icon && (
          <div className={`${styles.icon} ${icon.color}`}>
            <WrappedAntdIcon icon={icon.icon} />
          </div>
        )}
        <div>
          {title && <div className={styles.contentTitle}>{title}</div>}
          <div style={contentStyle}>{content}</div>
        </div>
      </div>
      {type === "confirm" && (
        <WrappedButton slot="footer" onClick={onCancelClick}>
          {i18n.t(`${NS}:${K.CANCEL}`)}
        </WrappedButton>
      )}
      <WrappedButton slot="footer" type="primary" onClick={onOkClick}>
        {i18n.t(`${NS}:${K.OK}`)}
      </WrappedButton>
    </WrappedSlDialog>
  );
}

customElements.define("basic.show-dialog", createProviderClass(showDialog));
