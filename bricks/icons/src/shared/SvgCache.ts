import { RangeRequest, supportsMultipartRangeRequest } from "./RangeRequest";

// https://github.com/shoelace-style/shoelace/blob/e0fd6b210ea203100f90872181843ff59eb1267d/src/components/icon/icon.ts
const CACHEABLE_ERROR = Symbol();
const RETRYABLE_ERROR = Symbol();
type SVGResult =
  | SVGSVGElement
  | typeof RETRYABLE_ERROR
  | typeof CACHEABLE_ERROR;

let parser: DOMParser;
const iconCache = new Map<string, Promise<SVGResult>>();

interface ResolveIconOptions {
  currentColor?: boolean;
  lib?: "easyops" | "antd" | "lucide";
  id?: string;
}

const REGEX_MICRO_APPS_WITH_VERSION = /\/micro-apps\/v([23])\//;

const antdRangeRequest = new RangeRequest("antd");
const easyopsRangeRequest = new RangeRequest("easyops");

/** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
async function resolveIcon(
  url: string,
  options?: ResolveIconOptions,
  isFix?: boolean
): Promise<SVGResult> {
  let content: string | undefined;

  // istanbul ignore next: experimental
  try {
    if (
      options?.id &&
      options?.lib !== "lucide" &&
      (await supportsMultipartRangeRequest())
    ) {
      const rangeRequest =
        options.lib === "easyops" ? easyopsRangeRequest : antdRangeRequest;
      content = await rangeRequest.fetch(options.id);
    }
  } catch {
    // Fallback to traditional fetch.
  }

  if (!content) {
    let fileData: Response;
    try {
      fileData = await fetch(url, { mode: "cors" });
      if (!fileData.ok) {
        // Fix accessing images of v2 micro-apps in v3 container, and vice versa.
        if (
          !isFix &&
          fileData.status === 404 &&
          REGEX_MICRO_APPS_WITH_VERSION.test(url)
        ) {
          const fixedUrl = url.replace(
            REGEX_MICRO_APPS_WITH_VERSION,
            (_, v) => `/micro-apps/v${v === "2" ? "3" : "2"}/`
          );
          return resolveIcon(fixedUrl, options, true);
        }
        return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
      }
    } catch {
      return RETRYABLE_ERROR;
    }

    try {
      content = await fileData.text();
    } catch {
      return CACHEABLE_ERROR;
    }
  }

  return constructSvgElement(content, options);
}

export function constructSvgElement(
  content: string,
  options?: ResolveIconOptions
) {
  try {
    const div = document.createElement("div");
    div.innerHTML = content;

    const svg = div.firstElementChild;
    if (svg?.tagName?.toLowerCase() !== "svg") return CACHEABLE_ERROR;

    if (!parser) parser = new DOMParser();
    const doc = parser.parseFromString(svg.outerHTML, "text/html");

    const svgEl = doc.body.querySelector("svg");
    if (!svgEl) return CACHEABLE_ERROR;

    const titles = svgEl.querySelectorAll("title");
    for (const title of titles) {
      title.remove();
    }

    if (options?.currentColor) {
      const colorProps = [
        "color",
        "fill",
        "stroke",
        "stop-color",
        "flood-color",
        "lighting-color",
      ];
      for (const prop of colorProps) {
        const elements = svgEl.querySelectorAll(
          `[${prop}]:not([${prop}="none"])`
        );
        for (const e of elements) {
          if (!belongToMask(e, svgEl)) {
            e.setAttribute(prop, "currentColor");
          }
        }
      }
    }

    svgEl.setAttribute("width", "1em");
    svgEl.setAttribute("height", "1em");
    return document.adoptNode(svgEl);
  } catch {
    return CACHEABLE_ERROR;
  }
}

export async function getIcon(
  url: string | undefined,
  options?: ResolveIconOptions
) {
  if (!url) {
    return null;
  }

  let iconResolver = iconCache.get(url);
  if (!iconResolver) {
    iconResolver = resolveIcon(url, options);
    iconCache.set(url, iconResolver);
  }

  const svg = await iconResolver;
  if (svg === RETRYABLE_ERROR) {
    iconCache.delete(url);
  }

  switch (svg) {
    case RETRYABLE_ERROR:
    case CACHEABLE_ERROR:
      return null;
    default:
      return svg.cloneNode(true) as SVGElement;
  }
}

function belongToMask(e: Element | null, svg: SVGSVGElement) {
  while (e) {
    if (e === svg) {
      return false;
    }
    if (e.tagName === "mask") {
      return true;
    }
    e = e.parentElement;
  }
}
