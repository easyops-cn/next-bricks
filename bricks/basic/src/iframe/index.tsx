import React, {
  createRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type Ref,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import styleText from "./styles.shadow.css";

const { defineElement, property, event, method } = createDecorators();

export interface IframeProps {
  src?: string;
  iframeStyle?: CSSProperties;
}

export interface IframeEvents {
  load: CustomEvent<void>;
}

export interface IframeEventsMapping {
  onLoad: "load";
}

type PostMessageParameters =
  | [message: unknown, targetOrigin: string, transfer?: Transferable[]]
  | [message: unknown, options?: WindowPostMessageOptions];

interface IframeRef {
  postMessage: (...args: PostMessageParameters) => void;
}

const IframeComponent = forwardRef<IframeRef, IframeComponentProps>(
  LegacyIframeComponent
);

/**
 * 内嵌网页构件，通过 iframe 将外部页面嵌入当前页面
 * @category display-component
 */
export
@defineElement("eo-iframe", {
  styleTexts: [styleText],
})
class Iframe extends ReactNextElement implements IframeProps {
  /**
   * iframe 的源地址
   * @required
   */
  @property() accessor src: string | undefined;

  /**
   * iframe 的自定义样式，默认样式为宽高 100%、无边距
   *
   * Default style:
   *
   * ```css
   * iframe {
   *   margin: 0;
   *   border: 0;
   *   padding: 0;
   *   width: 100%;
   *   height: 100%;
   *   vertical-align: top;
   * }
   * ```
   */
  @property({ attribute: false })
  accessor iframeStyle: CSSProperties | undefined;

  /**
   * @detail -
   * @description iframe 加载完成时触发
   */
  @event({ type: "load" })
  accessor #loadEvent!: EventEmitter<void>;

  #handleLoad = () => {
    this.#loadEvent.emit();
  };

  #iframeRef = createRef<IframeRef>();

  /**
   * 向 iframe 发送 postMessage
   * @param args 传递给 iframe contentWindow.postMessage 的参数，支持 (message, targetOrigin, transfer?) 和 (message, options?) 两种签名
   */
  @method()
  postMessage(...args: PostMessageParameters): void {
    this.#iframeRef.current?.postMessage(...args);
  }

  render() {
    return (
      <IframeComponent
        src={this.src}
        iframeStyle={this.iframeStyle}
        onLoad={this.#handleLoad}
        ref={this.#iframeRef}
      />
    );
  }
}

export interface IframeComponentProps extends IframeProps {
  onLoad: () => void;
}

export function LegacyIframeComponent(
  { src, iframeStyle, onLoad }: IframeComponentProps,
  ref: Ref<IframeRef>
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useImperativeHandle(
    ref,
    () => ({
      postMessage(...args: PostMessageParameters) {
        iframeRef.current?.contentWindow?.postMessage(
          ...(args as Parameters<Window["postMessage"]>)
        );
      },
    }),
    []
  );

  useEffect(() => {
    const iframe = iframeRef.current;
    iframe?.addEventListener("load", onLoad);
    return () => {
      iframe?.removeEventListener("load", onLoad);
    };
  }, [onLoad]);

  return src ? <iframe src={src} style={iframeStyle} ref={iframeRef} /> : null;
}
