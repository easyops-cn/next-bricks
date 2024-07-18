import React, { useCallback, useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import type { BrickConf, MicroApp } from "@next-core/types";
import classNames from "classnames";
import { __secret_internals, getBasePath } from "@next-core/runtime";
import type { PreviewWindow } from "@next-core/preview/types";
import { JSON_SCHEMA, safeDump } from "js-yaml";
import type { VisualConfig } from "./raw-data-interfaces";
import { convertToStoryboard } from "./convert";
import styleText from "./styles.shadow.css";
import previewStyleText from "./preview.shadow.css";

const { defineElement, property } = createDecorators();

export interface RawPreviewProps {
  previewUrl?: string;
  generations?: AttributeGeneration[];
  category?: PreviewCategory;
  theme?: string;
  uiVersion?: string;
  app?: MicroApp;
}

export interface AttributeGeneration {
  objectId: string;
  objectName: string;
  propertyId: string;
  propertyName: string;
  candidates: VisualConfig[];
  mockData: Record<string, unknown>[];
}

export type PreviewCategory =
  | "detail-item"
  | "form-item"
  | "table-column"
  | "card-item"
  | "metric-item"
  | "value";

/**
 * 构件 `visual-builder.raw-data-preview`
 *
 * @internal
 */
export
@defineElement("visual-builder.raw-data-preview", {
  styleTexts: [styleText],
})
class RawDataPreview extends ReactNextElement {
  @property()
  accessor previewUrl: string | undefined;

  @property({ attribute: false })
  accessor generations: AttributeGeneration[] | undefined;

  /**
   * @default "value"
   */
  @property()
  accessor category: PreviewCategory | undefined;

  @property()
  accessor theme: string | undefined;

  @property()
  accessor uiVersion: string | undefined;

  @property()
  accessor app: MicroApp | undefined;

  render() {
    return (
      <RawDataPreviewComponent
        previewUrl={this.previewUrl}
        generations={this.generations}
        category={this.category}
        theme={this.theme}
        uiVersion={this.uiVersion}
        app={this.app}
      />
    );
  }
}

export interface RawDataPreviewComponentProps extends RawPreviewProps {
  //
}

export function RawDataPreviewComponent({
  previewUrl,
  generations,
  category,
  theme,
  uiVersion,
  app,
}: RawDataPreviewComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>();
  const [ready, setReady] = useState(false);
  const [injected, setInjected] = useState(false);

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
    const inject = (iframeRef.current!.contentWindow as PreviewWindow)!
      ._preview_only_inject;

    const fixedPkg = {
      ...pkg,
      filePath: previewUrl
        ? new URL(pkg.filePath, new URL(previewUrl, location.origin)).toString()
        : `${location.origin}${getBasePath()}${
            window.PUBLIC_ROOT ?? ""
          }${pkg.filePath}`,
    };

    Promise.allSettled(
      [
        "visual-builder.pre-generated-table-view",
        "visual-builder.pre-generated-container",
      ].map((brick) => inject(brick, fixedPkg, undefined, true))
    ).then(() => {
      setInjected(true);
    });
  }, [ready]);

  useEffect(() => {
    if (!injected) {
      return;
    }
    const render = (iframeRef.current?.contentWindow as PreviewWindow)
      ?._preview_only_render;
    if (!render) {
      return;
    }

    const tableChildren: BrickConf[] = [
      {
        brick: "div",
        properties: {
          textContent: "属性",
          className: "head-cell",
        },
      },
      {
        brick: "div",
        properties: {
          textContent: "视觉重量",
          className: "head-cell last-col-cell",
          style: {
            gridColumn: "span 4",
            textAlign: "center",
          },
        },
      },
    ];
    const table: BrickConf = {
      brick: "visual-builder.pre-generated-table-view",
      properties: {
        style: {
          gridTemplateColumns: "120px repeat(4, 1fr)",
        },
      },
      children: tableChildren,
    };

    for (let i = 0, size = generations.length; i < size; i++) {
      const generation = generations[i];
      const isLastRow = i === size - 1;

      const candidatesByVisualWeight = new Map<number, VisualConfig>();
      for (const candidate of generation.candidates) {
        candidatesByVisualWeight.set(candidate.visualWeight ?? 0, candidate);
      }

      tableChildren.push({
        brick: "div",
        properties: {
          // textContent: `${generation.objectName ?? generation.objectId} - ${generation.propertyName ?? generation.propertyId}`,
          textContent: `${generation.propertyName ?? generation.propertyId}`,
          className: classNames("body-cell", {
            "last-row-cell": isLastRow,
          }),
        },
      });

      const dataSource =
        generation.mockData[
          Math.floor(Math.random() * generation.mockData.length)
        ] ?? {};

      for (let i = -1; i < 3; i++) {
        const candidate = candidatesByVisualWeight.get(i);

        let container: BrickConf;
        if (candidate) {
          const brick = convertToStoryboard(candidate, generation.propertyId);
          const children = brick ? [brick] : [];

          container = {
            brick: "visual-builder.pre-generated-container",
            properties: {
              useBrick: children,
              dataSource,
            },
            errorBoundary: true,
          };
        }

        tableChildren.push({
          brick: "div",
          properties: {
            className: classNames("body-cell", {
              "last-col-cell": i === 2,
              "last-row-cell": isLastRow,
            }),
          },
          children: container
            ? [
                {
                  ...container,
                  errorBoundary: true,
                },
              ]
            : [],
        });
      }
    }

    render(
      "yaml",
      {
        yaml: safeDump(table, {
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
        styleText: previewStyleText,
      }
    );
  }, [app, injected, generations, theme, uiVersion, category]);

  return (
    <div className={classNames("container")}>
      <iframe
        ref={iframeRef}
        src={previewUrl ?? `${getBasePath()}_brick-preview-v3_/preview/`}
        loading="lazy"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
