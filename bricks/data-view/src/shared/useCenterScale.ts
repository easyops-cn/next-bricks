import { useEffect, useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";

/**
 * 让中心数据值不要超过球体范围，但缩放值最低不小于 0.3
 */
export function useCenterScale(maxWidth: number) {
  const [centerScale, setCenterScale] = useState<number | null>(null);
  const centerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const centerValueElement = centerRef.current;
    if (!centerValueElement) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const width = centerValueElement.clientWidth;
      setCenterScale(Math.min(1, Math.max(0.3, maxWidth / width)));
    });
    observer.observe(centerValueElement);
    return () => observer.disconnect();
  }, [maxWidth]);

  return [centerScale, centerRef] as const;
}
