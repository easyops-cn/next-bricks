import {
  getHistory as _getHistory,
  getBasePath,
  matchPath as _matchPath,
  __secret_internals as _internals,
  type NextLocation,
} from "@next-core/runtime";
import type { BrickConf, CustomTemplate, RouteConf } from "@next-core/types";
import { isEmpty, throttle } from "lodash";
import type {
  BrickOutline,
  HighLightNode,
  Position,
  PreviewDataOption,
  PreviewMessageFromPreviewer,
  PreviewMessagePreviewContractUpdate,
  PreviewMessagePreviewDataValueError,
  PreviewMessagePreviewDataValueSuccess,
  PreviewMessagePreviewerCaptureFailed,
  PreviewMessagePreviewerCaptureOk,
  PreviewMessagePreviewerContentScroll,
  PreviewMessagePreviewerHighlightBrick,
  PreviewMessagePreviewerHighlightContext,
  PreviewMessagePreviewerHoverOnMain,
  PreviewMessagePreviewerRealTimeDataInspectChange,
  PreviewMessagePreviewerRouteMatchChange,
  PreviewMessagePreviewerScroll,
  PreviewMessagePreviewerUrlChange,
  PreviewMessageToPreviewer,
  PreviewSettings,
  PreviewStartOptions,
} from "./interfaces.js";
import { capture } from "./capture.js";
import {
  previewProxyOrigin,
  getPossibleBrickIidList,
  setPreviewFromOrigin,
  startInspecting,
  stopInspecting,
} from "./inspector.js";
import { collectUsedContracts } from "../collect-used-contracts.js";
import { getRealTimeDataAnnotation } from "./realTimeDataInspect.js";

let connected = false;

interface DLL {
  (moduleId: "tYg3"): {
    getHistory: typeof _getHistory;
    developHelper: typeof _internals;
  };
  (moduleId: "A+yw"): {
    matchPath: typeof _matchPath;
  };
}

let getHistory = _getHistory;
let matchPath = _matchPath;
let __secret_internals = _internals;
let isV2 = false;

