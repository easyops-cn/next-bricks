import React, { useCallback, useMemo, useRef } from "react";
import { createProviderClass } from "@next-core/utils/general";
import { i18n, initializeI18n } from "@next-core/i18n";
import { createRoot } from "react-dom/client";
import { K, NS, locales } from "./i18n.js";
import {
  SlDialogElement,
  WrappedSlButton,
  WrappedSlDialog,
  WrappedSlIcon,
} from "./sl-dialog.js";
import styles from "./dialog.module.css";

initializeI18n(NS, locales);

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
          name: "check2-circle",
          color: styles.success,
        };
      case "error":
        return {
          name: "exclamation-octagon",
          color: styles.danger,
        };
      case "warn":
      case "confirm":
        return {
          name: "exclamation-triangle",
          color: styles.warning,
        };
      case "info":
        return {
          name: "info-circle",
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
            <WrappedSlIcon name={icon.name} />
          </div>
        )}
        <div>
          {title && <div className={styles.contentTitle}>{title}</div>}
          <div style={contentStyle}>{content}</div>
        </div>
      </div>
      {type === "confirm" && (
        <WrappedSlButton slot="footer" onClick={onCancelClick}>
          {i18n.t(`${NS}:${K.CANCEL}`)}
        </WrappedSlButton>
      )}
      <WrappedSlButton slot="footer" variant="primary" onClick={onOkClick}>
        {i18n.t(`${NS}:${K.OK}`)}
      </WrappedSlButton>
    </WrappedSlDialog>
  );
}

customElements.define("basic.show-dialog", createProviderClass(showDialog));
