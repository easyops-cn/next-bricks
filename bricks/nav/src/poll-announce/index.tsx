/* istanbul ignore file */
import React, { useEffect } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { httpErrorToString } from "@next-core/runtime";
import { unwrapProvider } from "@next-core/utils/general";
import "@next-core/theme";
import { i18n } from "@next-core/i18n";
import { initializeI18n } from "@next-core/i18n";
import type { showNotification as _showNotification } from "@next-bricks/basic/data-providers/show-notification/show-notification";
import {
  AnnounceApi_ignoreAnnounce,
  AnnounceApi_listEffectiveAnnounce,
  AnnounceApi_pollAnnounce,
} from "@next-api-sdk/sys-setting-sdk";
import { K, NS, locales } from "./i18n.js";
import styleText from "./styles.shadow.css";
import styles from "./notification.module.css";

initializeI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const showNotification = unwrapProvider<typeof _showNotification>(
  "basic.show-notification"
);

const ignoredInstanceIds = new Set<string>();

export interface PollAnnounceProps {
  pollEnabled?: boolean;
  realTimeMessage?: Message;
}

export interface Message {
  title: string;
  data: string;
  instanceId: string;
}

/**
 * 轮询获取通知消息并展示。
 *
 *  从 v2 构件 `nav-legacy.poll-announce` 迁移而来
 */
export
@defineElement("nav.poll-announce", {
  styleTexts: [styleText],
})
class PollAnnounce extends ReactNextElement implements PollAnnounceProps {
  /**
   * 是否启用轮询
   *
   * - 启用时，将会不断轮询通知列表接口
   * - 未启用时，通过 `realTimeMessage` 属性传入实时通知消息
   *
   * 注意：v2 构件 `nav-legacy.poll-announce` 该属性名称为 `pollDisabled`，但其实际意义却是 `pollEnabled`，因此在迁移时进行了重命名。
   */
  @property({ type: Boolean })
  accessor pollEnabled: boolean | undefined;

  /**
   * 实时通知消息（通常通过 WebSocket 消息得到）
   */
  @property({ attribute: false })
  accessor realTimeMessage: Message | undefined;

  /**
   * 通知框关闭后，调用忽略通知接口完成后触发
   */
  @event({ type: "notification.close" })
  accessor #closeEvent!: EventEmitter<void>;

  #handleClose = () => {
    this.#closeEvent.emit();
  };

  /**
   * 轮询得到新的通知时触发。
   */
  @event({ type: "notification.open" })
  accessor #openEvent!: EventEmitter<void>;

  #handleOpen = () => {
    this.#openEvent.emit();
  };

  render() {
    return (
      <PollAnnounceComponent
        pollEnabled={this.pollEnabled}
        realTimeMessage={this.realTimeMessage}
        onOpen={this.#handleOpen}
        onClose={this.#handleClose}
      />
    );
  }
}

export interface PollAnnounceComponentProps extends PollAnnounceProps {
  onOpen: () => void;
  onClose: () => void;
}

async function openNotification(
  { title, data, instanceId }: Message,
  onClose: () => void
) {
  const _data = data
    .replace(/<[^>]+>|&nbsp;/gim, "\r\n")
    .replace(/&ldquo;/gim, "“")
    .replace(/&rdquo;/gim, "”");

  const htmlMessage = _data.length > 100 ? _data.slice(0, 100) : _data;

  try {
    await showNotification({
      placement: "topRight",
      icon: {
        lib: "antd",
        theme: "filled",
        icon: "sound",
        style: {
          color: "var(--theme-orange-color)",
        },
      },
      title,
      htmlMessage: `<div class="${styles.message}">${htmlMessage}</div>`,
      closable: true,
      showConfirm: true,
      confirmText: i18n.t(`${NS}:${K.VIEW_DETAILS}`),
      confirmLink: {
        url: `/announcement-management/announcement-front/content?instanceId=${instanceId}`,
        target: "_blank",
      },
      showCancel: true,
      cancelText: i18n.t(`${NS}:${K.DISMISS}`),
    });
  } catch {
    // ignore
  } finally {
    if (!ignoredInstanceIds.has(instanceId)) {
      ignoredInstanceIds.add(instanceId);
      try {
        await AnnounceApi_ignoreAnnounce({
          instanceIds: [instanceId],
        });
        onClose();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("ignore announce failed:", e);
      }
    }
  }
}

export function PollAnnounceComponent({
  pollEnabled,
  realTimeMessage,
  onOpen,
  onClose,
}: PollAnnounceComponentProps) {
  useEffect(
    () => {
      const listEffectiveAnnounce = async (): Promise<void> => {
        const list = (await AnnounceApi_listEffectiveAnnounce({}))
          .list as (Message & { isPopup: boolean })[];
        if (list.length) {
          list
            .filter((item) => item.isPopup)
            .reverse()
            .forEach((item) => {
              openNotification(item, onClose);
            });
        }
      };
      listEffectiveAnnounce();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!pollEnabled && realTimeMessage) {
      openNotification(realTimeMessage, onClose);
    }
  }, [onClose, pollEnabled, realTimeMessage]);

  useEffect(() => {
    if (!pollEnabled) {
      return;
    }
    let ignored = false;
    const pollAnnounce = async (): Promise<void> => {
      if (ignored) {
        return;
      }
      try {
        const result = await AnnounceApi_pollAnnounce({
          interceptorParams: {
            ignoreLoadingBar: true,
          },
        });
        openNotification(result as Message, onClose);
        onOpen();
        pollAnnounce();
      } catch (error) {
        const err = httpErrorToString(error);
        if (err?.toLowerCase()?.includes("timeout")) {
          pollAnnounce();
        }
      }
    };
    pollAnnounce();
    return () => {
      ignored = true;
    };
  }, [onClose, onOpen, pollEnabled]);

  return null;
}
