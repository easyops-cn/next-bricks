import React, { useEffect, useState } from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import styleText from "./styles.shadow.css";

const { defineElement, property } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface LoadingContainerProps {
  loading?: boolean;
  delay?: number;
  size?: LoadingSize;
}

export type LoadingSize = "small" | "medium" | "large";

/**
 * 加载状态容器，在 loading 时显示遮罩和旋转图标，支持延迟显示以防止闪烁
 * @en A loading container that shows a mask and a spinning icon while loading, with delayed display to avoid flicker
 * @author developer
 * @category display-component
 *
 * @slot - 内容
 * @slotEn - The content
 */
export
@defineElement("eo-loading-container", {
  styleTexts: [styleText],
})
class LoadingContainer
  extends ReactNextElement
  implements LoadingContainerProps
{
  /**
   * 是否显示加载状态
   * @en Whether to show the loading state
   */
  @property({ type: Boolean })
  accessor loading: boolean | undefined;

  /**
   * 延迟显示加载效果的时间（防止闪烁）
   * @en Time to delay before showing the loading effect (to avoid flicker)
   */
  @property({ type: Number })
  accessor delay: number | undefined;

  /**
   * 加载图标的尺寸
   * @en Size of the loading icon
   * @default "medium"
   */
  @property({ render: false })
  accessor size: LoadingSize | undefined;

  render() {
    return (
      <LoadingContainerComponent loading={this.loading} delay={this.delay} />
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface LoadingContainerComponentProps extends LoadingContainerProps {}

export function LoadingContainerComponent({
  loading,
  delay,
}: LoadingContainerComponentProps) {
  const [delayedLoading, setDelayedLoading] = useState<boolean>(
    delay ? false : !!loading
  );

  useEffect(() => {
    let timeout: number | undefined;
    if (!delay) {
      setDelayedLoading(!!loading);
      return;
    }
    if (loading) {
      timeout = setTimeout(() => {
        setDelayedLoading(true);
      }, delay) as unknown as number;
    } else {
      setDelayedLoading(false);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [loading, delay]);

  return (
    <>
      {delayedLoading && (
        <div className="mask">
          <WrappedIcon className="icon" lib="antd" icon="loading" spinning />
        </div>
      )}
      <slot className={delayedLoading ? "loading" : ""} />
    </>
  );
}
