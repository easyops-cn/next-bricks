import React, { useState, useCallback, useRef, useEffect } from "react";
import { createDecorators, EventEmitter } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import "@next-core/theme";
import { initializeReactI18n } from "@next-core/i18n/react";
import { GeneralIconProps } from "@next-bricks/icons/general-icon";
import { Menu } from "@next-bricks/basic/menu";
import { MenuItem, MenuComponentProps } from "@next-bricks/basic/menu-item";
import { EoTooltip, ToolTipProps } from "@next-bricks/basic/tooltip";
import type { lockBodyScroll as _lockBodyScroll } from "@next-bricks/basic/data-providers/lock-body-scroll/lock-body-scroll";

const WrappedMenu = wrapBrick<Menu, unknown>("eo-menu");
const WrappedMenuItem = wrapBrick<MenuItem, MenuComponentProps>("eo-menu-item");
const WrappedTooltip = wrapBrick<EoTooltip, ToolTipProps>("eo-tooltip");
const lockBodyScroll = unwrapProvider<typeof _lockBodyScroll>(
  "basic.lock-body-scroll"
);

import { NS, locales } from "./i18n.js";
import styleText from "./styles.shadow.css";

initializeReactI18n(NS, locales);

const { defineElement, property, event, method } = createDecorators();

const MINIMAL_PADDING = 8;

export type Position = [x: number, y: number];

export interface OpenInfo {
  /**
   * 通常设为 `[EVENT.clientX, EVENT.clientY]`
   */
  position: Position;
}

export interface SnippetItem {
  text: string;
  icon?: GeneralIconProps;
  disabled?: boolean;
  hidden?: boolean;
  tooltip?: string;
  dragConf?: {
    format: string;
    data: unknown;
  };
}

export interface SnippetOption {
  title?: string;
  children?: SnippetItem[];
}

/**
 * 构件 `visual-builder.generate-snippets-context-menu`
 */
export
@defineElement("visual-builder.generate-snippets-context-menu", {
  styleTexts: [styleText],
})
class GenerateSnippetsContextMenu extends ReactNextElement {
  @property({
    attribute: false,
  })
  accessor options: SnippetOption[] | undefined;

  @property({
    type: Boolean,
  })
  accessor active: boolean | undefined;

  @property({ attribute: false })
  accessor position: Position | undefined;

  @event({ type: "item.drag.start" })
  accessor #itemDragStartEvent!: EventEmitter<SnippetItem>;

  @event({ type: "item.drag.end" })
  accessor #itemDragEndEvent!: EventEmitter<SnippetItem>;

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

  #handleItemDragStart = (action: SnippetItem): void => {
    this.#itemDragStartEvent.emit(action);
  };

  #handleItemDragEnd = (action: SnippetItem): void => {
    this.#itemDragEndEvent.emit(action);
  };

  disconnectedCallback() {
    super.disconnectedCallback();
    lockBodyScroll(this, false);
  }

  render() {
    return (
      <GenerateSnippetsContextMenuComponent
        active={this.active}
        element={this}
        position={this.position}
        onItemDragStart={this.#handleItemDragStart}
        onItemDragEnd={this.#handleItemDragEnd}
        options={this.options}
      />
    );
  }
}

export interface GenerateSnippetsContextMenuProps {
  options?: SnippetOption[];
  active?: boolean;
  position?: Position;
  element?: GenerateSnippetsContextMenu;
  onItemDragStart?: (data: SnippetItem) => void;
  onItemDragEnd?: (data: SnippetItem) => void;
}

export function GenerateSnippetsContextMenuComponent({
  element,
  active,
  onItemDragEnd,
  onItemDragStart,
  options,
  position,
}: GenerateSnippetsContextMenuProps) {
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<any>(null);
  const [fixedPosition, setFixedPosition] = useState<Position | null>(null);

  const handleMaskClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      element?.close();
    },
    [element]
  );

  const handleItemStart = useCallback(
    (e: React.DragEvent, data: SnippetItem) => {
      setDragging(true);

      if (data.dragConf) {
        e.dataTransfer?.setData(
          data.dragConf.format,
          JSON.stringify(data.dragConf.data)
        );
      }
      (e.target as HTMLElement).classList.add("dragging");
      onItemDragStart?.(data);
    },
    [onItemDragStart]
  );

  const handleItemDragEnd = useCallback(
    (e: React.DragEvent, data: SnippetItem) => {
      setDragging(false);
      (e.target as HTMLElement).classList.remove("dragging");
      element?.close();
      onItemDragEnd?.(data);
    },
    [element, onItemDragEnd]
  );

  useEffect(() => {
    lockBodyScroll(element!, active);
  }, [active, element]);

  useEffect(() => {
    if (active && containerRef.current && position) {
      const rect = containerRef.current.getBoundingClientRect();
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
      <div
        className="container"
        ref={containerRef}
        style={{
          left: (fixedPosition ?? position)?.[0],
          top: (fixedPosition ?? position)?.[1],
          visibility: fixedPosition ? "visible" : "hidden",
        }}
      >
        {options?.map((op, index) => (
          <div key={index}>
            <div className="title">{op.title}</div>
            {op.children?.length && (
              <WrappedMenu>
                {op.children?.map((item, itemIndex) => {
                  return (
                    <WrappedTooltip
                      content={item.tooltip}
                      hoist
                      placement="left"
                      key={itemIndex}
                    >
                      <WrappedMenuItem
                        disabled={item.disabled}
                        icon={item.icon}
                        draggable={!item.disabled}
                        onDragStart={(e: React.DragEvent) =>
                          handleItemStart(e, item)
                        }
                        onDragEnd={(e: React.DragEvent) =>
                          handleItemDragEnd(e, item)
                        }
                      >
                        {item.text}
                      </WrappedMenuItem>
                    </WrappedTooltip>
                  );
                })}
              </WrappedMenu>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
