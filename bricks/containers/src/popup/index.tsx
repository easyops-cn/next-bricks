import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { JsonStorage } from "@next-core/utils/general";
import moment from "moment";
import { debounceByAnimationFrame } from "@next-shared/general/debounceByAnimationFrame";
import { getCssPropertyValue } from "@next-core/runtime";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";

const { defineElement, property, method } = createDecorators();

const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export enum OpenDirection {
  LeftTop = "leftTop",
  LeftBottom = "leftBottom",
  RightTop = "rightTop",
  RightBottom = "rightBottom",
  Center = "center",
}

let headerHeight = parseInt(getCssPropertyValue("--app-bar-height")) || 56;

/**
 * 构件 `eo-popup`
 */
export
@defineElement("eo-popup", {
  styleTexts: [styleText],
})
class EoPopup extends ReactNextElement {
  /**
   * 浮层Id, 如果有设置浮层id, 会开启位置记录功能
   */
  @property()
  accessor popupId: string | undefined;

  /**
   * 弹窗宽度
   * @default 500
   */
  @property()
  accessor popupWidth: React.CSSProperties["width"] | undefined;

  /**
   * 弹窗高度
   */
  @property()
  accessor popupHeight: React.CSSProperties["height"] | undefined;

  /**
   * 弹窗标题
   */
  @property()
  accessor popupTitle: string | undefined;

  /**
   * 弹窗打开位置
   * @default center
   */
  @property()
  accessor openDirection: OpenDirection | undefined;

  /**
   * 是否显示模态框
   */
  @property({
    type: Boolean,
  })
  accessor isVisible: boolean | undefined;

  /**
   * 用于设置 popup head的样式
   */
  @property({
    attribute: false,
  })
  accessor dragHeaderStyle: React.CSSProperties | undefined;

  /**
   * 用于设置 popup wrapper的样式
   */
  @property({
    attribute: false,
  })
  accessor dragWrapperStyle: React.CSSProperties | undefined;

  /**
   * 内容没有边距
   */
  @property({
    type: Boolean,
    render: false,
  })
  accessor noPadding: boolean | undefined;

  /**
   * 是否可调整尺寸
   */
  @property({
    type: Boolean,
  })
  accessor resize: boolean | undefined;

  /**
   * 显示弹窗
   */
  @method()
  open(): void {
    this.isVisible = true;
  }

  /**
   * 关闭弹窗
   */
  @method()
  close(): void {
    this.closePopup();
  }

  closePopup = (): void => {
    this.isVisible = false;
  };

  render() {
    return (
      <EoPopupComponent
        popupId={this.popupId}
        popupWidth={this.popupWidth}
        popupHeight={this.popupHeight}
        popupTitle={this.popupTitle}
        visible={this.isVisible}
        closePopup={this.closePopup}
        openDirection={this.openDirection}
        dragHeaderStyle={this.dragHeaderStyle}
        dragWrapperStyle={this.dragWrapperStyle}
        noPadding={this.noPadding}
        resize={this.resize}
      />
    );
  }
}

export interface EoPopupProps {
  popupId?: string;
  visible: boolean;
  popupTitle?: string;
  popupWidth?: React.CSSProperties["width"];
  popupHeight?: React.CSSProperties["height"];
  closePopup?: () => void;
  dragHeaderStyle?: Record<string, any>;
  dragWrapperStyle?: Record<string, any>;
  openDirection?: OpenDirection;
  resize?: boolean;
  noPadding?: boolean;
}

