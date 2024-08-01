import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type Ref,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { getBroadcastChannelPolyfill } from "./polyfill";
import styleText from "./styles.shadow.css";

const { defineElement, property, method, event } = createDecorators();

export const BroadcastChannelComponent = forwardRef(
  LegacyBroadcastChannelComponent
);

export interface BroadcastChannelProps {
  channel: string;
}

/**
 * 构件 `eo-broadcast-channel`
 */
export
@defineElement("eo-broadcast-channel", {
  styleTexts: [styleText],
})
class EoBroadcastChannel
  extends ReactNextElement
  implements BroadcastChannelProps
{
  /**
   * 广播频道名称，详见 [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)。
   *
   * @required
   */
  @property()
  accessor channel!: string;

  /** 广播频道消息事件 */
  @event({ type: "message" })
  accessor #messageEvent!: EventEmitter<unknown>;

  #handleMessage = (data: unknown) => {
    this.#messageEvent.emit(data);
  };

  /** 发送一条消息 */
  @method()
  postMessage(data: unknown) {
    this.#messagePort.current?.postMessage(data);
  }

  #messagePort = createRef<Pick<BroadcastChannel, "postMessage">>();

  render() {
    return (
      <BroadcastChannelComponent
        ref={this.#messagePort}
        channel={this.channel}
        onMessage={this.#handleMessage}
      />
    );
  }
}

export interface BroadcastChannelComponentProps extends BroadcastChannelProps {
  onMessage: (data: unknown) => void;
}

export function LegacyBroadcastChannelComponent(
  { channel, onMessage }: BroadcastChannelComponentProps,
  ref: Ref<Pick<BroadcastChannel, "postMessage">>
) {
  const channelRef = useRef<BroadcastChannel>();
  const polyfillRef = useRef<typeof BroadcastChannel>();

  useImperativeHandle(ref, () => ({
    postMessage(message: unknown) {
      return channelRef.current?.postMessage(message);
    },
  }));

  useEffect(() => {
    const handleMessage = (event: MessageEvent): void => {
      // When using polyfill, the message event is the message data itself.
      onMessage(
        // istanbul ignore next
        window.BroadcastChannel ? event.data : event
      );
    };
    (async () => {
      polyfillRef.current = await getBroadcastChannelPolyfill();
      channelRef.current = channel
        ? new polyfillRef.current(channel)
        : undefined;
      channelRef.current?.addEventListener("message", handleMessage);
    })();
    return () => {
      channelRef.current?.close();
      channelRef.current?.removeEventListener("message", handleMessage);
    };
  }, [channel, onMessage]);

  return null;
}
