import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import { __secret_internals, getBasePath } from "@next-core/runtime";
import "@next-core/theme";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface LightPreviewProps {
  inspecting?: boolean;
  previewUrl?: string;
}

/**
 * 构件 `visual-builder.light-preview`
 */
export
@defineElement("visual-builder.light-preview", {
  styleTexts: [styleText],
})
class LightPreview extends ReactNextElement implements LightPreviewProps {
  @property({ type: Boolean })
  accessor inspecting: boolean | undefined;

  @property()
  accessor previewUrl: string | undefined;

  render() {
    return (
      <LightPreviewComponent
        inspecting={this.inspecting}
        previewUrl={this.previewUrl}
      />
    );
  }
}

export interface LightPreviewComponentProps extends LightPreviewProps {
  // Define event handlers here.
}

export function LightPreviewComponent({
  // inspecting,
  previewUrl,
}: LightPreviewComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const previewUrlInitializedRef = useRef(false);
  const [initialPreviewUrl, setInitialPreviewUrl] = useState(previewUrl);
  useEffect(() => {
    // Never reset `iframe.src` once it has been set.
    if (!previewUrlInitializedRef.current && previewUrl) {
      previewUrlInitializedRef.current = true;
      setInitialPreviewUrl(previewUrl);
    }
  }, [previewUrl]);

  const previewOrigin = useMemo(() => {
    const url = new URL(initialPreviewUrl, location.origin);
    return url.origin;
  }, [initialPreviewUrl]);

  const loadedRef = useRef(false);
  const handleIframeLoad = useCallback(() => {
    loadedRef.current = true;
    // setHoverOutlines([]);
    // setActiveOutlines([]);

    const agentPackageId = "bricks/inject";
    const agentBrick = "inject.visual-builder-light-preview-agent";
    const pkg = __secret_internals.getBrickPackagesById?.(agentPackageId);
    if (!pkg) {
      // eslint-disable-next-line no-console
      console.error(`Cannot find preview agent package: ${agentPackageId}`);
    }

    iframeRef.current.contentWindow.postMessage(
      {
        sender: "preview-container",
        type: "start-preview",
        options: {
          // appId,
          // routeId,
          // templateId,
          // formId,
          // formData,
          // snippetData: snippetData && JSON.stringify(snippetData),
          // routePath,
          // routeExact,
          // settings: previewSettings,
          agent: {
            brick: agentBrick,
            pkg: pkg && {
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
  }, [
    // snippetGraphData,
    // appId,
    // routeId,
    // templateId,
    // formId,
    // formData,
    // routePath,
    // routeExact,
    // previewSettings,
    previewOrigin,
  ]);
  return (
    <div
      className="iframe-container"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <iframe
        src={initialPreviewUrl}
        ref={iframeRef}
        onLoad={handleIframeLoad}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
