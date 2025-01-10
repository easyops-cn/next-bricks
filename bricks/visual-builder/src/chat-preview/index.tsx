import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import { __secret_internals, getBasePath } from "@next-core/runtime";
import type { BrickConf, MicroApp } from "@next-core/types";
import { JSON_SCHEMA, safeDump } from "js-yaml";
import type { PreviewWindow } from "@next-core/preview/types";
import classNames from "classnames";
import type {
  InspectOutline,
  InspectSelector,
} from "../data-providers/chat-preview/interfaces";
import { InspectOutlineComponent } from "./InspectOutlineComponent";
import styleText from "./styles.shadow.css";

const { defineElement, property, event, method } = createDecorators();

export interface ChatPreviewProps {
  storyboard?: BrickConf | BrickConf[];
  theme?: string;
  uiVersion?: string;
  app?: MicroApp;
  inspecting?: boolean;
}

/**
 * 构件 `visual-builder.chat-preview`
 */
export
@defineElement("visual-builder.chat-preview", {
  styleTexts: [styleText],
})
class ChatPreview extends ReactNextElement {
  @property({ attribute: false })
  accessor storyboard: BrickConf | BrickConf[] | undefined;

  @property()
  accessor theme: string | undefined;

  @property()
  accessor uiVersion: string | undefined;

  @property()
  accessor app: MicroApp | undefined;

  @property({ type: Boolean })
  accessor inspecting: boolean | undefined;

  @event({ type: "activeTarget.change" })
  accessor #activeTargetChangeEvent!: EventEmitter<InspectSelector | undefined>;
  #handleActiveTargetChange = (target: InspectSelector | undefined) => {
    this.#activeTargetChangeEvent.emit(target);
  };

  @method()
  select(payload: InspectSelector) {
    const iframeWin = this.shadowRoot?.querySelector("iframe")?.contentWindow;
    iframeWin?.postMessage(
      {
        channel: "chat-preview",
        type: "select",
        payload,
      },
      location.origin
    );
  }

  render() {
    return (
      <ChatPreviewComponent
        storyboard={this.storyboard}
        theme={this.theme}
        uiVersion={this.uiVersion}
        app={this.app}
        inspecting={this.inspecting}
        onActiveTargetChange={this.#handleActiveTargetChange}
      />
    );
  }
}

export interface ChatPreviewComponentProps extends ChatPreviewProps {
  onActiveTargetChange?(target: InspectSelector | undefined): void;
}

export function ChatPreviewComponent({
  storyboard,
  theme,
  uiVersion,
  app,
  inspecting,
  onActiveTargetChange,
}: ChatPreviewComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(undefined);
  const [ready, setReady] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [scroll, setScroll] = useState({ x: 0, y: 0 });
  const [hoverOutlines, setHoverOutlines] = useState<InspectOutline[]>([]);
  const [activeOutlines, setActiveOutlines] = useState<InspectOutline[]>([]);
  const [adjustedHoverOutlines, setAdjustedHoverOutlines] = useState<
    InspectOutline[]
  >([]);
  const [adjustedActiveOutlines, setAdjustedActiveOutlines] = useState<
    InspectOutline[]
  >([]);

  const handleIframeLoad = useCallback(() => {
    const check = () => {
      const iframeWin = iframeRef.current?.contentWindow as PreviewWindow;
      if (iframeWin?._preview_only_render) {
        setReady(true);
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const pkg = __secret_internals.getBrickPackagesById(
      "bricks/visual-builder"
    );
    if (!pkg) {
      throw new Error(
        "Cannot find preview agent package: bricks/visual-builder"
      );
    }
    const inject = (iframeRef.current?.contentWindow as PreviewWindow)
      ?._preview_only_inject;
    inject("visual-builder.inject-chat-preview-agent", {
      ...pkg,
      filePath: `${location.origin}${getBasePath()}${
        window.PUBLIC_ROOT ?? ""
      }${pkg.filePath}`,
    });
  }, [ready]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const render = (iframeRef.current?.contentWindow as PreviewWindow)
      ?._preview_only_render;
    if (!render) {
      return;
    }
    render(
      "yaml",
      {
        yaml: safeDump(storyboard, {
          schema: JSON_SCHEMA,
          skipInvalid: true,
          noRefs: true,
          noCompatMode: true,
        }),
      },
      {
        app,
        theme,
        uiVersion,
      }
    );
  }, [app, ready, storyboard, theme, uiVersion]);

  const handleMouseOut = useMemo(() => {
    if (!initialized) {
      return;
    }
    return () => {
      // Delay posting message to allow iframe inner hovering message be sent before
      // mouse out from iframe itself.
      setTimeout(() => {
        window.postMessage({
          channel: "chat-preview",
          type: "inspect-hover",
          payload: { outlines: [] },
        });
      }, 100);
    };
  }, [initialized]);

  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (event.data?.channel === "chat-preview") {
        switch (event.data.type) {
          case "initialized":
            setInitialized(true);
            break;
          case "inspect-hover":
            setHoverOutlines(event.data.payload.outlines);
            break;
          case "scroll":
            setScroll(event.data.payload);
            break;
          case "inspect-active":
            setActiveOutlines(event.data.payload.outlines);
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
        channel: "chat-preview",
        type: "toggle-inspecting",
        payload: {
          inspecting,
        },
      },
      location.origin
    );
  }, [initialized, inspecting]);

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
    onActiveTargetChange(activeOutlines[0]);
  }, [activeOutlines, onActiveTargetChange]);

  useEffect(() => {
    setAdjustedActiveOutlines(adjustOutlines(activeOutlines));
  }, [activeOutlines, adjustOutlines]);

  useEffect(() => {
    setAdjustedHoverOutlines(adjustOutlines(hoverOutlines));
  }, [hoverOutlines, adjustOutlines]);

  return (
    <div className={classNames("container", { inspecting })}>
      <iframe
        ref={iframeRef}
        src={`${getBasePath()}_brick-preview-v3_/preview/`}
        loading="lazy"
        onLoad={handleIframeLoad}
        onMouseOut={handleMouseOut}
      />
      {adjustedHoverOutlines.map((outline, index) => (
        <InspectOutlineComponent key={index} variant="hover" {...outline} />
      ))}
      {adjustedActiveOutlines.map((outline, index) => (
        <InspectOutlineComponent key={index} variant="active" {...outline} />
      ))}
    </div>
  );
}
