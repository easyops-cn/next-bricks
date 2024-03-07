import { getCurrentTheme } from "@next-core/runtime";
import { FontGap, getClips } from "./getClips.js";
import { createProviderClass } from "@next-core/utils/general";

export interface WatermarkProps {
  container?: HTMLElement | string;
  content?: string | string[];
  zIndex?: number;
  rotate?: number;
  width?: number;
  height?: number;
  image?: string;
  font?: {
    color?: CanvasFillStrokeStyles["fillStyle"];
    fontSize?: number | string;
    fontWeight?: "normal" | "light" | "weight" | number;
    fontStyle?: "none" | "normal" | "italic" | "oblique";
    fontFamily?: string;
    textAlign?: CanvasTextAlign;
  };
  style?: React.CSSProperties;
  gap?: [number, number];
  offset?: [number, number];
}

const DEFAULT_GAP_X = 100;
const DEFAULT_GAP_Y = 100;

const watermarkMap = new Map<HTMLElement, HTMLDivElement>();
const observeMap = new Map<HTMLElement, MutationObserver>();

function toLowercaseSeparator(key: string) {
  return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

function getStyleStr(style: React.CSSProperties): string {
  return Object.keys(style)
    .map(
      (key) =>
        `${toLowercaseSeparator(key)}: ${style[key as keyof React.CSSProperties]};`
    )
    .join(" ");
}

const isWatermarkEle = (ele: any) =>
  Array.from(watermarkMap.values()).includes(ele);

const appendWatermark = (
  base64Url: string,
  markWidth: number,
  container: HTMLElement,
  style: React.CSSProperties
) => {
  if (container) {
    const element = watermarkMap.get(container);
    const hadElement = element && container.contains(element);
    if (!hadElement) {
      const newWatermarkEle = document.createElement("div");
      watermarkMap.set(container, newWatermarkEle);
    }

    const watermarkEle = watermarkMap.get(container)!;

    const defaultStyle = getStyleStr({
      ...style,
      backgroundImage: `url('${base64Url}')`,
      backgroundSize: `${Math.floor(markWidth)}px`,
    });
    const elementStyle = watermarkEle.getAttribute("style");

    if (elementStyle !== defaultStyle) {
      watermarkEle.setAttribute("style", defaultStyle);
    }

    // Prevents using the browser `Hide Element` to hide watermarks
    watermarkEle.hasAttribute("class") && watermarkEle.removeAttribute("class");

    !hadElement && container.append(watermarkEle);
  }
};

export function showWaterMark({
  zIndex = 9,
  rotate = -22,
  width,
  height,
  image,
  content,
  font = {},
  style,
  container: _container,
  gap = [DEFAULT_GAP_X, DEFAULT_GAP_Y],
}: WatermarkProps): void {
  const computedContainer = (
    element?: HTMLElement | string
  ): HTMLElement | null => {
    if (typeof element === "string") {
      return document.querySelector(element);
    }
    return element ?? document.body;
  };
  const container = computedContainer(_container);
  if (!container) return;
  const containerObserve = observeMap.get(container);

  if (containerObserve) {
    containerObserve.disconnect();
  }

  const {
    color,
    fontSize = "14",
    fontWeight = "normal",
    fontStyle = "normal",
    fontFamily = "sans-serif",
    textAlign = "center",
  } = font;

  const [gapX = DEFAULT_GAP_X, gapY = DEFAULT_GAP_Y] = gap;

  const mergedStyle: React.CSSProperties = {
    zIndex,
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    backgroundRepeat: "repeat",
  };

  const defaultStyle = {
    ...mergedStyle,
    ...style,
  };

  const getMarkSize = (ctx: CanvasRenderingContext2D) => {
    let defaultWidth = 120;
    let defaultHeight = 64;
    if (!image && ctx.measureText) {
      ctx.font = `${Number(fontSize)}px ${fontFamily}`;
      const contents = Array.isArray(content) ? content : [content];
      const sizes = contents.map((item) => {
        const metrics = ctx.measureText(item!);

        return [
          metrics.width,
          metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent,
        ];
      });
      defaultWidth = Math.ceil(Math.max(...sizes.map((size) => size[0])));
      defaultHeight =
        Math.ceil(Math.max(...sizes.map((size) => size[1]))) * contents.length +
        (contents.length - 1) * FontGap;
    }
    return [width ?? defaultWidth, height ?? defaultHeight] as const;
  };

  const renderWatermark = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (ctx) {
      const ratio = 1;
      const [markWidth, markHeight] = getMarkSize(ctx);

      const drawCanvas = (
        drawContent?: NonNullable<WatermarkProps["content"]> | HTMLImageElement
      ) => {
        const [nextClips, clipWidth] = getClips(
          drawContent || "",
          rotate,
          ratio,
          markWidth,
          markHeight,
          {
            color: color
              ? color
              : getCurrentTheme() === "light"
                ? "rgba(0, 0, 0, 0.15)"
                : "rgba(255, 255, 255, 0.4)",
            fontSize,
            fontStyle,
            fontWeight,
            fontFamily,
            textAlign,
          },
          gapX,
          gapY
        );

        appendWatermark(nextClips, clipWidth, container, defaultStyle);
      };

      if (image) {
        const img = new Image();
        img.onload = () => {
          drawCanvas(img);
        };
        img.onerror = () => {
          drawCanvas(content);
        };
        img.crossOrigin = "anonymous";
        img.referrerPolicy = "no-referrer";
        img.src = image;
      } else {
        drawCanvas(content);
      }
    }
  };

  const reRendering = (
    mutation: MutationRecord,
    isWatermarkEle: (ele: Node) => boolean
  ) => {
    let flag = false;
    // Whether to delete the watermark node
    if (mutation.removedNodes.length) {
      flag = Array.from<Node>(mutation.removedNodes).some((node) =>
        isWatermarkEle(node)
      );
    }
    // Whether the watermark dom property value has been modified
    if (mutation.type === "attributes" && isWatermarkEle(mutation.target)) {
      flag = true;
    }
    return flag;
  };

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (reRendering(mutation, isWatermarkEle)) {
        renderWatermark();
      }
    });
  });

  observer.observe(container, {
    subtree: true,
    childList: true,
    attributeFilter: ["style", "class"],
  });

  observeMap.set(container, observer);

  window.addEventListener("theme.change", renderWatermark);

  renderWatermark();
}

customElements.define(
  "basic.show-watermark",
  createProviderClass(showWaterMark)
);
