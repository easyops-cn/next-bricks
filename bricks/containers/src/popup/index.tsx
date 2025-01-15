import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import { JsonStorage } from "@next-core/utils/general";
import { Rnd, RndResizeCallback, RndDragCallback } from "react-rnd";
import { isEqual } from "lodash";
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
  accessor visible: boolean | undefined;

  /**
   * 用于设置 popup head的样式
   */
  @property({
    attribute: false,
  })
  accessor headerStyle: React.CSSProperties | undefined;

  /**
   * 用于设置 popup wrapper的样式
   */
  @property({
    attribute: false,
  })
  accessor wrapperStyle: React.CSSProperties | undefined;

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
  accessor resizable: boolean | undefined;

  /**
   * 显示弹窗
   */
  @method()
  open(): void {
    this.visible = true;
  }

  /**
   * 关闭弹窗
   */
  @method()
  close(): void {
    this.#closePopup();
  }

  #closePopup = (): void => {
    this.visible = false;
  };

  render() {
    return (
      <EoPopupComponent
        popupId={this.popupId}
        popupWidth={this.popupWidth}
        popupHeight={this.popupHeight}
        popupTitle={this.popupTitle}
        visible={this.visible}
        closePopup={this.#closePopup}
        openDirection={this.openDirection}
        headerStyle={this.headerStyle}
        wrapperStyle={this.wrapperStyle}
        noPadding={this.noPadding}
        resizable={this.resizable}
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
  headerStyle?: Record<string, any>;
  wrapperStyle?: Record<string, any>;
  openDirection?: OpenDirection;
  resizable?: boolean;
  noPadding?: boolean;
  closePopup?: () => void;
}

export interface StorageCache {
  position?: [number, number];
  size?: [number, number];
}

export function EoPopupComponent({
  popupId,
  popupTitle,
  popupWidth,
  popupHeight,
  visible,
  headerStyle,
  wrapperStyle,
  openDirection,
  resizable,
  closePopup,
}: EoPopupProps) {
  const popupRef = useRef<HTMLDivElement>();
  const headerRef = useRef<HTMLDivElement>();
  const contentRef = useRef<HTMLDivElement>();
  const [size, setSize] = useState<[number | string, number | string]>([
    popupWidth ?? 500,
    popupHeight,
  ]);
  const [position, setPosition] = useState<[number, number]>();
  const preSizeRef = useRef<[number | string, number | string]>(size);
  const prePositionRef = useRef<[number, number]>();

  const storage = useMemo(
    () =>
      popupId
        ? new JsonStorage<Record<string, StorageCache>>(
            localStorage,
            "general-popup-"
          )
        : null,
    [popupId]
  );

  const handleResizeStop: RndResizeCallback = (
    _e,
    _direction,
    ref,
    _delta,
    pos
  ) => {
    const { width, height } = ref.getBoundingClientRect();
    const size: [number, number] = [width, height];
    const position: [number, number] = [pos.x, pos.y];
    setSize(size);
    setPosition(position);
    if (popupId) {
      storage.setItem(popupId, {
        size,
        position,
      });
    }
  };

  const handleDragStop: RndDragCallback = (_e, d) => {
    const position: [number, number] = [d.x, d.y];
    setPosition(position);
    if (popupId) {
      const cache = storage.getItem(popupId) ?? {};
      storage.setItem(popupId, {
        ...cache,
        position,
      });
    }
  };

  const computedRightPosition = useCallback(() => {
    const popup = popupRef.current;
    if (!popup) return;
    const { innerWidth, innerHeight } = window;
    const { width, height, x, y } = popup.getBoundingClientRect();
    const widthGap = 15;
    const heightGap = 30;
    const rightWidth = width > innerWidth ? innerWidth : width;
    const rightHeight = height > innerHeight ? innerHeight : height;
    const isOverflowX = x + width - widthGap > innerWidth || x < 0;
    const isOverflowY = y + height - heightGap > innerHeight || y < 0;
    if (isOverflowX || isOverflowY) {
      setPosition((prePos) => {
        const newPos: [number, number] = [
          isOverflowX ? Math.max(0, innerWidth - width) - widthGap : prePos[0],
          isOverflowY
            ? Math.max(0, innerHeight - height) - heightGap
            : prePos[1],
        ];
        prePositionRef.current = newPos;
        return newPos;
      });
    }
    if (rightWidth !== width || rightHeight !== height) {
      const newSize: [number, number] = [rightWidth, rightHeight];
      preSizeRef.current = newSize;
      setSize(newSize);
    }
  }, []);

  const initPos = useCallback(() => {
    let initPostion: [number, number];
    if (visible && popupRef.current) {
      const { innerWidth, innerHeight } = window;
      const { offsetWidth: width, offsetHeight: height } = popupRef.current;
      const { offsetHeight: headerHeight } = headerRef.current;
      const widthGap = 30;
      const heightGap = 60;

      const map: { [key in OpenDirection]: Array<number> } = {
        [OpenDirection.LeftTop]: [widthGap, headerHeight],
        [OpenDirection.LeftBottom]: [
          widthGap,
          innerHeight - height - heightGap,
        ],

        [OpenDirection.RightTop]: [innerWidth - width - widthGap, headerHeight],
        [OpenDirection.RightBottom]: [
          innerWidth - width - widthGap,
          innerHeight - height - heightGap,
        ],

        [OpenDirection.Center]: [
          (innerWidth - width) / 2,
          (innerHeight - height) / 2 - headerHeight,
        ],
      };

      initPostion = map[openDirection || OpenDirection.Center] as [
        number,
        number,
      ];
      const cache = popupId && storage.getItem(popupId);
      const newPos = popupId && cache?.position ? cache.position : initPostion;
      return newPos;
    }
    return initPostion;
  }, [visible, openDirection, popupId, storage]);

  useLayoutEffect(() => {
    if (popupId) {
      const cache = storage.getItem(popupId);
      if (cache?.size) {
        setSize(cache.size);
        return;
      }
    }
  }, []);

  useLayoutEffect(() => {
    const popupElement = popupRef.current;
    if (popupElement) {
      setPosition(initPos());
    }
  }, [visible, initPos]);

  useEffect(() => {
    const prePos = prePositionRef.current;
    const preSize = preSizeRef.current;
    if (!isEqual(prePos, position) || !isEqual(preSize, size)) {
      computedRightPosition();
    }
  }, [position, size]);

  useEffect(() => {
    window.addEventListener("resize", computedRightPosition);
    return () => {
      window.removeEventListener("resize", computedRightPosition);
    };
  }, []);

  return (
    visible && (
      <div className="general-popup-popup">
        <Rnd
          className="general-popup"
          dragHandleClassName="general-popup-header"
          enableResizing={resizable}
          size={{
            width: size[0],
            height: size[1],
          }}
          position={
            position && {
              x: position[0],
              y: position[1],
            }
          }
          bounds="window"
          onDragStop={handleDragStop}
          onResizeStop={handleResizeStop}
        >
          <div
            ref={popupRef}
            className="general-popup-container"
            style={wrapperStyle}
          >
            <div
              className="general-popup-header"
              ref={headerRef}
              style={headerStyle}
            >
              <span className="title">{popupTitle}</span>
              <div className="general-popup-header-toolbar">
                <slot name="toolbar"></slot>
                <span className="general-popup-close-btn">
                  <WrappedIcon
                    icon="close"
                    lib="antd"
                    theme="outlined"
                    onClick={closePopup}
                  />
                </span>
              </div>
            </div>
            <div ref={contentRef} className="content">
              <slot />
            </div>
          </div>
        </Rnd>
      </div>
    )
  );
}
