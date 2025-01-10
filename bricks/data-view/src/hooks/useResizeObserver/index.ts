import {
  useState,
  useCallback,
  useRef,
  type RefObject,
  useEffect,
} from "react";
import { observe, unobserve } from "./resizeObserverUtil.js";

interface ElementSize {
  clientWidth: number;
  clientHeight: number;
}

export interface ResizeObserveProps<T extends Element = Element> {
  targetRef?: RefObject<T>;
  onResize?: (size: ResizeObserverEntry) => void;
}

export function useResizeObserver<T extends Element = Element>(
  props?: ResizeObserveProps<T>
): [RefObject<T>, ElementSize] {
  const {
    targetRef,
    onResize,
  } = props || {};

  const localRef = useRef<T>(undefined);
  const ref = targetRef ?? localRef;
  const [size, setSize] = useState<ElementSize>({ clientWidth: 0, clientHeight: 0 });

  const handleResize = useCallback(
    (entry: ResizeObserverEntry) => {
      const { target } = entry;
      const { clientWidth = 0, clientHeight = 0 } = target;

      setSize((prev) => {
        // skip if same size
        if (prev.clientWidth === clientWidth && prev.clientHeight === clientHeight) {
          return prev;
        }

        onResize?.(entry);

        return { clientWidth, clientHeight };
      });
    },
    [onResize]
  );

  useEffect(() => {
    if (
      typeof ref !== "object" ||
      ref === null ||
      !(ref.current instanceof Element)
    ) {
      throw new Error("ResizeObserver must observe an Element");
    }

    const element = ref.current;
    observe(element, handleResize);

    return () => {
      unobserve(element, handleResize);
    };
  }, [handleResize, ref]);

  return [ref, { ...size }];
}
