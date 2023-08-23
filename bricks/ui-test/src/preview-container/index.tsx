import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  createRef,
  forwardRef,
  Ref,
  useImperativeHandle,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { getBasePath, __secret_internals } from "@next-core/runtime";
import styleText from "./styles.shadow.css";

const { defineElement, property, method, event } = createDecorators();

interface PreviewContainerRef {
  back(): void;
  forward(): void;
  reload(): void;
}

export const PreviewContainerComponent = forwardRef(
  LegacyPreviewContainerComponent
);

/**
 * 构件 `ui-test.preview-container`
 */
export
@defineElement("ui-test.preview-container", {
  styleTexts: [styleText],
})
class PreviewContainer extends ReactNextElement {
  private _previewContainerRef = createRef<PreviewContainerRef>();

  @property()
  accessor src!: string;

  @property({ type: Boolean })
  accessor recordEnabled: boolean | undefined;

  @method()
  back(): void {
    this._previewContainerRef.current?.back();
  }

  @method()
  forward(): void {
    this._previewContainerRef.current?.forward();
  }

  @method()
  reload(): void {
    this._previewContainerRef.current?.reload();
  }

  @event({ type: "url.change" })
  accessor #urlChangeEvent!: EventEmitter<string>;
  #handleUrlChange = (url: string) => {
    this.#urlChangeEvent.emit(url);
  };

  render() {
    return (
      <PreviewContainerComponent
        ref={this._previewContainerRef}
        src={this.src}
        recordEnabled={this.recordEnabled}
        onUrlChange={this.#handleUrlChange}
      />
    );
  }
}

export interface PreviewContainerComponentProps {
  src: string;
  recordEnabled?: boolean;
  onUrlChange?(url: string): void;
}

function LegacyPreviewContainerComponent(
  { src, recordEnabled, onUrlChange }: PreviewContainerComponentProps,
  ref: Ref<PreviewContainerRef>
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [initialized, setInitialized] = useState(false);
  const previewOrigin = useMemo(() => {
    const url = new URL(src, location.origin);
    return url.origin;
  }, [src]);

  const back = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      channel: "ui-test-preview",
      type: "back",
    });
  }, []);

  const forward = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      channel: "ui-test-preview",
      type: "forward",
    });
  }, []);

  const reload = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      channel: "ui-test-preview",
      type: "reload",
    });
  }, []);

  useImperativeHandle(ref, () => ({
    back,
    forward,
    reload,
  }));

  const handleIframeLoad = useCallback(() => {
    const pkg = __secret_internals.getBrickPackagesById("bricks/ui-test");
    if (!pkg) {
      throw new Error("Cannot find preview agent package: bricks/ui-test");
    }
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "initialize",
        payload: {
          agent: {
            brick: "ui-test.inject-preview-agent",
            pkg: {
              ...pkg,
              filePath: `${location.origin}${getBasePath()}${
                window.PUBLIC_ROOT ?? ""
              }${pkg.filePath}`,
            },
          },
        },
      },
      previewOrigin
    );
  }, [previewOrigin]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      // eslint-disable-next-line no-console
      console.log("received message:", event);
      if (event.data?.channel === "ui-test-preview") {
        switch (event.data.type) {
          case "initialized":
            setInitialized(true);
            break;
          case "url-change":
            onUrlChange?.(event.data.url);
            break;
        }
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "toggle-record",
        payload: {
          recordEnabled,
        },
      },
      previewOrigin
    );
  }, [initialized, previewOrigin, recordEnabled]);

  return (
    <div className="preview-container">
      <iframe
        ref={iframeRef}
        src={src}
        onLoad={handleIframeLoad}
        className="iframe"
      />
    </div>
  );
}
