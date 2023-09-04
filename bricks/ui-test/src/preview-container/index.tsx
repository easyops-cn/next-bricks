// istanbul ignore file
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
import classNames from "classnames";
import styleText from "./styles.shadow.css";
import type {
  InspectOutline,
  InspectSelector,
  RecordStep,
} from "../data-providers/preview/interfaces.js";
import { InspectOutlineComponent } from "./InspectOutlineComponent.js";

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
  accessor recording: boolean | undefined;

  @property({ type: Boolean })
  accessor inspecting: boolean | undefined;

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

  @event({ type: "inspect.select" })
  accessor #inspectSelectEvent!: EventEmitter<InspectSelector[]>;
  #handleInspectSelect = (targets: InspectSelector[]) => {
    this.#inspectSelectEvent.emit(targets);
  };

  @event({ type: "record.complete" })
  accessor #recordCompleteEvent!: EventEmitter<RecordStep[]>;
  #handleRecordComplete = (targets: RecordStep[]) => {
    this.#recordCompleteEvent.emit(targets);
  };

  render() {
    return (
      <PreviewContainerComponent
        ref={this._previewContainerRef}
        src={this.src}
        recording={this.recording}
        inspecting={this.inspecting}
        onUrlChange={this.#handleUrlChange}
        onInspectSelect={this.#handleInspectSelect}
        onRecordComplete={this.#handleRecordComplete}
      />
    );
  }
}

export interface PreviewContainerComponentProps {
  src: string;
  recording?: boolean;
  inspecting?: boolean;
  onUrlChange?(url: string): void;
  onInspectSelect?(targets: InspectSelector[]): void;
  onRecordComplete?(steps: RecordStep[]): void;
}

function LegacyPreviewContainerComponent(
  {
    src,
    recording,
    inspecting,
    onUrlChange,
    onInspectSelect,
    onRecordComplete,
  }: PreviewContainerComponentProps,
  ref: Ref<PreviewContainerRef>
) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [initialized, setInitialized] = useState(false);
  const previewOrigin = useMemo(() => {
    const url = new URL(src, location.origin);
    return url.origin;
  }, [src]);
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const [outline, setOutline] = useState<InspectOutline | null>(null);
  const [adjustedOutline, setAdjustedOutline] = useState<InspectOutline | null>(
    null
  );

  const back = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "back",
      },
      previewOrigin
    );
  }, [previewOrigin]);

  const forward = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "forward",
      },
      previewOrigin
    );
  }, [previewOrigin]);

  const reload = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "reload",
      },
      previewOrigin
    );
  }, [previewOrigin]);

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

  const handleMouseOut = useMemo(() => {
    if (!initialized) {
      return;
    }
    return () => {
      // Delay posting message to allow iframe inner hovering message be sent before
      // mouse out from iframe itself.
      setTimeout(() => {
        window.postMessage({
          channel: "ui-test-preview",
          type: "inspect-hover",
          payload: { outline: null },
        });
      }, 100);
    };
  }, [initialized]);

  const adjustOutline = useCallback(
    (outline: InspectOutline | null): InspectOutline | null => {
      if (!outline) {
        return outline;
      }
      const minScale = 1;
      const offsetLeft = iframeRef?.current?.offsetLeft ?? 0;
      const offsetTop = iframeRef?.current?.offsetTop ?? 0;
      const { width, height, left, top, ...rest } = outline;
      return {
        width: width * minScale,
        height: height * minScale,
        left: (left - scroll.x) * minScale + offsetLeft,
        top: (top - scroll.y) * minScale + offsetTop,
        ...rest,
      };
    },
    [scroll.x, scroll.y]
  );

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.channel === "ui-test-preview") {
        switch (event.data.type) {
          case "initialized":
            setInitialized(true);
            break;
          case "url-change":
            onUrlChange?.(event.data.payload.url);
            break;
          case "inspect-hover":
            setOutline(event.data.payload.outline);
            break;
          case "scroll":
            setScroll(event.data.payload);
            break;
          case "inspect-select":
            onInspectSelect?.(event.data.payload.targets);
            break;
          case "record-complete":
            onRecordComplete?.(event.data.payload.steps);
            break;
        }
      }
    };
    window.addEventListener("message", listener);
    return () => {
      window.removeEventListener("message", listener);
    };
  }, [onUrlChange, onInspectSelect]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "toggle-record",
        payload: {
          recording,
        },
      },
      previewOrigin
    );
  }, [initialized, previewOrigin, recording]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "toggle-inspecting",
        payload: {
          inspecting,
        },
      },
      previewOrigin
    );
  }, [initialized, previewOrigin, inspecting]);

  useEffect(() => {
    setAdjustedOutline(adjustOutline(outline));
  }, [outline, adjustOutline]);

  return (
    <div className={classNames("preview-container", { inspecting })}>
      <iframe
        ref={iframeRef}
        src={src}
        className="iframe"
        onLoad={handleIframeLoad}
        onMouseOut={handleMouseOut}
      />
      {adjustedOutline && <InspectOutlineComponent {...adjustedOutline} />}
    </div>
  );
}
