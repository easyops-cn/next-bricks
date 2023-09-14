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
import type { NodeGraphData } from "../interface.js";

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

  @property({ attribute: false })
  accessor hoverRelatedCommands: NodeGraphData[] | undefined;

  @property({ attribute: false })
  accessor activeRelatedCommands: NodeGraphData[] | undefined;

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
        hoverRelatedCommands={this.hoverRelatedCommands}
        activeRelatedCommands={this.activeRelatedCommands}
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
  hoverRelatedCommands?: NodeGraphData[];
  activeRelatedCommands: NodeGraphData[] | undefined;
  onUrlChange?(url: string): void;
  onInspectSelect?(targets: InspectSelector[]): void;
  onRecordComplete?(steps: RecordStep[]): void;
}

function LegacyPreviewContainerComponent(
  {
    src,
    recording,
    inspecting,
    hoverRelatedCommands,
    activeRelatedCommands,
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
  const [hoverOutlines, setHoverOutlines] = useState<InspectOutline[]>([]);
  const [activeOutlines, setActiveOutlines] = useState<InspectOutline[]>([]);
  const [adjustedHoverOutlines, setAdjustedHoverOutlines] = useState<
    InspectOutline[]
  >([]);
  const [adjustedActiveOutlines, setAdjustedActiveOutlines] = useState<
    InspectOutline[]
  >([]);

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
          payload: { outlines: [] },
        });
      }, 100);
    };
  }, [initialized]);

  const adjustOutlines = useCallback(
    (outlines: InspectOutline[]): InspectOutline[] => {
      return outlines.map((outline) => {
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
      });
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
            setHoverOutlines(event.data.payload.outlines);
            break;
          case "inspect-active":
            setActiveOutlines(event.data.payload.outlines);
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
  }, [onUrlChange, onInspectSelect, onRecordComplete]);

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
    if (!initialized) {
      return;
    }
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "set-active-tree-node",
        payload: {
          relatedCommands: activeRelatedCommands ?? [],
        },
      },
      previewOrigin
    );
  }, [previewOrigin, activeRelatedCommands, initialized]);

  useEffect(() => {
    if (!initialized) {
      return;
    }
    iframeRef.current?.contentWindow?.postMessage(
      {
        channel: "ui-test-preview",
        type: "hover-over-tree-node",
        payload: {
          relatedCommands: hoverRelatedCommands ?? [],
        },
      },
      previewOrigin
    );
  }, [previewOrigin, hoverRelatedCommands, initialized]);

  useEffect(() => {
    setAdjustedActiveOutlines(adjustOutlines(activeOutlines));
  }, [activeOutlines, adjustOutlines]);

  useEffect(() => {
    setAdjustedHoverOutlines(adjustOutlines(hoverOutlines));
  }, [hoverOutlines, adjustOutlines]);

  return (
    <div className={classNames("preview-container", { inspecting })}>
      <iframe
        ref={iframeRef}
        src={src}
        className="iframe"
        onLoad={handleIframeLoad}
        onMouseOut={handleMouseOut}
      />
      {adjustedHoverOutlines.map((outline, index) => (
        <InspectOutlineComponent key={index} type="hover" {...outline} />
      ))}
      {adjustedActiveOutlines.map((outline, index) => (
        <InspectOutlineComponent key={index} type="active" {...outline} />
      ))}
    </div>
  );
}
