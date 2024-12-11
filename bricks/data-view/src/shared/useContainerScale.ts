import { useEffect, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

/**
 * 根据容器尺寸进行缩放
 */
export function useContainerScale({
  width: baseWidth,
  height: baseHeight,
  root,
  maxScale,
}: {
  width: number;
  height: number;
  root: HTMLElement;
  /** 最大缩放比例，默认为 1 */
  maxScale?: number;
}): number | null {
  const [scale, setScale] = useState<number | null>(null);

  useEffect(() => {
    // 当容器宽高低于预设值时，图形会自动缩小
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === root) {
          const { width, height } = entry.contentRect;
          setScale(
            Math.min(maxScale ?? 1, width / baseWidth, height / baseHeight)
          );
        }
      }
    });
    observer.observe(root);
    return () => observer.disconnect();
  }, [baseHeight, baseWidth, maxScale, root]);

  return scale;
}
