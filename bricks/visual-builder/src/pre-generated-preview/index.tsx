import React, { useCallback, useEffect, useRef, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import type { BrickConf, MicroApp } from "@next-core/types";
import classNames from "classnames";
import { __secret_internals, getBasePath } from "@next-core/runtime";
import type { PreviewWindow } from "@next-core/preview/types";
import { JSON_SCHEMA, safeDump } from "js-yaml";
import styleText from "./styles.shadow.css";
import previewStyleText from "./preview.shadow.css";

const { defineElement, property } = createDecorators();

export interface PreGeneratedPreviewProps {
  generations?: AttributeGeneration[];
  category?: PreviewCategory;
  theme?: string;
  uiVersion?: string;
  app?: MicroApp;
}

export interface AttributeGeneration {
  instanceId: string;
  objectId: string;
  propertyId: string;
  propertyName: string;
  displayLevel: number;
  rwType: string;
  category: PreviewCategory;
  storyboard: BrickConf | BrickConf[];
  mockData: unknown[];
}

export type PreviewCategory =
  | "detail-item"
  | "form-item"
  | "table-column"
  | "card-item"
  | "metric-item"
  | "value";

/**
 * 构件 `visual-builder.pre-generated-preview`
 *
 * @internal
 */
export
@defineElement("visual-builder.pre-generated-preview", {
  styleTexts: [styleText],
})
class PreGeneratedPreview extends ReactNextElement {
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
      <PreGeneratedPreviewComponent
        generations={this.generations}
        category={this.category}
        theme={this.theme}
        uiVersion={this.uiVersion}
        app={this.app}
      />
    );
  }
}

export interface PreGeneratedPreviewComponentProps
  extends PreGeneratedPreviewProps {
  //
}

