import React, { useCallback, useEffect, useMemo, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import "@next-core/theme";
import classNames from "classnames";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import { debounceByAnimationFrame } from "@next-shared/general/debounceByAnimationFrame";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

export interface ResizableBoxProps {
  resizeDirection?: ResizeDirection;
  storageKey?: string;
  defaultSize?: number;
  minSize?: number;
  minSpace?: number;
  disabled?: boolean;
  variant?: "dashboard" | "default";
  boxStyle?: React.CSSProperties;
  boxStyleWhenNotResizing?: React.CSSProperties;
}

export type ResizeDirection = "left" | "right" | "top" | "bottom";

/**
 * 可以左右或上下调整尺寸的容器
 */
export
@defineElement("eo-resizable-box", {
  styleTexts: [styleText],
})
class ResizableBox extends ReactNextElement implements ResizableBoxProps {
  /**
   * 调整方向
   * @default "right"
   */
  @property()
  accessor resizeDirection: ResizeDirection | undefined;

  /**
   * 用于存放当前尺寸的 (local) storage key
   */
  @property()
  accessor storageKey: string | undefined;

  /**
   * 默认尺寸（px）
   * @default 200
   */
  @property({ type: Number })
  accessor defaultSize: number | undefined;

  /**
   * 最小尺寸（px）
   * @default defaultSize
   */
  @property({ type: Number })
  accessor minSize: number | undefined;

  /**
   * 留给其他部分的最小空间（即控制尺寸不超过 `documentElement.clientWidth - minSpace`）
   * @default 300
   */
  @property({ type: Number })
  accessor minSpace: number | undefined;

  /**
   * 禁用 resize
   */
  @property({ type: Boolean })
  accessor disabled: boolean | undefined;

  /**
   * @default "default"
   */
  @property()
  accessor variant: "dashboard" | "default" | undefined;

  @property({ attribute: false })
  accessor boxStyle: React.CSSProperties | undefined;

  @property({ attribute: false })
  accessor boxStyleWhenNotResizing: React.CSSProperties | undefined;

  render() {
    return (
      <ResizableBoxComponent
        resizeDirection={this.resizeDirection}
        storageKey={this.storageKey}
        defaultSize={this.defaultSize}
        minSize={this.minSize}
        minSpace={this.minSpace}
        disabled={this.disabled}
        variant={this.variant}
        boxStyle={this.boxStyle}
        boxStyleWhenNotResizing={this.boxStyleWhenNotResizing}
      />
    );
  }
}

interface ResizerStatus {
  startSize: number;
  startX: number;
  startY: number;
}

export function ResizableBoxComponent({
  resizeDirection: _resizeDirection,
  storageKey,
  defaultSize: _defaultSize,
  minSize,
  minSpace: _minSpace,
  disabled,
  variant,
  boxStyle,
  boxStyleWhenNotResizing,
}: ResizableBoxProps) {
  const resizeDirection = _resizeDirection ?? "right";
  const defaultSize = _defaultSize ?? 200;
  const minSpace = _minSpace ?? 300;
  const refinedMinSize = minSize ?? defaultSize;

  const storage = useMemo(
    () => (storageKey ? new JsonStorage(localStorage) : null),
    [storageKey]
  );

  const initSize = useCallback(() => {
    return (
      (storageKey
        ? storage?.getItem<number | undefined>(storageKey)
        : undefined) ?? defaultSize
    );
  }, [defaultSize, storageKey, storage]);

  const [size, setSize] = useState<number>(initSize);
  const [resized, setResized] = useState(false);
  const [resizeStatus, setResizerStatus] = useState<ResizerStatus | null>(null);

  const isVerticalDirection = useMemo(
    () => ["top", "bottom"].includes(resizeDirection),
    [resizeDirection]
  );

  const handleResizerMouseDown = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return;
      // Prevent text selecting.
      event.preventDefault();
      setResizerStatus({
        startSize: size,
        startX: event.clientX,
        startY: event.clientY,
      });
      setResized(false);
    },
    [size, disabled]
  );

  useEffect(() => {
    setSize(initSize());
  }, [initSize]);

  useEffect(() => {
    if (!resizeStatus) {
      return;
    }

    const debouncedSetSize = debounceByAnimationFrame(setSize);

    const handleResizerMouseMove = (event: MouseEvent): void => {
      const modifiedSize = isVerticalDirection
        ? Math.min(
            document.documentElement.clientHeight - minSpace,
            resizeStatus.startSize +
              (event.clientY - resizeStatus.startY) *
                (resizeDirection === "top" ? -1 : 1)
          )
        : Math.min(
            document.documentElement.clientWidth - minSpace,
            resizeStatus.startSize +
              (event.clientX - resizeStatus.startX) *
                (resizeDirection === "left" ? -1 : 1)
          );
      setResized(true);
      debouncedSetSize(Math.max(refinedMinSize, modifiedSize));
    };

    const handleResizerMouseUp = (): void => {
      setResizerStatus(null);
    };

    window.addEventListener("mousemove", handleResizerMouseMove);
    window.addEventListener("mouseup", handleResizerMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleResizerMouseMove);
      window.removeEventListener("mouseup", handleResizerMouseUp);
    };
  }, [
    resizeDirection,
    refinedMinSize,
    minSpace,
    resizeStatus,
    isVerticalDirection,
  ]);

  useEffect(() => {
    if (!resizeStatus && resized && storageKey) {
      storage?.setItem(storageKey, size);
    }
  }, [resized, resizeStatus, storage, size, storageKey]);

  return (
    <>
      <div
        className={classNames("box", {
          resizing: !!resizeStatus,
        })}
        style={{
          [isVerticalDirection ? "height" : "width"]: size,
          ...boxStyle,
          ...(resizeStatus ? null : boxStyleWhenNotResizing),
        }}
      >
        <slot />
      </div>
      <div
        className={classNames(
          "bar",
          variant === "dashboard" ? variant : "default",
          resizeDirection
        )}
        onMouseDown={handleResizerMouseDown}
      >
        {/* Use a fullscreen mask to keep cursor status when dragging the resizer. */}
        <div className="mask" />
      </div>
    </>
  );
}
