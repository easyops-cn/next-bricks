import React, {
  MouseEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import type { EoTooltip, ToolTipProps } from "../tooltip/index.jsx";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { SidebarMenu as SidebarMenuType } from "@next-shared/general/types";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import FixedSvg from "../images/fixed.svg";
import ToFixedSvg from "../images/toFixed.svg";
import { debounceByAnimationFrame } from "@next-shared/general/debounceByAnimationFrame";
import { JsonStorage } from "@next-shared/general/JsonStorage";
import {
  ExpandedState,
  SIDE_BAR_EXPAND_STATE,
  SIDE_BAR_HAS_BEEN_USED,
  SIDE_BAR_RESIZE_WIDTH,
  SidebarMenu,
  sideBarCollapsedWidth,
  sideBarWidth,
} from "./utils.js";
import { useTranslation, initializeReactI18n } from "@next-core/i18n/react";
import { K, NS, locales } from "./i18n.js";
import classNames from "classnames";
import { initMenuItemAndMatchCurrentPathKeys } from "@next-shared/general/menu";
import { UnregisterCallback } from "history";
import { getHistory, getRuntime } from "@next-core/runtime";
import { useCurrentApp } from "@next-core/react-runtime";

initializeReactI18n(NS, locales);

const { defineElement, property, event } = createDecorators();

const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");

export interface EoSidebarProps {
  menu: SidebarMenuType;
  expandedState?: ExpandedState;
  hiddenFixedIcon?: boolean;
  position?: "static" | "fixed";
}

export interface EoSidebarEvents {
  "actual.width.change": CustomEvent<number>;
  "expanded.state.change": CustomEvent<ExpandedState>;
}

export interface EoSidebarEventsMapping {
  onActualWidthChange: "actual.width.change";
  onExpandedStateChange: "expanded.state.change";
}

/**
 * 侧边栏
 *
 * @category navigation
 */
export
@defineElement("eo-sidebar", {
  styleTexts: [styleText],
})
class EoSidebar extends ReactNextElement implements EoSidebarProps {
  /**
   * 菜单数据
   */
  @property({ attribute: false })
  accessor menu!: SidebarMenuType;

  /**
   * 是否隐藏固定按钮
   */
  @property({ type: Boolean })
  accessor hiddenFixedIcon: boolean | undefined;

  /**
   * 侧栏状态
   */
  @property()
  accessor expandedState: ExpandedState | undefined;

  /**
   * 设置定位方式：静态定位或固定定位。
   *
   * @default "fixed"
   */
  @property()
  accessor position: "static" | "fixed" | undefined;

  /**
   * 宽度变化时触发
   * @detail 当前宽度
   */
  @event({ type: "actual.width.change" })
  accessor #actualWidthChangeEvent!: EventEmitter<number>;
  #handleActualWidthChange = (actualWidth: number): void => {
    this.#actualWidthChangeEvent.emit(actualWidth);
  };

  /**
   * 侧栏状态变化时触发
   * @detail 侧栏状态
   */
  @event({ type: "expanded.state.change" })
  accessor #expandedStateChangeEvent!: EventEmitter<ExpandedState>;
  #handleExpandedStateChange = (state: ExpandedState): void => {
    this.expandedState = state;
    this.#expandedStateChangeEvent.emit(state);
  };

  render() {
    return (
      <EoSidebarComponent
        menu={this.menu}
        expandedState={this.expandedState}
        hiddenFixedIcon={this.hiddenFixedIcon}
        position={this.position}
        onActualWidthChange={this.#handleActualWidthChange}
        onExpandedStateChange={this.#handleExpandedStateChange}
      />
    );
  }
}

interface EoSidebarComponentProps extends EoSidebarProps {
  onActualWidthChange?: (actualWidth: number) => void;
  onExpandedStateChange?: (state: ExpandedState) => void;
}

export function EoSidebarComponent(props: EoSidebarComponentProps) {
  const { t } = useTranslation(NS);

  const {
    hiddenFixedIcon,
    position,
    onActualWidthChange,
    onExpandedStateChange,
  } = props;

  const showUserDefinedIcon = React.useMemo(
    () => getRuntime()?.getFeatureFlags()["sidebar-show-user-defined-icon"],
    []
  );

  const storage = useMemo(() => new JsonStorage(localStorage), []);
  const history = getHistory();
  const currentApp = useCurrentApp();
  const [location, setLocation] = useState(history.location);
  const { pathname, search } = location;

  const [isFirstUsedTooltip, setIsFirstUsedTooltip] = useState<boolean>(
    !storage.getItem(SIDE_BAR_HAS_BEEN_USED)
  );
  const [showContentShadow, setShowContentShadow] = useState<boolean>();
  const [dragging, setDragging] = useState<boolean>();
  const [expandedState, setExpandedState] = useState<ExpandedState>(
    props.expandedState ||
      storage.getItem(SIDE_BAR_EXPAND_STATE) ||
      ExpandedState.Collapsed
  );
  const [menu, setMenu] = useState<SidebarMenuType>();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [openedKeys, setOpenedKeys] = useState<string[]>([]);
  const [matchedKeys, setmatchedKeys] = useState<string[]>([]);

  const titleIcon = showUserDefinedIcon ? menu?.icon : currentApp?.menuIcon;

  useEffect(() => {
    const { selectedKeys, openedKeys, matchedKeys } =
      initMenuItemAndMatchCurrentPathKeys(
        props.menu?.menuItems ?? [],
        pathname,
        search,
        ""
      );
    setMenu(props.menu);
    setSelectedKeys(selectedKeys);
    setOpenedKeys(openedKeys);
    setmatchedKeys(matchedKeys);
  }, [props.menu, pathname, search]);

  useEffect(() => {
    const unListen: UnregisterCallback = history.listen((location) => {
      setLocation(location);
    });
    return unListen;
  }, [history]);

  const contentBottomPlaceholderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentBottomPlaceholderRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.target === contentBottomPlaceholderRef.current) {
              setShowContentShadow(!entry.isIntersecting);
            }
          });
        },
        { threshold: 1 }
      );

      observer.observe(contentBottomPlaceholderRef.current);

      return () => {
        observer.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    setExpandedState(
      props.expandedState ||
        storage.getItem(SIDE_BAR_EXPAND_STATE) ||
        ExpandedState.Collapsed
    );
  }, [props.expandedState]);

  useEffect(() => {
    storage.setItem(
      SIDE_BAR_EXPAND_STATE,
      expandedState === ExpandedState.Expanded
        ? ExpandedState.Expanded
        : ExpandedState.Collapsed
    );
  }, [expandedState]);

  const handleFixedIconClick = (): void => {
    setIsFirstUsedTooltip(false);
    storage.setItem(SIDE_BAR_HAS_BEEN_USED, true);

    setExpandedState((state) => {
      const newState =
        state === ExpandedState.Expanded
          ? ExpandedState.Collapsed
          : ExpandedState.Expanded;

      newState !== state && onExpandedStateChange?.(newState);
      return newState;
    });
  };

  const [expandedWidth, setExpandedWidth] = useState<number>(() => {
    // Use parseInt to compatible non-number types
    let memorizedWidth = parseInt(storage.getItem(SIDE_BAR_RESIZE_WIDTH), 10);
    if (memorizedWidth < sideBarWidth || Number.isNaN(memorizedWidth)) {
      memorizedWidth = sideBarWidth;
    }
    return memorizedWidth;
  });

  useEffect(() => {
    storage.setItem(SIDE_BAR_RESIZE_WIDTH, expandedWidth);
  }, [expandedWidth]);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleResizeDown: MouseEventHandler = (e) => {
    setDragging(true);

    // Prevent text selection when dragging
    if (e.cancelable) {
      e.preventDefault();
    }

    const offsetX = containerRef.current?.getBoundingClientRect().left ?? 0;

    const drag = debounceByAnimationFrame((e: MouseEvent) => {
      const x = e.clientX - offsetX;
      const width = x >= sideBarWidth ? x : sideBarWidth;

      setExpandedWidth(width);
    });
    const dragEnd = (e: MouseEvent) => {
      setDragging(false);
      e.preventDefault();

      window.removeEventListener("mousemove", drag);
      window.removeEventListener("mouseup", dragEnd);
    };

    window.addEventListener("mousemove", drag, { passive: true });
    window.addEventListener("mouseup", dragEnd);
  };

  const handleMouseEnter = (): void => {
    setExpandedState((state) => {
      const newState =
        state === ExpandedState.Expanded
          ? ExpandedState.Expanded
          : ExpandedState.Hovered;

      newState !== state && onExpandedStateChange?.(newState);
      return newState;
    });
  };

  const handleMouseLeave = (): void => {
    setExpandedState((state) => {
      const newState =
        state === ExpandedState.Expanded
          ? ExpandedState.Expanded
          : ExpandedState.Collapsed;

      newState !== state && onExpandedStateChange?.(newState);
      return newState;
    });
  };

  const sidebarActualWidth = useMemo(() => {
    return expandedState === ExpandedState.Expanded
      ? expandedWidth
      : sideBarCollapsedWidth;
  }, [expandedState, expandedWidth]);

  useEffect(() => {
    onActualWidthChange?.(sidebarActualWidth);
  }, [onActualWidthChange, sidebarActualWidth]);

  const getContainerWidth = (inner?: boolean) => {
    // With static position, when not expanded, the outer container will keep
    // collapsed even if hovered, while only the inner container will expand.
    if (position === "static") {
      return expandedState === ExpandedState.Expanded ||
        (inner && expandedState === ExpandedState.Hovered)
        ? expandedWidth
        : sideBarCollapsedWidth;
    }
    return expandedState === ExpandedState.Collapsed
      ? sideBarCollapsedWidth
      : expandedWidth;
  };

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener("mouseenter", handleMouseEnter);
    container?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container?.removeEventListener("mouseenter", handleMouseEnter);
      container?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className={classNames("sidebar-container", `state-${expandedState}`, {
        dragging,
      })}
      style={{ width: getContainerWidth() }}
      ref={containerRef}
      data-testid="side-bar"
    >
      <div className="inner" style={{ width: getContainerWidth(true) }}>
        <div className="header">
          <div className="menu-title">
            <div className={classNames("menu-title-icon-container")}>
              {titleIcon ? (
                <WrappedIcon
                  {...(titleIcon as GeneralIconProps)}
                  className="menu-title-icon"
                />
              ) : (
                <span className="menu-title-point" />
              )}
            </div>
            <div className="menu-title-text" title={menu?.title}>
              {menu?.title}
            </div>
          </div>
        </div>

        <div
          className={classNames("content", {
            "show-shadow": showContentShadow,
          })}
        >
          <SidebarMenu
            selectedKeys={selectedKeys}
            openedKeys={openedKeys}
            matchedKeys={matchedKeys}
            menu={menu}
            expandedState={expandedState}
          />
          <div ref={contentBottomPlaceholderRef} />
        </div>

        <div className="footer">
          {!hiddenFixedIcon && (
            <WrappedTooltip
              content={
                (expandedState === ExpandedState.Expanded
                  ? isFirstUsedTooltip
                    ? t(K.CLICK_TO_FIX_NAVIGATION, {
                        action: t(K.UNPIN_NAVIGATION),
                      })
                    : t(K.UNPIN_NAVIGATION)
                  : isFirstUsedTooltip
                  ? t(K.CLICK_TO_FIX_NAVIGATION, {
                      action: t(K.FIXED_NAVIGATION),
                    })
                  : t(K.FIXED_NAVIGATION)) as string
              }
            >
              <i className="fixed-icon" onClick={handleFixedIconClick}>
                {expandedState === ExpandedState.Expanded ? (
                  <FixedSvg />
                ) : (
                  <ToFixedSvg />
                )}
              </i>
            </WrappedTooltip>
          )}
        </div>
        {expandedState === ExpandedState.Expanded && (
          <span className="resize-line" onMouseDown={handleResizeDown} />
        )}
      </div>
    </div>
  );
}
