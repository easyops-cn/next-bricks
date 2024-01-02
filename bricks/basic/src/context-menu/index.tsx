import React, { useCallback, useEffect } from "react";
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
});

export interface EoContextMenuProps {
  actions?: Action[];
  active?: boolean;
  position?: Position;
}

export type Position = [x: number, y: number];

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
   * 点击菜单项动作时触发
   *
   * @detail 该菜单项动作配置
   */
  @event({ type: "action.click" })
  accessor #actionClickEvent!: EventEmitter<SimpleAction>;

  @method()
  open({ position }: { position: [x: number, y: number] }) {
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
      />
    );
  }
}

export interface EoContextMenuComponentProps extends EoContextMenuProps {
  onActionClick?(action: SimpleAction): void;
  element?: EoContextMenu;
}

export function EoContextMenuComponent({
  element,
  actions,
  active: _active,
  position,
  onActionClick,
}: EoContextMenuComponentProps) {
  const active = _active ?? false;

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

  return (
    <>
      <div
        className="mask"
        onClick={handleMaskClick}
        onContextMenu={handleMaskClick}
      />
      <WrappedActions
        actions={actions}
        onActionClick={handleActionClick}
        style={{
          left: position?.[0],
          top: position?.[1],
        }}
      />
    </>
  );
}
