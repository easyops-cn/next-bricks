import React, { useEffect, useRef, useState } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement } from "@next-core/react-element";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./loading-panel.shadow.css";
const { defineElement, property, event } = createDecorators();
import { usePrevious } from "../hooks/index.js";
interface LoadingPanelProps {
  loading?: boolean;
  customTitle?: string;
  progress?: number;
  useRealTimeProgress?: boolean;
  intervalTime?: number;
  onEnd?: () => void;
}

/**
 * 大屏加载模块展示
 * @author astrid
 * @category big-screen-content
 */
@defineElement("data-view.loading-panel", {
  styleTexts: [variablesStyleText, styleText],
})
class LoadingPanel extends ReactNextElement implements LoadingPanelProps {
  /**
   * @kind string
   * @default -
   * @required false
   * @description 标题
   */
  @property()
  accessor customTitle: string;

  /**
   * @kind boolean
   * @default true
   * @required false
   * @description 是否加载中， 虚拟数据模拟加载过程
   */
  @property({ type: Boolean })
  accessor loading: boolean;

  /**
   * @kind boolean
   * @default false
   * @required false
   * @description 加载过程是否使用真实数据
   */
  @property({ type: Boolean })
  accessor useRealTimeProgress: boolean = false;
  /**
   * @kind number
   * @default -
   * @required false
   * @description 加载进度，区间[0-100]; 真实数据
   */
  @property({ type: Number })
  accessor progress: number;

  /**
   * @kind number
   * @default -
   * @required 100
   * @description 每次加载变化的时间间隔，单位ms
   */
  @property({ type: Number })
  accessor intervalTime: number;

  /**
   * @detail
   * @description loading结束事件
   */
  @event({ type: "end" })
  accessor #onEndEvent!: EventEmitter<void>;

  onEnd = () => {
    this.#onEndEvent.emit();
  };

  render(): React.ReactNode {
    return (
      <LoadingPanelComponent
        loading={this.loading}
        customTitle={this.customTitle}
        progress={this.progress}
        useRealTimeProgress={this.useRealTimeProgress}
        intervalTime={this.intervalTime}
        onEnd={this.onEnd}
      />
    );
  }
}
export function LoadingPanelComponent(
  props: LoadingPanelProps
): React.ReactElement {
  const {
    customTitle,
    loading,
    progress,
    useRealTimeProgress,
    intervalTime = 100,
    onEnd,
  } = props;
  const [progressValue, setProgressValue] = useState<number>(0);
  const timerRef = useRef<number>(null);
  const intervalTimer = (params: {
    curVal: number;
    step: number;
    time?: number;
  }) => {
    const { curVal, step, time } = params;
    let init = curVal,
      end: number;
    if (useRealTimeProgress) {
      end = progress;
    } else {
      end = loading ? 80 : 100;
    }
    timerRef.current = window.setInterval(() => {
      if (init >= end) {
        window.clearInterval(timerRef.current);
        init = end;
      }
      setProgressValue(init);
      // 由于step未知，所以会出现 init + step > end； 这时候，我们就要取 end
      init = init + step;
    }, time);
  };
  const prevProgress = usePrevious(progress);
  const getStep = (curVal: number, start: number, end: number): number => {
    return curVal >= start ? 1 : Math.ceil((end - curVal) / 10);
  };
  useEffect(() => {
    let step = 1;
    if (!useRealTimeProgress && !loading) {
      // 假数据的时候，如果 loading结束，但是 progressValue 已经到了80，那么step为1，如果小于80，可以分段考虑,保证后面的记载次数为10次完成；
      step = getStep(progressValue, 80, 100);
    }
    if (useRealTimeProgress) {
      step = getStep(progressValue, prevProgress, progress);
    }
    intervalTimer({
      step: step,
      curVal: progressValue ?? 0,
      time: intervalTime,
    });
    return () => {
      window.clearInterval(timerRef.current);
    };
  }, [loading, progress, useRealTimeProgress, intervalTime]);
  useEffect(() => {
    if (progressValue === 100) {
      onEnd?.();
    }
  }, [progressValue]);

  return (
    <div className="wrapper">
      <div className="titleWrapper">
        <div className="title">{customTitle ?? "EASYOPS"}</div>
        <div className="description">Loading...</div>
      </div>
      <div className="progress">{`${progressValue}%`}</div>
    </div>
  );
}

export { LoadingPanel };
