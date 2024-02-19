import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import variablesStyleText from "../data-view-variables.shadow.css";
import styleText from "./tabs-drawer.shadow.css";
import classNames from "classnames";
const { defineElement, property, event, method } = createDecorators();
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
export interface TabItem {
  /** 菜单标题对应的图标。 */
  icon: GeneralIconProps;
  /** 唯一标识 */
  key: string;
  /** 菜单标题。 */
  title?: string;
  tooltip?: string;
}
interface TabsDrawerProps {
  tabList: TabItem[];
  activeKey?: string;
  width?: number | string;
  drawerStyle?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
  zIndex?: number;
  visible?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onTabChange?: (key: string) => void;
}
/**
 * 大屏仪标签页抽屉
 * @author astrid
 * @category big-screen-layout
 */

@defineElement("data-view.tabs-drawer", {
  styleTexts: [variablesStyleText, styleText],
})
class TabsDrawer extends ReactNextElement implements TabsDrawerProps {
  /**
   * @default -
   * @required false
   * @description 抽屉左侧菜单列表
   */
  @property({ attribute: false })
  accessor tabList: TabItem[];

  /**
   * @default -
   * @required false
   * @description 抽屉左侧菜单高亮显示
   */
  @property()
  accessor activeKey: string;

  /**
   * @kind number|string
   * @required false
   * @default default
   * @description 抽屉宽度内容区的宽度，优先级高于bodyStyle内的width
   * @group basic
   */
  @property({
    attribute: false,
  })
  accessor width: number | string;

  /**
   * @kind  React.CSSProperties
   * @required false
   * @default default
   * @description 设计 Drawer 容器样式
   * @group basic
   */
  @property({
    attribute: false,
  })
  accessor drawerStyle: React.CSSProperties;
  /**
   * @kind  React.CSSProperties
   * @required false
   * @default default
   * @description  可用于设置 Drawer 内容部分的样式
   * @group basic
   */
  @property({
    attribute: false,
  })
  accessor bodyStyle: React.CSSProperties;

  /**
   * @kind number
   * @required false
   * @default  1000
   * @description 抽屉层级
   * @group basic
   */
  @property({
    type: Number,
  })
  accessor zIndex: number | undefined;

  /**
   * @kind boolean
   * @required false
   * @default default
   * @description 遮罩层是否显示
   * @group basic
   */
  @property({
    type: Boolean,
  })
  accessor visible: boolean | undefined;
  /**
   * @detail
   * @description 抽屉打开事件
   */
  @event({ type: "open" })
  accessor #drawerOpenEvent!: EventEmitter<void>;

  /**
   * @detail
   * @description 抽屉关闭事件
   */
  @event({ type: "close" })
  accessor #drawerCloseEvent!: EventEmitter<void>;

  /**
   * @detail `string`
   * @description 切换 `tab` 栏会触发的事件，`detail` 为目标 `tab` 对应的 `key`
   */
  @event({ type: "tab.change" })
  accessor #tabChangeEvent!: EventEmitter<string>;

  #handleTabChange = (key: string) => {
    this.activeKey = key;
    this.#tabChangeEvent.emit(key);
  };
  #handleDrawerOpen = () => {
    this.visible = true;
    this.#drawerOpenEvent.emit();
  };

  #handleDrawerClose = () => {
    this.visible = false;
    this.#drawerCloseEvent.emit();
  };

  /**
   * @description 打开抽屉
   */
  @method()
  open() {
    this.#handleDrawerOpen();
  }
  /**
   * @description 关闭抽屉
   */
  @method()
  close() {
    this.#handleDrawerClose();
  }
  render(): React.ReactNode {
    return (
      <TabsDrawerComponent
        tabList={this.tabList || []}
        activeKey={this.activeKey}
        width={this.width}
        bodyStyle={this.bodyStyle}
        drawerStyle={this.drawerStyle}
        zIndex={this.zIndex}
        visible={this.visible}
        onClose={this.#handleDrawerClose}
        onOpen={this.#handleDrawerOpen}
        onTabChange={this.#handleTabChange}
      />
    );
  }
}
export function TabsDrawerComponent(
  props: TabsDrawerProps
): React.ReactElement {
  const {
    tabList,
    width = 378,
    drawerStyle,
    bodyStyle,
    zIndex,
    onClose,
    onOpen,
    onTabChange,
    visible,
  } = props;
  const contentRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState(props.activeKey);
  const setActiveItem = (key: string): void => {
    const _contentSlot = contentRef.current;
    if (_contentSlot) {
      const _slotElement = _contentSlot.querySelectorAll("slot");
      _slotElement?.forEach((slot) => {
        slot.hidden = slot.name !== key;
      });
      setActiveKey(key);
    }
  };
  const handleClick = useCallback(
    (event: MouseEvent) => {
      const targetElement = event
        .composedPath()
        .some((ele) => ele === containerRef.current);
      if (!targetElement) {
        if (visible) {
          onClose();
        }
      }
    },
    [visible, onClose]
  );
  useEffect(() => {
    if (tabList.length) {
      setActiveItem(props.activeKey ?? tabList[0].key);
    }
  }, [props.activeKey, tabList]);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleClick]);

  const menuElement = useMemo(
    () => (
      <div className="menuWrapper">
        <div className="menuMask" />
        {tabList.map((item, index) => (
          <div
            className={classNames("menuIconItem", {
              menuIconItemHover: !!item.tooltip,
              active: item.key === activeKey,
            })}
            key={`menu-${index}`}
            onClick={() => onTabChange?.(item.key)}
          >
            {item.icon && <WrappedIcon {...item.icon} />}
            {item.tooltip && (
              <div className="menuIconTooltip">{item.tooltip}</div>
            )}
          </div>
        ))}
      </div>
    ),
    [activeKey, onTabChange, tabList]
  );
  return (
    <div
      className={classNames("drawerWrapper", {
        open: visible,
        close: !visible,
      })}
      style={{
        ...drawerStyle,
        ...(zIndex ? { zIndex } : {}),
      }}
      ref={containerRef}
    >
      <span
        className="closeIconBtn"
        onClick={() => (visible ? onClose?.() : onOpen?.())}
      >
        <span className="closeIcon" />
      </span>
      <div
        className={classNames("drawerBody")}
        style={{
          ...bodyStyle,
          width,
        }}
      >
        {menuElement}
        <div className="content" ref={contentRef}>
          {tabList.map((item, index) => (
            <slot name={item.key} key={`slot-${index}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { TabsDrawer };
