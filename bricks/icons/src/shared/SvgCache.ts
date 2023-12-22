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
  replaceSource?(source: string): string;
}

/** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
async function resolveIcon(
  url: string,
  options?: ResolveIconOptions
): Promise<SVGResult> {
  let fileData: Response;
  try {
    fileData = await fetch(url, { mode: "cors" });
    if (!fileData.ok)
      return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
  } catch {
    return RETRYABLE_ERROR;
  }

  try {
    const div = document.createElement("div");
    div.innerHTML = await fileData.text();

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
