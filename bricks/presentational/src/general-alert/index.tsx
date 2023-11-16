import React, { useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { getHistory } from "@next-core/runtime";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { AlertType, LOCAL_STORAGE_PREFIX, alertTypeMap } from "./constants.js";
import classNames from "classnames";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface GeneralAlertProps {
  type: AlertType;
  hasTitle?: boolean;
  closable?: boolean;
  localStorageKey?: string;
  disableUrlNamespace?: boolean;
  removeHostNode?: () => void;
}

/**
 * 告警提示
 * @author nlicro
 * @slot - 内容区
 * @slot title - 标题
 * @category display-component
 */
export
@defineElement("eo-alert", {
  styleTexts: [styleText],
  alias: ["presentational.general-alert"],
})
class GeneralAlert extends ReactNextElement implements GeneralAlertProps {
  /**
   * 警告类型
   */
  @property({
    attribute: false,
  })
  accessor type: AlertType;

  /**
   * 是否显示标题。开启后，可以使用 `title` 插槽
   */
  @property({
    type: Boolean,
  })
  accessor hasTitle: boolean | undefined;

  /**
   * 是否显示关闭按钮
   */
  @property({
    type: Boolean,
  })
  accessor closable: boolean | undefined;

  /**
   * 以该值和页面 url 作为命名空间，决定是否显示该警告提示
   */
  @property()
  accessor localStorageKey: string | undefined;

  /**
   * 关闭后仅以 `localStorageKey` 作为命名空间
   */
  @property({
    type: Boolean,
  })
  accessor disableUrlNamespace: boolean | undefined;

  #removeHostNode = () => {
    this.remove();
  };

  render() {
    return (
      <GeneralAlertComponent
        type={this.type}
        hasTitle={this.hasTitle}
        closable={this.closable}
        localStorageKey={this.localStorageKey}
        disableUrlNamespace={this.disableUrlNamespace}
        removeHostNode={this.#removeHostNode}
      />
    );
  }
}

export function GeneralAlertComponent(props: GeneralAlertProps) {
  const {
    type,
    hasTitle,
    closable,
    localStorageKey,
    disableUrlNamespace,
    removeHostNode,
  } = props;

  const storage = useMemo(() => new JsonStorage(localStorage), []);
  const nameSpace = useMemo(() => {
    if (localStorageKey) {
      const url = getHistory().location.pathname;
      const key = disableUrlNamespace
        ? `${LOCAL_STORAGE_PREFIX}_${localStorageKey}`
        : `${LOCAL_STORAGE_PREFIX}_${localStorageKey}_${url}`;
      return key;
    }
    return null;
  }, [disableUrlNamespace, localStorageKey]);

  const curTypeInfo = useMemo(() => alertTypeMap[type], [type]);
  const [hidden, setHidden] = useState(() => {
    if (closable && nameSpace) {
      return !!storage.getItem(nameSpace);
    }
    return false;
  });

  return hidden ? null : (
    <div
      className={classNames(
        "alert-wrapper",
        hasTitle ? "alert-wrapper-has-title" : "alert-wrapper-no-title"
      )}
      style={{ background: curTypeInfo?.bgColor }}
    >
      <WrappedIcon
        {...((hasTitle
          ? curTypeInfo?.outlinedIcon
          : curTypeInfo?.filledIcon) as GeneralIconProps)}
        className="alert-icon"
        style={{ color: curTypeInfo?.color }}
      />
      <div className="alert-container">
        {hasTitle && (
          <div className="alert-title">
            <slot name="title" />
          </div>
        )}
        <div className="alert-content">
          <slot />
        </div>
      </div>
      {closable && (
        <WrappedIcon
          lib="antd"
          theme="outlined"
          icon="close"
          className="close-icon"
          onClick={() => {
            setHidden(true);
            storage.setItem(nameSpace, true);
            removeHostNode?.();
          }}
        />
      )}
    </div>
  );
}
