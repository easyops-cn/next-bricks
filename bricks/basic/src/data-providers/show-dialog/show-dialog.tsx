import React, { useCallback, useMemo, useRef, useState } from "react";
import { createProviderClass } from "@next-core/utils/general";
import { i18n, initializeI18n } from "@next-core/i18n";
import { createRoot } from "react-dom/client";
import { wrapBrick } from "@next-core/react-element";
import type { AntdIcon, AntdIconProps } from "@next-bricks/icons/antd-icon";
import { K, NS, locales } from "./i18n.js";
import { SlDialogElement, WrappedSlDialog } from "./sl-dialog.js";
import { Button, ButtonProps } from "../../button/index.js";
import type { ReactNextElement } from "@next-core/react-element";
import { get } from "lodash";
import styles from "./dialog.module.css";

initializeI18n(NS, locales);

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedAntdIcon = wrapBrick<AntdIcon, AntdIconProps>("eo-antd-icon");

interface InputProps {
  value?: string;
}
interface InputEvents {
  change: CustomEvent<string>;
}
interface InputEventsMap {
  onValueChange: "change";
}
const WrappedInput = wrapBrick<
  ReactNextElement,
  InputProps,
  InputEvents,
  InputEventsMap
>("eo-input", {
  onValueChange: "change",
});

export interface DialogOptions {
  /** 对话框类型 */
  type?: "success" | "error" | "warn" | "info" | "confirm" | "delete";
  title?: string;
  content: string;
  expect?: string;
  contentStyle?: React.CSSProperties;
}

const parseTemplate = (template: string, context: Record<string, any>) => {
  const unMatched: string[] = [];
  const matched: string[] = [];

  let restTemplate = template;
  let lastMatchInfo;

  while ((lastMatchInfo = restTemplate.match(/{{(.*?)}}/)) !== null) {
    const match = lastMatchInfo[0];
    const matchIndex = lastMatchInfo.index!;
    const key = lastMatchInfo[1].trim();
    const value = get(context, key);

    unMatched.push(restTemplate.slice(0, matchIndex));
    matched.push(value);
    restTemplate = restTemplate.slice(
      matchIndex + match.length,
      restTemplate.length
    );
  }

  unMatched.push(restTemplate);

  return (
    <>
      {unMatched.map((str, index) => {
        return (
          <React.Fragment key={index}>
            {str}
            {matched[index] ? (
              <strong className={styles.strong}>{matched[index]}</strong>
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

/**
 * 显示对话框。
 *
 * @param options 选项
 */
export function showDialog(options: DialogOptions): Promise<void> {
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
      {...options}
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
  expect,
  contentStyle,
  onOk,
  onCancel,
  onHide,
}: DialogOptions & {
  onOk?(): void;
  onCancel?(): void;
  onHide?(): void;
}) {
  const ref = useRef<SlDialogElement | null>(null);
  const [confirmDisabled, setConfirmDisabled] = useState(!!expect);
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
      case "delete":
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
    if (confirmDisabled) return;
    ref.current?.hide();
    onOk?.();
  }, [onOk, confirmDisabled]);

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
        <div style={{ flex: 1 }}>
          {title && <div className={styles.contentTitle}>{title}</div>}
          <div style={contentStyle}>{parseTemplate(content, { expect })}</div>
          {expect && (
            <WrappedInput
              auto-focus={true}
              className={styles.expectInput}
              onValueChange={(e) => setConfirmDisabled(e.detail !== expect)}
            />
          )}
        </div>
      </div>
      {(type === "confirm" || type === "delete") && (
        <WrappedButton slot="footer" type="text" onClick={onCancelClick}>
          {i18n.t(`${NS}:${K.CANCEL}`)}
        </WrappedButton>
      )}
      <WrappedButton
        slot="footer"
        type="primary"
        danger={type === "delete"}
        disabled={confirmDisabled}
        onClick={onOkClick}
      >
        {i18n.t(`${NS}:${type === "delete" ? K.DELETE : K.OK}`)}
      </WrappedButton>
    </WrappedSlDialog>
  );
}

customElements.define("basic.show-dialog", createProviderClass(showDialog));