// istanbul ignore next
// Make v3 bricks compatible with Brick Next v2.
try {
  const dll = (window as unknown as { dll?: DLL }).dll;
  if (
    dll &&
    window.BRICK_NEXT_VERSIONS?.["brick-container"]?.startsWith("2.")
  ) {
    const { getHistory: getHistoryV2, developHelper: developHelperV2 } =
      dll("tYg3");
    const { matchPath: matchPathV2 } = dll("A+yw");
    getHistory = getHistoryV2;
    matchPath = matchPathV2;
    // The `__secret_internals` of v3 has pretty the same API as
    // `developHelper` of v2, especially those for preview usage.
    __secret_internals = {
      ...developHelperV2,
      getContextValue(name, { tplStateStoreId }) {
        return developHelperV2.getContextValue(name, {
          tplContextId: tplStateStoreId,
        } as any);
      },
      getAllContextValues({ tplStateStoreId }) {
        // V3 returns an object of key-value.
        // While v2 returns a map of ContextItem.
        const v2Map = developHelperV2.getAllContextValues({
          tplContextId: tplStateStoreId,
        } as any) as unknown as Map<string, { value: unknown }>;
        return Object.fromEntries(
          [...v2Map].map(([k, v]) => [k, (v as any).value])
        );
      },
    };
    isV2 = true;
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.error("Try to use v2 runtime APIs failed:", e);
}

let contentScrollElement: Element | null = null;
let contentScrollHost: Element | null = null;

export default async function connect(
  previewFromOrigin: string,
  options: PreviewStartOptions
) {
  if (connected) {
    return;
  }
  connected = true;

  const sendMessage = <T extends PreviewMessageFromPreviewer>(
    message: Omit<T, "sender">
  ): void => {
    window.parent.postMessage(
      {
        sender: "previewer",
        ...message,
      },
      previewFromOrigin
    );
  };

  sendMessage({ type: "preview-started" });
  setPreviewFromOrigin(previewFromOrigin);

  let hoverIid: string;
  let hoverAlias: string;
  let activeIid: string;
  let activeAlias: string;

  const handleHoverOnIframe = (pos: Position): void => {
    const element = document.elementFromPoint(pos.x, pos.y);
    if (element?.tagName === "BODY") {
      window.parent.postMessage(
        {
          sender: "previewer",
          type: "hover-on-main",
          isDirection: true,
          position: {
            x: pos.x,
            y: pos.y,
          },
        } as PreviewMessagePreviewerHoverOnMain,
        previewProxyOrigin
      );
    } else {
      const iidList = getPossibleBrickIidList(element as HTMLElement);
      window.parent.postMessage(
        {
          sender: "previewer",
          type: "hover-on-brick",
          iidList,
          isDirection: true,
          position: {
            x: pos.x,
            y: pos.y,
          },
        },
        previewProxyOrigin
      );
    }
  };

  const sendHighlightBrickOutlines = (
    type: "hover" | "active",
    iid: string,
    alias: string
  ): void => {
    const outlines = getBrickOutlines(iid);
    sendMessage<PreviewMessagePreviewerHighlightBrick>({
      type: "highlight-brick",
      highlightType: type,
      outlines,
      iid: iid,
      alias: alias,
    });
  };

  const sendHighlightBricksOutlines = (nodes: HighLightNode[]): void => {
    const outlines = nodes
      .map((node) => getBrickOutlines(node.iid, node.alias))
      .flat();
    sendMessage<PreviewMessagePreviewerHighlightContext>({
      type: "highlight-context",
      outlines,
    });
  };

  let lastTemplatePreviewSettings: PreviewSettings | undefined;
  if (options.templateId) {
    lastTemplatePreviewSettings = options.settings;
  }

  const updateTemplatePreviewSettings = (): void => {
    __secret_internals.updateTemplatePreviewSettings(
      options.appId,
      options.templateId!,
      lastTemplatePreviewSettings
    );
    getHistory().reload();
  };

  const updateSnippetPreviewSettings = (): void => {
    __secret_internals.updateSnippetPreviewSettings(
      options.appId,
      JSON.parse(options.snippetData)
    );
    getHistory().reload();
  };

  /* const updateFormPreviewSettings = (): void => {
    __secret_internals.updateFormPreviewSettings(
      options.appId,
      options.formId,
      options.formData
    );
    getHistory().reload();
  }; */

  const handlePreviewData = (name: string, option: PreviewDataOption): void => {
    try {
      const { dataType } = option;
      let tplStateStoreId;

      if (dataType === "state") {
        tplStateStoreId = getRootTplStateStoreId();

        if (!tplStateStoreId) {
          sendMessage<PreviewMessagePreviewDataValueError>({
            type: "inspect-data-value-error",
            data: {
              error: {
                message:
                  "tplStateStoreId not found, unable to preview STATE value",
              },
            },
          });

          return;
        }
      }

      let value, type: PreviewMessagePreviewDataValueSuccess["type"];
      if (name) {
        type = "inspect-single-data-value-success";
        value = __secret_internals.getContextValue(name, {
          tplStateStoreId,
        });
      } else {
        type = "inspect-all-data-values-success";
        const data = __secret_internals.getAllContextValues({
          tplStateStoreId,
        });
        value = Object.entries(data).map(([name, value]) => ({ name, value }));
      }

      sendMessage<PreviewMessagePreviewDataValueSuccess>({
        type,
        data: {
          name,
          value,
        },
      });

      // istanbul ignore next
    } catch (error) {
      sendMessage<PreviewMessagePreviewDataValueError>({
        type: "inspect-data-value-error",
        data: {
          message: (error as Error).message,
        },
      });
    }
  };

  const history = getHistory();

  window.addEventListener(
    "message",
    async ({ data, origin }: MessageEvent<PreviewMessageToPreviewer>) => {
      if (
        origin !== previewFromOrigin ||
        !data ||
        data.sender !== "preview-container"
      ) {
        return;
      }
      if (data.forwardedFor === "builder") {
        switch (data.type) {
          case "hover-on-brick":
            hoverIid = data.iid;
            hoverAlias = data.alias;
            sendHighlightBrickOutlines("hover", data.iid, data.alias);
            break;
          case "hover-on-main":
            sendHighlightBrickOutlines("hover", "#main-mount-point", "root");
            break;
          case "hover-on-context":
            sendHighlightBricksOutlines(data.highlightNodes);
            break;
          case "select-brick":
            activeIid = data.iid;
            activeAlias = data.alias;
            sendHighlightBrickOutlines("active", data.iid, data.alias);
            break;
          case "hover-on-iframe":
            handleHoverOnIframe(data.position);
            break;
        }
      } else
        switch (data.type) {
          case "toggle-inspecting":
            data.enabled ? startInspecting() : stopInspecting();
            break;
          case "refresh":
            if (data.options?.updateStoryboardType) {
              if (data.options.updateStoryboardType === "route") {
                __secret_internals.updateStoryboardByRoute(
                  options.appId,
                  data.storyboardPatch as RouteConf
                );
              } else if (data.options.updateStoryboardType === "template") {
                __secret_internals.updateStoryboardByTemplate(
                  options.appId,
                  data.storyboardPatch as CustomTemplate,
                  data.options.settings
                );
              } else if (data.options.updateStoryboardType === "snippet") {
                __secret_internals.updateStoryboardBySnippet(
                  options.appId,
                  data.storyboardPatch as {
                    snippetId: string;
                    bricks: BrickConf[];
                  }
                );
              } /* else if (data.options.updateStoryboardType === "form") {
                __secret_internals.updateFormPreviewSettings(
                  options.appId,
                  options.formId,
                  data.storyboardPatch as FormDataProperties
                );
              } */

              const newContracts = await (
                __secret_internals as any
              ).getAddedContracts?.(data.storyboardPatch, {
                appId: options.appId,
                updateStoryboardType: data.options.updateStoryboardType,
                formId: options.formId,
                collectUsedContracts,
              });

              if (!isEmpty(newContracts)) {
                sendMessage<PreviewMessagePreviewContractUpdate>({
                  type: "contract-update",
                  data: {
                    add: newContracts,
                  },
                });
              } else {
                getHistory().reload();
              }

              break;
            }
            __secret_internals.updateStoryboard(
              options.appId,
              data.storyboardPatch
            );
            if (options.templateId) {
              lastTemplatePreviewSettings = data.settings;
              updateTemplatePreviewSettings();
            } /* else if (options.formId || options.formData) {
              updateFormPreviewSettings();
            } */ else if (data.options?.snippetData) {
              options.snippetData = data.options.snippetData;
              updateSnippetPreviewSettings();
            } else {
              getHistory().reload();
            }
            break;
          case "reload":
            location.reload();
            break;
          case "back":
            history.goBack();
            break;
          case "forward":
            history.goForward();
            break;
          case "capture":
            capture(data.maxWidth, data.maxHeight).then(
              (screenshot) => {
                sendMessage<PreviewMessagePreviewerCaptureOk>({
                  type: "capture-ok",
                  screenshot,
                });
              },
              () => {
                sendMessage<PreviewMessagePreviewerCaptureFailed>({
                  type: "capture-failed",
                });
              }
            );
            break;
          case "inspect-data-value":
            handlePreviewData(data.name, data.option);
            break;
          case "update-preview-url": {
            // Remove origin first.
            const url = data.previewUrl.startsWith(window.origin)
              ? data.previewUrl.substring(window.origin.length)
              : data.previewUrl;
            // Then remove base path.
            const basePath = getBasePath();
            const to = url.startsWith(basePath)
              ? url.substring(basePath.length - 1)
              : url;
            getHistory().push(to);
            break;
          }
          case "update-preview-route": {
            options.routePath = data.routePath;
            options.routeExact = data.routeExact;
            syncRouteMatch();
            break;
          }
          /* case "excute-proxy-method": {
            const [ref, method, args = []] = data.proxyMethodArgs;
            try {
              const result = document.body.querySelector(ref)[method](...args);
              window.parent.postMessage({
                sender: "previewer",
                type: "excute-proxy-method-success",
                data: { method: method, res: result },
              });
            } catch (err) {
              window.parent.postMessage({
                sender: "previewer",
                type: "excute-proxy-method-error",
                data: { method: method, res: err.message },
              });
            }
            break;
          } */
        }
    }
  );

  window.addEventListener("scroll", () => {
    sendMessage<PreviewMessagePreviewerScroll>({
      type: "scroll",
      scroll: {
        x: window.scrollX,
        y: window.scrollY,
      },
    });
  });

  let previewPageMatch = true;
  let currentLocation: NextLocation;
  const sendLocationChange = (loc: NextLocation): void => {
    sendMessage<PreviewMessagePreviewerUrlChange>({
      type: "url-change",
      url: location.origin + history.createHref(loc),
    });
    currentLocation = loc;
    syncRouteMatch();
  };

  function syncRouteMatch() {
    if (options.routePath) {
      const match = !!matchPath(currentLocation.pathname, {
        path: options.routePath,
        exact: options.routeExact,
      });
      sendMessage<PreviewMessagePreviewerRouteMatchChange>({
        type: "route-match-change",
        match,
      });

      // Re-update template preview settings once match route again (typically after login).
      if (options.templateId && !previewPageMatch && match) {
        const mainMountPoint = document.querySelector("#main-mount-point")!;
        const placeholderLoadObserver = new MutationObserver(() => {
          // We observe when the placeholder is appeared.
          if (
            mainMountPoint.childNodes.length === 1 &&
            (mainMountPoint.firstChild as HTMLElement).tagName === "SPAN" &&
            mainMountPoint.firstChild!.childNodes.length === 0
          ) {
            updateTemplatePreviewSettings();
            placeholderLoadObserver.disconnect();
          }
        });
        placeholderLoadObserver.observe(mainMountPoint, { childList: true });
      }
      /* if (options.formId && !previewPageMatch && match) {
        const mainMountPoint = document.querySelector("#main-mount-point");
        const placeholderLoadObserver = new MutationObserver(() => {
          // We observe when the placeholder is appeared.
          if (
            mainMountPoint.childNodes.length === 1 &&
            (mainMountPoint.firstChild as HTMLElement).tagName === "SPAN" &&
            mainMountPoint.firstChild.childNodes.length === 0
          ) {
            updateFormPreviewSettings();
            placeholderLoadObserver.disconnect();
          }
        });
        placeholderLoadObserver.observe(mainMountPoint, { childList: true });
      } */
      if (options.snippetData && !previewPageMatch && match) {
        const mainMountPoint = document.querySelector("#main-mount-point")!;
        const placeholderLoadObserver = new MutationObserver(() => {
          // We observe when the placeholder is appeared.
          if (
            mainMountPoint.childNodes.length === 1 &&
            (mainMountPoint.firstChild as HTMLElement).tagName === "SPAN" &&
            mainMountPoint.firstChild!.childNodes.length === 0
          ) {
            updateSnippetPreviewSettings();
            placeholderLoadObserver.disconnect();
          }
        });
        placeholderLoadObserver.observe(mainMountPoint, { childList: true });
      }
      previewPageMatch = match;
    }
  }

  sendLocationChange(history.location);

  history.listen(sendLocationChange);

  if (options.templateId) {
    updateTemplatePreviewSettings();
  }

  /* if (options.formId || options.formData) {
    updateFormPreviewSettings();
  } */

  if (options.snippetData) {
    updateSnippetPreviewSettings();
  }

  function setupContentScroll() {
    const host = document.querySelector("eo-page-view");
    const element = host?.shadowRoot?.querySelector(".content") ?? null;
    if (element !== contentScrollElement) {
      contentScrollElement?.removeEventListener("scroll", onContentScroll);
      element?.addEventListener("scroll", onContentScroll);
      contentScrollElement = element;
      contentScrollHost = host;
    }
  }

  function onContentScroll(this: Element) {
    sendMessage<PreviewMessagePreviewerContentScroll>({
      type: "content-scroll",
      scroll: {
        x: this.scrollLeft,
        y: this.scrollTop,
      },
    });
  }

  __secret_internals.addRealTimeDataInspectHook?.(
    ({ changeType, tplStateStoreId, detail }) => {
      sendMessage<PreviewMessagePreviewerRealTimeDataInspectChange>({
        type: "real-time-data-inspect-change",
        changeType,
        tplStateStoreId,
        detail:
          changeType === "update"
            ? {
                name: detail.name,
                annotation: getRealTimeDataAnnotation(detail.value),
              }
            : {
                data: Object.fromEntries(
                  Object.entries(detail.data).map(([k, v]) => [
                    k,
                    getRealTimeDataAnnotation(v),
                  ])
                ),
              },
      });
    }
  );

  let memoizedRootTplStateStoreId: string | undefined;

  function setupRealTimeDataInspect(force?: boolean) {
    const tplStateStoreId = options.templateId
      ? getRootTplStateStoreId()
      : undefined;
    if (memoizedRootTplStateStoreId !== tplStateStoreId || force) {
      memoizedRootTplStateStoreId = tplStateStoreId;
      __secret_internals.setRealTimeDataInspectRoot?.({
        tplStateStoreId,
      });
    }
  }

  window.addEventListener("route.render", () => {
    setupRealTimeDataInspect(true);
  });

  setupContentScroll();
  setupRealTimeDataInspect(true);

  const mutationCallback = (): void => {
    setupContentScroll();
    setupRealTimeDataInspect();
    if (hoverIid) {
      sendHighlightBrickOutlines("hover", hoverIid, hoverAlias);
    }
    if (activeIid) {
      sendHighlightBrickOutlines("active", activeIid, activeAlias);
    }
  };
  const mutationObserver = new MutationObserver(
    throttle(mutationCallback, 100, { leading: false })
  );
  mutationObserver.observe(document.body, { subtree: true, childList: true });
}

function getBrickOutlines(iid: string, alias?: string): BrickOutline[] {
  if (!iid) {
    return [];
  }
  const isRoot = iid.includes("#");
  const elements = getElementsIncludingInShadowDOM(iid, isRoot);
  const outlines = getOutlines(elements, alias);
  return isRoot
    ? outlines.map((item) => ({
        ...item,
        height: window.innerHeight - item.top,
      }))
    : outlines;
}

function getElementsIncludingInShadowDOM(
  iid: string,
  isRoot: boolean
): HTMLElement[] {
  const elements: HTMLElement[] = [];

  function walk(root: Document | ShadowRoot) {
    const candidates = root.querySelectorAll<HTMLElement>(
      isRoot ? iid : `[data-iid="${iid}"]`
    );
    elements.push(...candidates);

    // If elements are found in the document, we should stop searching in shadow DOM.
    if (root === document && candidates.length > 0) {
      return;
    }

    // These useBrick in v3 bricks will be inside shadow DOM.
    for (const item of root.querySelectorAll("*")) {
      if (item.shadowRoot) {
        walk(item.shadowRoot);
      }
    }
  }

  walk(document);

  return elements;
}

function getOutlines(elements: HTMLElement[], alias?: string): BrickOutline[] {
  return elements.map((element) => {
    const hasContentScroll = contentScrollHost?.contains(element);
    const { width, height, left, top } = element.getBoundingClientRect();
    return {
      width,
      height,
      left:
        left +
        window.scrollX +
        (hasContentScroll ? contentScrollElement.scrollLeft : 0),
      top:
        top +
        window.scrollY +
        (hasContentScroll ? contentScrollElement.scrollTop : 0),
      alias,
      hasContentScroll,
    };
  });
}

function getRootTplStateStoreId(): string | undefined {
  const mainMountPoint = document.querySelector("#main-mount-point")!;

  return (mainMountPoint?.firstChild as HTMLElement)?.dataset[
    isV2 ? "tplContextId" : "tplStateStoreId"
  ];
}
