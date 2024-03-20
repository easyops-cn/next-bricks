import React, { useEffect, useMemo } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { unwrapProvider } from "@next-core/utils/general";
import classNames from "classnames";
import { useCurrentTheme } from "@next-core/react-runtime";
import StepImage from "./step.png";
import StepDarkImage from "./step-dark.png";

const { defineElement, property, event, method } = createDecorators();

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

interface StepItem {
  title: string;
  key: string;
}

/**
 * 加载步骤框
 */
export
@defineElement("eo-loading-step", {
  styleTexts: [styleText],
})
class EoLoadingStep extends ReactNextElement {
  /**
   * 是否可见
   */
  @property({
    type: Boolean,
  })
  accessor visible: boolean | undefined;

  /**
   * 宽度
   */
  @property()
  accessor width: string | undefined;

  /**
   * 步骤标题
   */
  @property()
  accessor stepTitle: string | undefined;

  /**
   * 步骤列表
   */
  @property({
    attribute: false,
  })
  accessor stepList: StepItem[] | undefined;

  /**
   * 当前步骤
   */
  @property()
  accessor curStep: string | undefined;

  /**
   * 打开事件
   */
  @event({ type: "open" })
  accessor #openEvent!: EventEmitter<void>;
  #handleOpen() {
    this.#openEvent.emit();
  }

  /**
   * 关闭事件
   */
  @event({ type: "close" })
  accessor #closeEvent!: EventEmitter<void>;
  #handleClose() {
    this.#closeEvent.emit();
  }

  /**
   * 打开
   */
  @method()
  open() {
    this.visible = true;
    this.#handleOpen();
  }

  /**
   * 关闭
   */
  @method({ bound: true })
  close() {
    this.visible = false;
    this.#handleClose();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
  }

  render() {
    return (
      <EoLoadingStepComponent
        curElement={this}
        visible={this.visible}
        width={this.width}
        stepTitle={this.stepTitle}
        stepList={this.stepList}
        curStep={this.curStep}
      />
    );
  }
}

const statusMap = {
  pending: {
    icon: <span className={classNames("step-item-icon", "pending-icon")} />,
  },
  loading: {
    icon: (
      <WrappedIcon
        lib="antd"
        theme="outlined"
        icon="loading"
        className="step-item-icon"
      />
    ),
  },
  finished: {
    icon: (
      <WrappedIcon
        lib="antd"
        theme="filled"
        icon="check-circle"
        className="step-item-icon"
      />
    ),
  },
};

export interface EoLoadingStepProps {
  curElement?: HTMLElement;
  visible?: boolean;
  width?: string;
  stepTitle?: string;
  stepList?: StepItem[];
  curStep: string;
}

export function EoLoadingStepComponent(props: EoLoadingStepProps) {
  const { curElement, visible, width, stepTitle, stepList, curStep } = props;

  const currentTheme = useCurrentTheme();

  useEffect(() => {
    lockBodyScroll(curElement, visible);
  }, [visible]);

  const curIndex = useMemo(() => {
    return stepList?.findIndex((v) => v.key === curStep) ?? -1;
  }, [curStep, stepList]);

  return (
    <div className={classNames("root", visible ? "open" : "close")}>
      <div className="mask" />
      <div className="wrap">
        <div className="container" style={{ width: width }}>
          <img
            src={currentTheme === "dark-v2" ? StepDarkImage : StepImage}
            className="step-image"
          />
          <div className="step-title">{stepTitle}</div>
          <div className="step-list">
            {stepList?.map(({ title, key }, index) => {
              const status =
                curIndex > index
                  ? "finished"
                  : curIndex < index
                    ? "pending"
                    : "loading";

              return (
                <div key={key} className={classNames("step-item", status)}>
                  {statusMap[status].icon}
                  <span className="step-item-title"> {title} </span>
                  {index !== stepList.length - 1 && (
                    <div className="step-item-bar" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
