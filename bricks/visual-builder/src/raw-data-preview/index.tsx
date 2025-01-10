import React, { useCallback, useEffect, useRef, useState } from "react";
import { createDecorators, type EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import type { BrickConf, ContextConf, MicroApp } from "@next-core/types";
import classNames from "classnames";
import { __secret_internals, getBasePath } from "@next-core/runtime";
import type { PreviewWindow } from "@next-core/preview/types";
import { JSON_SCHEMA, safeDump } from "js-yaml";
import type { VisualConfig } from "./raw-data-interfaces";
import { convertToStoryboard } from "./convert";
import styleText from "./styles.shadow.css";
import previewStyleText from "./preview.shadow.css";

const { defineElement, property, event } = createDecorators();

export interface RawPreviewProps {
  previewUrl?: string;
  generations?: AttributeGeneration[];
  mocks?: Record<string, unknown>[];
  busy?: boolean;
  category?: PreviewCategory;
  theme?: string;
  uiVersion?: string;
  app?: MicroApp;
}

export interface AttributeGeneration {
  generationId?: string;
  objectId: string;
  objectName: string;
  propertyId: string;
  propertyName: string;
  propertyType?: string;
  propertyValues?: unknown[];
  propertyInstanceId?: string;
  comment?: string;
  approved?: boolean;
  candidates: VisualConfig[] | null;
  mockData: Record<string, unknown>[];
}

export interface CommentDetail {
  comment: string;
  propertyInstanceId?: string;
}

export interface ApproveDetail {
  approved: boolean;
  propertyInstanceId?: string;
}

interface BasePreviewMessage {
  channel: "raw-data-preview";
}

interface CommentMessage extends BasePreviewMessage {
  type: "comment";
  payload: CommentDetail;
}

interface ApproveMessage extends BasePreviewMessage {
  type: "approve";
  payload: ApproveDetail;
}

interface ViewAttrPromptMessage extends BasePreviewMessage {
  type: "viewAttrPrompt";
  payload: AttributeGeneration;
}

interface UpdatePropertyToggleStateMessage extends BasePreviewMessage {
  type: "updatePropertyToggleState";
  payload: string[];
}

interface UpdatePropertyExpandStateMessage extends BasePreviewMessage {
  type: "updatePropertyExpandState";
  payload: string[];
}

interface UpdatePropertyApproveStateMessage extends BasePreviewMessage {
  type: "updatePropertyApproveState";
  payload: string[];
}

type PreviewMessage =
  | CommentMessage
  | ApproveMessage
  | ViewAttrPromptMessage
  | UpdatePropertyToggleStateMessage
  | UpdatePropertyExpandStateMessage
  | UpdatePropertyApproveStateMessage;

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

  @property({ attribute: false })
  accessor mocks: Record<string, unknown>[] | undefined;

  @property({ type: Boolean })
  accessor busy: boolean | undefined;

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

  @event({ type: "comment" })
  accessor #commentEvent: EventEmitter<CommentDetail>;

  #handleComment = (detail: CommentDetail) => {
    this.#commentEvent.emit(detail);
  };

  @event({ type: "approve" })
  accessor #approveEvent: EventEmitter<ApproveDetail>;

  #handleApprove = (detail: ApproveDetail) => {
    this.#approveEvent.emit(detail);
  };

  @event({ type: "view.attr.prompt" })
  accessor #viewAttrPromptEvent: EventEmitter<AttributeGeneration>;

  #handleViewAttrPrompt = (detail: AttributeGeneration) => {
    this.#viewAttrPromptEvent.emit(detail);
  };

  render() {
    return (
      <RawDataPreviewComponent
        previewUrl={this.previewUrl}
        generations={this.generations}
        mocks={this.mocks}
        busy={this.busy}
        category={this.category}
        theme={this.theme}
        uiVersion={this.uiVersion}
        app={this.app}
        onComment={this.#handleComment}
        onApprove={this.#handleApprove}
        onViewAttrPrompt={this.#handleViewAttrPrompt}
      />
    );
  }
}

export interface RawDataPreviewComponentProps extends RawPreviewProps {
  onComment: (detail: CommentDetail) => void;
  onApprove: (detail: ApproveDetail) => void;
  onViewAttrPrompt: (detail: AttributeGeneration) => void;
}

export function RawDataPreviewComponent({
  previewUrl,
  generations,
  mocks,
  busy,
  category,
  theme,
  uiVersion,
  app,
  onComment,
  onApprove,
  onViewAttrPrompt,
}: RawDataPreviewComponentProps) {
  const iframeRef = useRef<HTMLIFrameElement>(undefined);
  const [ready, setReady] = useState(false);
  const [injected, setInjected] = useState(false);
  const propertyToggleStateRef = useRef<string[]>([]);
  const propertyExpandStateRef = useRef<string[]>([]);
  const propertyApproveStateRef = useRef<string[]>([]);

  useEffect(() => {
    propertyApproveStateRef.current =
      generations
        ?.filter((generation) => generation.approved)
        .map((generation) => generation.propertyId) ?? [];
  }, [generations]);

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
    if (ready) {
      const iframeWin = iframeRef.current!.contentWindow as PreviewWindow;
      iframeWin.postMessage(
        {
          channel: "raw-data-preview",
          type: "busy",
          payload: busy,
        },
        location.origin
      );
    }
  }, [busy, ready]);

  useEffect(() => {
    if (ready) {
      const iframeWin = iframeRef.current!.contentWindow as PreviewWindow;
      const onMessage = ({ data }: MessageEvent<PreviewMessage>) => {
        if (data?.channel === "raw-data-preview") {
          switch (data.type) {
            case "comment":
              onComment(data.payload);
              break;
            case "approve":
              onApprove(data.payload);
              break;
            case "viewAttrPrompt":
              onViewAttrPrompt(data.payload);
              break;
            case "updatePropertyToggleState":
              propertyToggleStateRef.current = data.payload;
              break;
            case "updatePropertyExpandState":
              propertyExpandStateRef.current = data.payload;
              break;
            case "updatePropertyApproveState":
              propertyApproveStateRef.current = data.payload;
              break;
          }
        }
      };
      iframeWin.addEventListener("message", onMessage);
      return () => {
        iframeWin.removeEventListener("message", onMessage);
      };
    }
  }, [onApprove, onComment, ready]);

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
  }, [previewUrl, ready]);

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
          textContent: "",
          className: "head-cell",
        },
      },
      {
        brick: "div",
        properties: {
          textContent: "类型",
          className: "head-cell",
        },
      },
      {
        brick: "div",
        properties: {
          textContent: "原始数据",
          className: "head-cell",
        },
      },
      {
        brick: "div",
        properties: {
          textContent: "视觉重量 (由低至高)",
          className: "head-cell",
          style: {
            gridColumn: "span 4",
            textAlign: "center",
          },
        },
      },
      {
        brick: "div",
        properties: {
          textContent: "确认",
          className: "head-cell",
        },
      },
      {
        brick: "div",
        properties: {
          className: "head-cell last-col-cell",
        },
        children: [
          {
            brick: "span",
            properties: {
              textContent: "批注",
            },
          },
          {
            brick: "span",
            properties: {
              className: "tips",
              textContent: "（补充提示词，按住 ⌘ 或 ctrl + 回车提交）",
            },
          },
        ],
      },
    ];
    const table: BrickConf & { context?: ContextConf[] } = {
      brick: "visual-builder.pre-generated-table-view",
      context: [
        {
          name: "propertyToggleState",
          value: propertyToggleStateRef.current,
          onChange: {
            action: "window.postMessage",
            args: [
              {
                channel: "raw-data-preview",
                type: "updatePropertyToggleState",
                payload: "<% CTX.propertyToggleState %>",
              },
            ],
          },
        },
        {
          name: "propertyExpandState",
          value: propertyExpandStateRef.current,
          onChange: {
            action: "window.postMessage",
            args: [
              {
                channel: "raw-data-preview",
                type: "updatePropertyExpandState",
                payload: "<% CTX.propertyExpandState %>",
              },
            ],
          },
        },
        {
          name: "propertyApproveState",
          value: propertyApproveStateRef.current,
          onChange: {
            action: "window.postMessage",
            args: [
              {
                channel: "raw-data-preview",
                type: "updatePropertyApproveState",
                payload: "<% CTX.propertyApproveState %>",
              },
            ],
          },
        },
        {
          name: "busy",
        },
      ],
      properties: {
        style: {
          gridTemplateColumns:
            "minmax(120px, 0.5fr) 32px auto repeat(5, 1fr) auto 1fr",
        },
      },
      children: tableChildren,
    };

    for (let i = 0, size = generations.length; i < size; i++) {
      const generation = generations[i];
      const isLastRow = i === size - 1;

      const candidatesByVisualWeight = new Map<number, VisualConfig>();
      for (const candidate of generation.candidates ?? []) {
        candidatesByVisualWeight.set(candidate.visualWeight ?? 0, candidate);
      }

      tableChildren.push(
        {
          brick: "div",
          properties: {
            className: classNames("body-cell", {
              "last-row-cell": isLastRow,
            }),
          },
          children: [
            {
              brick: "span",
              properties: {
                textContent: `${generation.propertyName ?? generation.propertyId}`,
              },
            },
            {
              // 多个示例的展开/收起按钮
              brick: "eo-button",
              properties: {
                className: "btn-toggle",
                type: "text",
                icon: `<%=
                  {
                    lib: "fa",
                    prefix: "fas",
                    icon: CTX.propertyToggleState.includes(${JSON.stringify(generation.propertyId)}) ? "chevron-up" : "chevron-down",
                  }
                %>`,
              },
              events: {
                click: {
                  action: "context.replace",
                  args: [
                    "propertyToggleState",
                    `<%
                      CTX.propertyToggleState.includes(${JSON.stringify(generation.propertyId)})
                        ? CTX.propertyToggleState.filter((id) => id !== ${JSON.stringify(generation.propertyId)})
                        : CTX.propertyToggleState.concat(${JSON.stringify(generation.propertyId)})
                    %>`,
                  ],
                },
              },
            },
          ],
        },
        {
          // 绿色圆点表示已生成
          brick: "div",
          properties: {
            className: classNames("body-cell", {
              "last-row-cell": isLastRow,
            }),
          },
          children: generation.candidates?.length
            ? [
                {
                  brick: "eo-icon",
                  properties: {
                    lib: "fa",
                    prefix: "fas",
                    icon: "circle",
                    style: {
                      color: generation.generationId
                        ? "var(--palette-green-6)"
                        : "var(--palette-gray-6)",
                      transformOrigin: "center center",
                      transform: "scale(0.5)",
                    },
                  },
                },
              ]
            : undefined,
        },
        {
          brick: "div",
          properties: {
            className: classNames("body-cell", {
              "last-row-cell": isLastRow,
            }),
          },
          children: [
            {
              brick: "eo-link",
              properties: {
                type: "text",
                textContent: generation.propertyType,
              },
              events: {
                click: {
                  action: "window.postMessage",
                  args: [
                    {
                      channel: "raw-data-preview",
                      type: "viewAttrPrompt",
                      payload: generation,
                    },
                  ],
                },
              },
            },
          ],
        }
      );

      let values = generation.propertyValues;
      if (!values) {
        const mockList = (generation.mockData ?? mocks ?? []).slice();
        mockList.sort((ma, mb) => {
          const a = ma?.[generation.propertyId];
          const b = mb?.[generation.propertyId];
          const aIsArray = Array.isArray(a);
          const bIsArray = Array.isArray(b);
          if (aIsArray || bIsArray) {
            return (bIsArray ? b.length : -1) - (aIsArray ? a.length : -1);
          }
          const aIsNil = a == null;
          const bIsNil = b == null;
          if (aIsNil || bIsNil) {
            return (bIsNil ? 0 : 1) - (aIsNil ? 0 : 1);
          }

          const aIsEmpty = typeof a === "string" && a.length === 0;
          const bIsEmpty = typeof b === "string" && b.length === 0;
          if (aIsEmpty || bIsEmpty) {
            return (bIsEmpty ? 0 : 1) - (aIsEmpty ? 0 : 1);
          }
          return 0;
        });
        values = mockList.map((mock) => mock[generation.propertyId]);
      }

      // 原始数据
      tableChildren.push({
        brick: "div",
        properties: {
          className: classNames("body-cell", {
            "last-row-cell": isLastRow,
          }),
        },
        children: [
          {
            brick: "div",
            properties: {
              className: "list",
            },
            children: values.map((mock, index) => ({
              brick: "div",
              if:
                index === 0
                  ? true
                  : `<%= CTX.propertyToggleState.includes(${JSON.stringify(generation.propertyId)}) %>`,
              properties: {
                className: `<%= \`raw-content\${ CTX.propertyExpandState.includes(${JSON.stringify(generation.propertyId)}) ? " expand" : "" }\` %>`,
                textContent:
                  mock === undefined
                    ? ""
                    : typeof mock === "string"
                      ? mock
                      : JSON.stringify(mock, null, 2),
              },
            })),
          },
          {
            // 原始数据的展开/收起按钮
            brick: "eo-button",
            properties: {
              className: "btn-toggle",
              type: "text",
              icon: `<%=
                {
                  lib: "fa",
                  prefix: "fas",
                  icon: CTX.propertyExpandState.includes(${JSON.stringify(generation.propertyId)}) ? "chevron-up" : "chevron-down",
                }
              %>`,
            },
            events: {
              click: {
                action: "context.replace",
                args: [
                  "propertyExpandState",
                  `<%
                    CTX.propertyExpandState.includes(${JSON.stringify(generation.propertyId)})
                      ? CTX.propertyExpandState.filter((id) => id !== ${JSON.stringify(generation.propertyId)})
                      : CTX.propertyExpandState.concat(${JSON.stringify(generation.propertyId)})
                  %>`,
                ],
              },
            },
          },
        ],
      });

      // 生成的编排
      for (let i = -1; i < 3; i++) {
        const candidate = candidatesByVisualWeight.get(i);

        let brick: BrickConf;
        if (candidate) {
          brick = convertToStoryboard(candidate, generation.propertyId);
        }

        tableChildren.push({
          brick: "div",
          properties: {
            className: classNames("body-cell", {
              "last-row-cell": isLastRow,
            }),
          },
          children: [
            {
              brick: "div",
              properties: {
                className: "list",
              },
              children: brick
                ? values.map((mock, index) => ({
                    brick: "visual-builder.pre-generated-container",
                    if:
                      index === 0
                        ? true
                        : `<%= CTX.propertyToggleState.includes(${JSON.stringify(generation.propertyId)}) %>`,
                    properties: {
                      useBrick: [brick],
                      dataSource: {
                        [generation.propertyId]: mock,
                      },
                    },
                    errorBoundary: true,
                  }))
                : undefined,
            },
          ],
        });
      }

      tableChildren.push(
        {
          // 确认 checkbox
          brick: "div",
          properties: {
            className: classNames("body-cell", {
              "last-row-cell": isLastRow,
            }),
          },
          children: generation.candidates
            ? [
                {
                  brick: "eo-checkbox",
                  properties: {
                    value: `<%= CTX.propertyApproveState.includes(${JSON.stringify(generation.propertyId)}) ? ["approved"] : [] %>`,
                    options: [{ label: "", value: "approved" }],
                    disabled: "<%= CTX.busy %>",
                  },
                  events: {
                    change: [
                      {
                        action: "window.postMessage",
                        args: [
                          {
                            channel: "raw-data-preview",
                            type: "approve",
                            payload: {
                              approved: "<% EVENT.detail.length > 0 %>",
                              propertyInstanceId: generation.propertyInstanceId,
                            },
                          },
                        ],
                      },
                      {
                        action: "context.replace",
                        args: [
                          "propertyApproveState",
                          `<%
                            EVENT.detail.length > 0
                              ? CTX.propertyApproveState.concat(${JSON.stringify(generation.propertyId)})
                              : CTX.propertyApproveState.filter((id) => id !== ${JSON.stringify(generation.propertyId)})
                          %>`,
                        ],
                      },
                    ],
                  },
                },
              ]
            : undefined,
        },
        {
          // 批注 textarea
          brick: "div",
          properties: {
            className: classNames("body-cell", {
              "last-col-cell": true,
              "last-row-cell": isLastRow,
            }),
          },
          children: generation.candidates
            ? [
                {
                  brick: "eo-textarea",
                  properties: {
                    value: generation.comment
                      ? `<% ${JSON.stringify(generation.comment)} %>`
                      : undefined,
                    autoSize: true,
                    style: {
                      width: "100%",
                    },
                    disabled: `<%= CTX.busy || CTX.propertyApproveState.includes(${JSON.stringify(generation.propertyId)}) %>`,
                  },
                  events: {
                    keydown: {
                      if: "<% EVENT.code === 'Enter' && (EVENT.metaKey || EVENT.ctrlKey) %>",
                      action: "window.postMessage",
                      args: [
                        {
                          channel: "raw-data-preview",
                          type: "comment",
                          payload: {
                            comment: "<% EVENT.target.value %>",
                            propertyInstanceId: generation.propertyInstanceId,
                          },
                        },
                      ],
                    },
                  },
                },
              ]
            : undefined,
        }
      );
    }

    render(
      "yaml",
      {
        yaml: safeDump(
          [
            table,
            {
              brick: "eo-message-listener",
              properties: {
                sameOrigin: true,
              },
              events: {
                message: {
                  if: "<% EVENT.detail.data?.channel === 'raw-data-preview' && EVENT.detail.data.type === 'busy' %>",
                  action: "context.replace",
                  args: ["busy", "<% EVENT.detail.data.payload %>"],
                },
              },
              portal: true,
              errorBoundary: true,
            },
          ],
          {
            schema: JSON_SCHEMA,
            skipInvalid: true,
            noRefs: true,
            noCompatMode: true,
          }
        ),
      },
      {
        app,
        theme,
        uiVersion,
        styleText: previewStyleText,
      }
    );
  }, [app, injected, generations, theme, uiVersion, category, mocks]);

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
