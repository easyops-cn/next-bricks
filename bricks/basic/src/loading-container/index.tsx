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
 * 构件 `eo-loading-container`
 */
export
@defineElement("eo-loading-container", {
  styleTexts: [styleText],
})
class LoadingContainer
  extends ReactNextElement
  implements LoadingContainerProps
{
  @property({ type: Boolean })
  accessor loading: boolean | undefined;

  /**
   * 延迟显示加载效果的时间（防止闪烁）
   */
  @property({ type: Number })
  accessor delay: number | undefined;

  /**
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

export interface LoadingContainerComponentProps extends LoadingContainerProps {
  // Define react event handlers here.
}

export function LoadingContainerComponent({
  loading,
  delay,
}: LoadingContainerComponentProps) {
  const [delayedLoading, setDelayedLoading] = useState<boolean>(false);

  useEffect(() => {
    let timeout: number | undefined;
    if (!delay) {
      setDelayedLoading(!!loading);
      return;
    }
    if (loading) {
      timeout = setTimeout(() => {
        setDelayedLoading(true);
      }, delay ?? 500) as unknown as number;
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