export function EoPopupComponent({
  popupId,
  popupTitle,
  popupWidth,
  popupHeight,
  visible,
  dragHeaderStyle,
  dragWrapperStyle,
  openDirection,
  closePopup,
  resize,
}: EoPopupProps) {
  const popupRef = useRef<HTMLDivElement>();
  const headerRef = useRef<HTMLDivElement>();
  const [isMove, setIsMove] = useState(false);
  const curPointRef = useRef({
    offsetX: 0,
    offsetY: 0,
  });
  const [position, setPosition] = useState<Array<number>>([]);
  const jsonStorage = React.useMemo(() => new JsonStorage(localStorage), []);

  const storage = useMemo(
    () =>
      popupId
        ? new JsonStorage<Record<string, Array<number>>>(
            localStorage,
            "general-popup-postion-"
          )
        : null,
    [popupId]
  );

  const handleShowTips = ((e: CustomEvent<any>): void => {
    const list = (e.detail ?? []).filter((item: any) => {
      const isTipClosing =
        item.closable &&
        jsonStorage.getItem(item.tipKey) &&
        moment().unix() <= (jsonStorage.getItem(item.tipKey) as number);
      return !isTipClosing;
    });
    headerHeight += list.length * 32;
  }) as EventListener;

  useEffect(() => {
    window.addEventListener("app.bar.tips", handleShowTips);
    return () => {
      window.removeEventListener("app.bar.tips", handleShowTips);
    };
  }, []);

  const debouncedSetPoint = useMemo(
    () => debounceByAnimationFrame(setPosition),
    []
  );

  const handleMouseDown = (e: MouseEvent): void => {
    const paths = e.composedPath() as HTMLElement[];
    for (const path of paths) {
      if (path.nodeName) {
        if (
          path.nodeName.toLowerCase() === "span" &&
          path.className.includes("general-popup-close-btn")
        ) {
          closePopup?.();
          return;
        }
        if (
          path.nodeName.toLowerCase() === "div" &&
          path.className.includes("general-popup-header-toolbar")
        ) {
          return;
        }
        if (
          path.nodeName.toLowerCase() === "div" &&
          path.className.includes("general-popup-header")
        ) {
          setIsMove(true);
          curPointRef.current = {
            offsetX: e.offsetX,
            offsetY: e.offsetY,
          };
        }
      }
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (isMove) {
        const { width, height } = popupRef.current.getBoundingClientRect();
        const { innerWidth, innerHeight } = window;
        const maxX = innerWidth - width;
        const maxY = innerHeight - height;
        const pointX = e.clientX - curPointRef.current.offsetX;
        const pointY = e.clientY - curPointRef.current.offsetY;
        debouncedSetPoint([
          pointX <= 0 ? 0 : pointX >= maxX ? maxX : pointX,
          pointY <= 0 ? 0 : pointY >= maxY ? maxY : pointY,
        ]);
      }
    },
    [debouncedSetPoint, isMove]
  );

  const handleMouseUp = useCallback((): void => {
    setIsMove(false);
    popupId && storage.setItem(popupId, [position[0], position[1]]);
  }, [popupId, position, storage]);

  const initPos = useCallback(() => {
    let initPostion: Array<number> = [];
    if (visible && popupRef.current) {
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = popupRef.current;

      const map: { [key in OpenDirection]: Array<number> } = {
        [OpenDirection.LeftTop]: [0, headerHeight],
        [OpenDirection.LeftBottom]: [0, innerHeight - offsetHeight],
        [OpenDirection.RightTop]: [innerWidth - offsetWidth, headerHeight],

        [OpenDirection.RightBottom]: [
          innerWidth - offsetWidth,
          innerHeight - offsetHeight,
        ],

        [OpenDirection.Center]: [
          Math.floor((innerWidth - offsetWidth) / 2),
          Math.floor((innerHeight - offsetHeight) / 2),
        ],
      };

      initPostion = map[openDirection || OpenDirection.Center];
      return popupId ? storage.getItem(popupId) ?? initPostion : initPostion;
    }
    return initPostion;
  }, [visible, openDirection, popupId, storage]);

  useEffect(() => {
    const popupElement = popupRef.current;
    if (popupElement) {
      setPosition(initPos());
      /**
       * Antd Select构件在shadow dom会出现异常的情况
       * 具体可参见: https://github.com/ant-design/ant-design/issues/28012
       * 采用原生事件监听可避免该种情况发生
       */
      popupElement.addEventListener("mousedown", handleMouseDown);
    }
    return () => {
      popupElement?.removeEventListener("mousedown", handleMouseDown);
    };
  }, [visible, initPos]);

  useEffect(() => {
    if (!isMove) {
      return;
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isMove, handleMouseUp, handleMouseMove]);

  return (
    visible && (
      <div
        className="general-popup"
        ref={popupRef}
        style={{
          transform: `translate(${position[0]}px, ${position[1]}px)`,
          ...dragWrapperStyle,
        }}
      >
        <div
          className="general-popup-header"
          ref={headerRef}
          style={dragHeaderStyle}
        >
          <span className="title">{popupTitle}</span>
          <div className="general-popup-header-toolbar">
            <slot name="toolbar"></slot>
            <span className="general-popup-close-btn">
              <WrappedIcon icon="close" lib="antd" theme="outlined" />
            </span>
          </div>
        </div>
        <div
          className="content"
          style={{
            width: popupWidth ?? "500px",
            ...(resize
              ? {
                  resize: "both",
                  height: popupHeight,
                }
              : { maxHeight: popupHeight }),
          }}
        >
          <slot />
        </div>
      </div>
    )
  );
}