export function PreGeneratedPreviewComponent({
  generations,
  category,
  theme,
  uiVersion,
  app,
}: PreGeneratedPreviewComponentProps) {
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
      filePath: `${location.origin}${getBasePath()}${
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

    const candidatesMap = new Map<
      string,
      Map<string, Map<number, AttributeGeneration>>
    >();
    const mocksMap = new Map<string, unknown[]>();

    for (const generation of generations) {
      let candidatesByReadWriteType = candidatesMap.get(generation.propertyId);
      if (!candidatesByReadWriteType) {
        candidatesMap.set(
          generation.propertyId,
          (candidatesByReadWriteType = new Map())
        );
      }
      let candidatesByDisplayLevel = candidatesByReadWriteType.get(
        generation.rwType
      );
      if (!candidatesByDisplayLevel) {
        candidatesByReadWriteType.set(
          generation.rwType,
          (candidatesByDisplayLevel = new Map())
        );
      }
      candidatesByDisplayLevel.set(generation.displayLevel ?? 0, generation);

      mocksMap.set(generation.propertyId, generation.mockData);
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
          textContent: "类别",
          className: "head-cell",
        },
      },
      {
        brick: "div",
        properties: {
          textContent: "展示等级",
          className: "head-cell last-col-cell",
          style: {
            gridColumn: "span 5",
            textAlign: "center",
          },
        },
      },
    ];
    const table: BrickConf = {
      brick: "visual-builder.pre-generated-table-view",
      properties: {
        style: {
          gridTemplateColumns: "120px 80px repeat(5, 1fr)",
        },
      },
      children: tableChildren,
    };

    let propertyIndex = 0;
    for (const [propertyId, candidatesByReadWriteType] of candidatesMap) {
      let readWriteTypeIndex = 0;
      const isLastProperty = propertyIndex === candidatesMap.size - 1;
      for (const [rwType, candidates] of candidatesByReadWriteType) {
        if (readWriteTypeIndex === 0) {
          let propertyName: string | undefined;

          for (const candidate of candidates.values()) {
            propertyName = candidate.propertyName ?? propertyId;
            break;
          }

          tableChildren.push({
            brick: "div",
            properties: {
              textContent: propertyName,
              className: isLastProperty ? "last-row-cell" : undefined,
              style: {
                gridRow: `span ${candidatesByReadWriteType.size}`,
              },
            },
          });
        }

        const isLastRow =
          isLastProperty &&
          readWriteTypeIndex === candidatesByReadWriteType.size - 1;

        tableChildren.push({
          brick: "div",
          properties: {
            textContent: rwType,
            className: isLastRow ? "last-row-cell" : undefined,
          },
        });

        for (let i = -2; i < 3; i++) {
          const candidate = candidates.get(i);

          let dataSource: unknown;
          if (candidate?.mockData?.length) {
            const mockValue =
              candidate.mockData[
                Math.floor(Math.random() * candidate.mockData.length)
              ];
            switch (candidate.category ?? category) {
              case "detail-item":
                dataSource = {
                  [propertyId]: mockValue,
                };
                break;
              case "table-column":
                dataSource = {
                  cellData: mockValue,
                };
            }
          }

          const classNames: string[] = [];

          if (i === 2) {
            classNames.push("last-col-cell");
          }
          if (isLastRow) {
            classNames.push("last-row-cell");
          }

          tableChildren.push({
            brick: "div",
            ...(classNames
              ? {
                  properties: {
                    className: classNames.join(" "),
                  },
                }
              : null),
            children: [
              {
                brick: "visual-builder.pre-generated-container",
                properties: {
                  useBrick: candidate?.storyboard ?? [],
                  dataSource,
                },
                errorBoundary: true,
              },
            ],
          });
        }

        readWriteTypeIndex++;
      }

      propertyIndex++;
    }

    // const tbodyChildren: BrickConf[] = [];
    // const table: BrickConf = {
    //   brick: "table",
    //   properties: {
    //     className: "preview-table",
    //   },
    //   children: [
    //     {
    //       brick: "thead",
    //       children: [
    //         {
    //           brick: "tr",
    //           slot: "head",
    //           children: [
    //             {
    //               brick: "th",
    //               properties: {
    //                 textContent: "属性",
    //               },
    //             },
    //             {
    //               brick: "th",
    //               properties: {
    //                 textContent: "类别",
    //               },
    //             },
    //             {
    //               brick: "th",
    //               properties: {
    //                 textContent: "展示等级",
    //                 colSpan: 5,
    //                 style: {
    //                   textAlign: "center",
    //                 }
    //               },
    //             },
    //           ],
    //         }
    //       ]
    //     },
    //     {
    //       brick: "tbody",
    //       children: tbodyChildren,
    //     },
    //   ],
    // };

    // for (const [propertyId, candidatesByReadWriteType] of candidatesMap) {
    //   let readWriteTypeIndex = 0;
    //   for (const [rwType, candidates] of candidatesByReadWriteType) {

    //     const row: BrickConf[] = []

    //     if (readWriteTypeIndex === 0) {
    //       let propertyName: string | undefined;

    //       for (const candidate of candidates.values()) {
    //         propertyName = candidate.propertyName ?? propertyId;
    //         break;
    //       }

    //       row.push({
    //         brick: "td",
    //         properties: {
    //           textContent: propertyName,
    //           rowSpan: candidatesByReadWriteType.size,
    //         },
    //       })
    //     }

    //     row.push({
    //       brick: "td",
    //       properties: {
    //         textContent: rwType,
    //       },
    //     });

    //     for (let i = -2; i < 3; i++) {
    //       const candidate = candidates.get(i);

    //       let dataSource: unknown;
    //       if (candidate?.mockData?.length) {
    //         const mockValue = candidate.mockData[
    //           Math.floor(Math.random() * candidate.mockData.length)
    //         ];
    //         switch (candidate.category ?? category) {
    //           case "detail-item":
    //             dataSource = {
    //               [propertyId]: mockValue
    //             };
    //             break;
    //           case "table-column":
    //             dataSource = {
    //               cellData: mockValue
    //             };
    //         }
    //       }

    //       row.push({
    //         brick: "td",
    //         children: [
    //           {
    //             brick: "visual-builder.pre-generated-container",
    //             properties: {
    //               useBrick: candidate?.storyboard ?? [],
    //               dataSource,
    //             }
    //           }
    //         ],
    //       });
    //     }
    //     tbodyChildren.push({
    //       brick: "tr",
    //       children: row,
    //     });

    //     readWriteTypeIndex++;
    //   }
    // }

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

  // useEffect(() => {
  //   if (!injected) {
  //     return;
  //   }
  //   const render = (iframeRef.current?.contentWindow as PreviewWindow)
  //     ?._preview_only_render;
  //   if (!render) {
  //     return;
  //   }

  //   const candidatesMap = new Map<string, AttributeCandidate[]>();
  //   const mocksMap = new Map<string, unknown[]>();
  //   let maxCandidatesCount = 0;

  //   for (const generation of generations) {
  //     candidatesMap.set(generation.id, generation.candidates);
  //     mocksMap.set(generation.id, generation.mocks);
  //     maxCandidatesCount = Math.max(
  //       maxCandidatesCount,
  //       generation.candidates.length
  //     );
  //   }

  //   const storyboards: BrickConf[] = [];

  //   for (let i = 0; i < maxCandidatesCount; i++) {
  //     const brick: BrickConf = {
  //       brick: "eo-descriptions",
  //       properties: {
  //         column: 1,
  //         dataSource: Object.fromEntries(
  //           Array.from(mocksMap.entries()).map(([id, mocks]) => [
  //             id,
  //             mocks[
  //               i < mocks.length ? i : Math.floor(Math.random() * mocks.length)
  //             ],
  //           ])
  //         ),
  //         list: generations.map((generation) => ({
  //           label: generation.name,
  //           useChildren: `[${generation.id}]`,
  //         })),
  //       },
  //       children: Array.from(candidatesMap.entries()).flatMap(
  //         ([id, candidates]) => {
  //           const children = ([] as BrickConf[]).concat(
  //             candidates[
  //               i < candidates.length
  //                 ? i
  //                 : Math.floor(Math.random() * candidates.length)
  //             ].storyboard
  //           );
  //           return children.map((child) => ({
  //             ...child,
  //             slot: `[${id}]`,
  //           }));
  //         }
  //       ),
  //     };
  //     storyboards.push(brick);
  //   }

  //   render(
  //     "yaml",
  //     {
  //       yaml: safeDump(storyboards, {
  //         schema: JSON_SCHEMA,
  //         skipInvalid: true,
  //         noRefs: true,
  //         noCompatMode: true,
  //       }),
  //     },
  //     {
  //       app,
  //       theme,
  //       uiVersion,
  //       styleText: `#preview-root { display: flex; flex-wrap: wrap; gap: 2em; }`,
  //     }
  //   );
  // }, [app, injected, generations, theme, uiVersion]);

  return (
    <div className={classNames("container")}>
      <iframe
        ref={iframeRef}
        src={`${getBasePath()}_brick-preview-v3_/preview/`}
        loading="lazy"
        onLoad={handleIframeLoad}
      />
    </div>
  );
}
