import React, { useEffect } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface EoMessageListenerProps {
  sameOrigin?: boolean;
}

export interface MessageDetail {
  data: unknown;
  origin: string;
}

export interface EoMessageListenerEvents {
  message: CustomEvent<MessageDetail>;
}

export interface EoMessageListenerEventsMapping {
  onMessage: "message";
}

/**
 * 用于监听 window.postMessage 事件的构件，可选择仅接收同源消息
 * @en A brick used to listen for window.postMessage events; it can be configured to only receive same-origin messages
 */
export
@defineElement("eo-message-listener", {
  styleTexts: [styleText],
})
class EoMessageListener
  extends ReactNextElement
  implements EoMessageListenerProps
{
  /**
   * 是否仅接收同源消息
   * @en Whether to only receive same-origin messages
   *
   * @default true
   */
  @property({ type: Boolean })
  accessor sameOrigin: undefined | boolean;

  /**
   * @detail { data: 消息数据内容, origin: 消息来源的域名 }
   * @detailEn { data: The message data content, origin: The domain of the message source }
   * @description 接收到 postMessage 消息时触发
   * @en Triggered when a postMessage message is received
   */
  @event({ type: "message" })
  accessor #messageEvent!: EventEmitter<MessageDetail>;

  #handleMessage = (detail: MessageDetail) => {
    this.#messageEvent.emit(detail);
  };

  render() {
    return (
      <EoMessageListenerComponent
        sameOrigin={this.sameOrigin}
        onMessage={this.#handleMessage}
      />
    );
  }
}

export interface EoMessageListenerComponentProps
  extends EoMessageListenerProps {
  onMessage(detail: MessageDetail): void;
}

export function EoMessageListenerComponent({
  sameOrigin: _sameOrigin,
  onMessage,
}: EoMessageListenerComponentProps) {
  const sameOrigin = _sameOrigin ?? true;

  useEffect(() => {
    function callback(event: MessageEvent) {
      if (!sameOrigin || event.origin === location.origin) {
        onMessage({ data: event.data, origin: event.origin });
      }
    }
    window.addEventListener("message", callback);
    return () => {
      window.removeEventListener("message", callback);
    };
  }, [onMessage, sameOrigin]);
  return null;
}
