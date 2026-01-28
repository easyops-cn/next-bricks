import React, { useCallback, useEffect, useRef, useState } from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import "@next-core/theme";
import type { lockBodyScroll as _lockBodyScroll } from "../data-providers/lock-body-scroll/lock-body-scroll";
import type {
  Action,
  ActionsEvents,
  ActionsEventsMapping,
  ActionsProps,
  EoActions,
  SimpleAction,
} from "../actions";
import styleText from "./styles.shadow.css";

const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

const { defineElement, property, event, method } = createDecorators();

const WrappedActions = wrapBrick<
  EoActions,
  ActionsProps,
  ActionsEvents,
  ActionsEventsMapping
>("eo-actions", {
  onActionClick: "action.click",
  onItemDragEnd: "item.drag.end",
  onItemDragStart: "item.drag.start",
});

const MINIMAL_PADDING = 8;

export interface EoContextMenuProps {
  actions?: Action[];
  active?: boolean;
  position?: Position;
}

export interface EoContextMenuEvents {
  "action.click": CustomEvent<SimpleAction>;
  "item.drag.start": CustomEvent<SimpleAction>;
  "item.drag.end": CustomEvent<SimpleAction>;
}

export interface EoContextMenuEventsMapping {
  onActionClick: "action.click";
  onItemDragStart: "item.drag.start";
  onItemDragEnd: "item.drag.end";
}

export type Position = [x: number, y: number];

export interface OpenInfo {
  /**
   * 通常设为 `[EVENT.clientX, EVENT.clientY]`
   */
  position: Position;
}

/**
 * 构件 `eo-context-menu`
 */
export
@defineElement("eo-context-menu", {
  styleTexts: [styleText],
})
class EoContextMenu extends ReactNextElement {
  /**
   * 动作列表
   */
  @property({
    attribute: false,
  })
  accessor actions: Action[] | undefined;

  /**
   * 是否激活
   */
  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  @property({ attribute: false })
  accessor position: Position | undefined;

  /**
   * action中的菜单项是否可拖拽
   */
  @property({ type: Boolean })
  accessor itemDraggable: boolean | undefined;

  /**
   * 点击菜单项动作时触发
   *
   * @detail 该菜单项动作配置
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<SimpleAction>;

  /**
   * 开始拖拽菜单项时触发
   *
   * @detail 该菜单项动作配置
   */
  @event({ type: "item.drag.start" })
  accessor #itemDragStartEvent!: EventEmitter<SimpleAction>;

  /**
   * 完成拖拽菜单项时触发
   *
   * @detail 该菜单项动作配置
   */
  @event({ type: "item.drag.end" })
  accessor #itemDragEndEvent!: EventEmitter<SimpleAction>;

  @method()
  open({ position }: OpenInfo) {
    this.active = true;
    this.position = position;
  }

  @method()
  close() {
    this.active = false;
    this.position = undefined;
  }

  #handleActionClick = (action: SimpleAction): void => {
    this.#actionClickEvent.emit(action);
    if (action.event) {
      this.dispatchEvent(new CustomEvent(action.event, { detail: action }));
    }
  };

  #handleItemDragStart = (action: SimpleAction): void => {
    this.#itemDragStartEvent.emit(action);
  };

  #handleItemDragEnd = (action: SimpleAction): void => {
    this.#itemDragEndEvent.emit(action);
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
  }

  render() {
    return (
      <EoContextMenuComponent
        element={this}
        actions={this.actions}
        active={this.active}
        position={this.position}
        onActionClick={this.#handleActionClick}
        itemDraggable={this.itemDraggable}
        onItemDragStart={this.#handleItemDragStart}
        onItemDragEnd={this.#handleItemDragEnd}
      />
    );
  }
}

export interface EoContextMenuComponentProps extends EoContextMenuProps {
  onActionClick?(action: SimpleAction): void;
  onItemDragStart?(action: SimpleAction): void;
  onItemDragEnd?(action: SimpleAction): void;
  itemDraggable?: boolean;
  element?: EoContextMenu;
}

export function EoContextMenuComponent({
  element,
  actions,
  active: _active,
  position,
  onActionClick,
  itemDraggable,
  onItemDragStart,
  onItemDragEnd,
}: EoContextMenuComponentProps) {
  const active = _active ?? false;

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    lockBodyScroll(element!, active);
  }, [active, element]);

  const handleMaskClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      element?.close();
    },
    [element]
  );
  const handleActionClick = useCallback(
    (e: CustomEvent<SimpleAction>) => {
      element?.close();
      onActionClick?.(e.detail);
    },
    [element, onActionClick]
  );

  const handleItemStart = useCallback(
    (e: CustomEvent<SimpleAction>) => {
      setDragging(true);
      onItemDragStart?.(e.detail);
    },
    [onItemDragStart]
  );

  const handleItemDragEnd = useCallback(
    (e: CustomEvent<SimpleAction>) => {
      setDragging(false);
      element?.close();
      onItemDragEnd?.(e.detail);
    },
    [element, onItemDragEnd]
  );

  const actionsRef = useRef<EoActions>(null);
  const [fixedPosition, setFixedPosition] = useState<Position | null>(null);

  useEffect(() => {
    if (active && actionsRef.current && position) {
      // 修正菜单位置，使其不超出视窗
      const rect = actionsRef.current.getBoundingClientRect();
      const width = rect.width + MINIMAL_PADDING;
      const height = rect.height + MINIMAL_PADDING;
      const { clientWidth, clientHeight } = document.documentElement;
      const fixed = [...position] as Position;
      if (clientWidth > width && position[0] + width > clientWidth) {
        fixed[0] = position[0] - width;
      }
      if (clientHeight > height && position[1] + height > clientHeight) {
        fixed[1] = clientHeight - height;
      }
      setFixedPosition(fixed);
    } else {
      setFixedPosition(null);
    }
  }, [active, position]);

  return (
    <>
      {!dragging && (
        <div
          className="mask"
          onClick={handleMaskClick}
          onContextMenu={handleMaskClick}
        />
      )}
      <WrappedActions
        ref={actionsRef}
        actions={actions}
        itemDraggable={itemDraggable}
        onActionClick={handleActionClick}
        onItemDragStart={handleItemStart}
        onItemDragEnd={handleItemDragEnd}
        style={{
          left: (fixedPosition ?? position)?.[0],
          top: (fixedPosition ?? position)?.[1],
          visibility: fixedPosition ? "visible" : "hidden",
        }}
      />
    </>
  );
}
