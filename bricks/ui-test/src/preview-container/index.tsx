import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

/**
 * 构件 `ui-test.preview-container`
 */
export
@defineElement("ui-test.preview-container", {
  styleTexts: [styleText],
})
class PreviewContainer extends ReactNextElement {
  @property()
  accessor src!: string;

  @property({ type: Boolean })
  accessor recordEnabled: boolean | undefined;

  render() {
    return (
      <PreviewContainerComponent
        src={this.src}
        recordEnabled={this.recordEnabled}
      />
    );
  }
}

export interface PreviewContainerComponentProps {
  src: string;
  recordEnabled?: boolean;
}

export function PreviewContainerComponent({
  src,
  recordEnabled,
}: PreviewContainerComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const previewOrigin = useMemo(() => {
    const url = new URL(src, location.origin);
    return url.origin;
  }, [src]);

  const handleIframeLoad = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "initialize",
      },
      previewOrigin
    );
    setIframeLoaded(true);
  }, [previewOrigin]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      // eslint-disable-next-line no-console
      console.log("received message:", event);
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, []);

  useEffect(() => {
    if (!iframeLoaded) {
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
  }, [iframeLoaded, previewOrigin, recordEnabled]);

  return (
    <div>
      <iframe
        ref={iframeRef}
        src={src}
        onLoad={handleIframeLoad}
        style={{
          width: "1000px",
          height: "600px",
        }}
      />
    </div>
  );
}
