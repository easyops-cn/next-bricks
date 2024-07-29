import React, {
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { unwrapProvider } from "@next-core/utils/general";
import { UseSingleBrickConf } from "@next-core/types";
import { ReactUseBrick } from "@next-core/react-runtime";
import { auth } from "@next-core/easyops-runtime";
import "@next-core/theme";
import {
  ItemCallback,
  Layout,
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import {
  DropdownButton,
  DropdownButtonEvents,
  DropdownButtonEventsMap,
  DropdownButtonProps,
} from "@next-bricks/basic/dropdown-button";
import type {
  Checkbox,
  CheckboxOptionType,
  CheckboxProps,
} from "@next-bricks/form/checkbox";
import type { showDialog as _showDialog } from "@next-bricks/basic/data-providers/show-dialog/show-dialog";
import { SimpleAction } from "@next-bricks/basic/actions";

const { defineElement, property, event, method } = createDecorators();

type Item = {
  position: Layout;
  key: string;
  title: string;
  style?: React.CSSProperties;
  useBrick: UseSingleBrickConf;
};

interface CheckboxEvents {
  change: CustomEvent<CheckboxOptionType[]>;
}

interface CheckboxEventsMap {
  onChange: "change";
}

const WrappedButton = wrapBrick<Button, ButtonProps>("eo-button");
const WrappedDropdownButton = wrapBrick<
  DropdownButton,
  DropdownButtonProps,
  DropdownButtonEvents,
  DropdownButtonEventsMap
>("eo-dropdown-button", {
  onActionClick: "action.click",
});
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedCheckbox = wrapBrick<
  Checkbox,
  CheckboxProps,
  CheckboxEvents,
  CheckboxEventsMap
>("eo-checkbox", {
  onChange: "change",
});
const showDialog = unwrapProvider<typeof _showDialog>("basic.show-dialog");

export interface EoWorkbenchLayoutProps {
  cardTitle?: string;
  layouts?: Layout[];
  componentList?: Item[];
  isEdit?: boolean;
}

export interface EoWorkbenchLayoutComponentRef {
  setLayouts(layouts: Layout[]): void;
}

export interface EoWorkbenchLayoutComponentProps
  extends EoWorkbenchLayoutProps {
  onChange?: (layout: Layout[]) => void;
  onSave?: (layout: Layout[]) => void;
  onCancel?: () => void;
  onActionClick?: (action: SimpleAction, layouts: Layout[]) => void;
}

const getRealKey = (key: string): string =>
  key?.includes(":") ? key.split(":")[0] : key;
const { isAdmin } = auth.getAuth();

export const EoWorkbenchLayoutComponent = forwardRef<
  EoWorkbenchLayoutComponentRef,
  EoWorkbenchLayoutComponentProps
>(function EoWorkbenchLayoutComponent(
  {
    cardTitle = "卡片列表",
    layouts: layoutsProps,
    componentList = [],
    isEdit,
    onChange,
    onSave,
    onCancel,
    onActionClick,
  },
  ref
) {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );
  const gridLayoutRef = useRef<HTMLDivElement>(null);
  const layoutWrapperRef = useRef<HTMLDivElement>(null);
  const layoutCacheRef = useRef<Layout[]>(layoutsProps ?? []);

  const [layouts, _setLayouts] = useState<Layout[]>(layoutCacheRef.current);
  const [cols, setCols] = useState<number>(3);
  const [layoutWrapperStyle, setLayoutWrapperStyle] =
    useState<React.CSSProperties>();

  const setLayouts = useCallback((layouts: Layout[]) => {
    layoutCacheRef.current = layouts;
    _setLayouts(layouts);
  }, []);

  useImperativeHandle(ref, () => ({
    setLayouts,
  }));

  const handleChange = useCallback(
    (layouts: Layout[]) => {
      setLayouts(layouts);
      onChange?.(layouts);
    },
    [onChange, setLayouts]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDragCallback: ItemCallback = (layout, oldItem, newItem) => {
    const placeholderDOM = gridLayoutRef.current?.querySelector(
      ".react-grid-placeholder"
    );
    if (placeholderDOM) {
      if (newItem.w > 1 && newItem.x > 0) {
        !placeholderDOM.classList.contains("forbidden") &&
          placeholderDOM.classList.add("forbidden");
      } else {
        placeholderDOM.classList.contains("forbidden") &&
          placeholderDOM.classList.remove("forbidden");
      }
    }
  };

  const handleLayoutChange = useCallback(
    (currentLayout: Layout[]) => {
      if (!isEdit) {
        return;
      }

      let isAllowAction = true;

      for (let t = 0; t < currentLayout.length; t++) {
        const { x, w, y, h, i, minH } = currentLayout[t];
        if (w > 1 && x > 0) {
          isAllowAction = false;
          break;
        }
        if (w === 1 && x < 2) {
          const matchItem = currentLayout.find(
            (item) => item.i !== i && item.w === 1 && item.y === y && x < 2
          );
          if (matchItem) {
            currentLayout[t].minH = currentLayout[t].minH ?? h;
            currentLayout[t].h = Math.max(matchItem.h, h);
          }
        } else {
          currentLayout[t].h = minH ?? h;
          currentLayout[t].minH = undefined;
        }
      }

      handleChange(
        !isAllowAction
          ? // revert to previous layouts
            layoutCacheRef.current.map((item) => {
              const { w, i } = item;
              // should update key to refresh layout
              const key = `${getRealKey(i)}:${Math.random()}`;
              let x = item.x;

              if (w > 1 && x > 0) {
                x = 0;
              }

              return {
                ...item,
                x,
                i: key,
              };
            })
          : currentLayout
      );
    },
    [handleChange, isEdit]
  );

  const handleBreakpointChange = (_newBreakpoint: string, newCols: number) => {
    setCols(newCols);
  };

  const handleCheckBoxChange = useCallback(
    (event: CustomEvent<CheckboxOptionType[]>): void => {
      const checkedKeys = event.detail.map((item) => item.value);
      const layoutsKeys = layouts.map((item) => getRealKey(item.i));
      const addItems = event.detail
        .filter((item) => !layoutsKeys.includes(item.key))
        .map((item) => ({
          ...item.position,
          x: item.w > 1 ? 0 : (layouts.length * 2) % cols,
          y: Infinity,
        }));

      handleChange(
        layouts
          .filter((layout) => checkedKeys.includes(getRealKey(layout.i)))
          .concat(addItems)
      );
    },
    [layouts, handleChange, cols]
  );

  const handleClearLayout = () => {
    handleChange([]);
  };

  const handleSave = useCallback(() => {
    onSave?.(
      layouts.map((item) => ({
        ...item,
        i: getRealKey(item.i),
      }))
    );
  }, [layouts, onSave]);

  const handleCancel = () => {
    onCancel?.();
  };

  const handleActionClick = (action: SimpleAction) => {
    const { event } = action;

    switch (event) {
      case "clear":
        showDialog({
          type: "confirm",
          title: "清空确认",
          content: "将清空所有卡片，从零开始编辑，该操作无法撤回。",
        }).then(handleClearLayout);
        break;
      default:
        onActionClick?.(
          action,
          (layouts ?? []).map((item) => ({
            ...item,
            i: getRealKey(item.i),
          }))
        );
    }
  };

  const handleDeleteItem = useCallback(
    (e: React.MouseEvent, deletedItem: Item) => {
      e.stopPropagation();
      handleChange(
        layouts.filter((item) => getRealKey(item.i) !== deletedItem.key) ?? []
      );
    },
    [handleChange, layouts]
  );

  const handleEditMaskClick = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const renderChild = useMemo(
    () =>
      layouts
        .map((layout) => {
          const component = componentList.find(
            (item) => item.key === getRealKey(layout.i)
          );
          if (!component) {
            return null;
          }
          return (
            <div
              key={layout.i}
              data-grid={{
                ...(component.position ?? {}),
                ...layout,
              }}
              style={component.style}
              className="drag-box"
            >
              {isEdit && (
                <div className="edit-mask" onMouseDown={handleEditMaskClick} />
              )}
              <ReactUseBrick useBrick={component.useBrick} />
              {isEdit && (
                <WrappedIcon
                  icon="delete"
                  lib="antd"
                  className="delete-icon"
                  onClick={(e) => handleDeleteItem(e, component)}
                />
              )}
            </div>
          );
        })
        .filter(Boolean),
    [componentList, handleDeleteItem, layouts, isEdit]
  );

  const computedOptions = useMemo(
    () =>
      componentList.map((item) => ({
        ...item,
        label: item.title,
        value: item.key,
      })),
    [componentList]
  );

  const computedSelectedComponentKeys = useMemo(
    () => layouts.map((layout) => getRealKey(layout.i)),
    [layouts]
  );

  const handleWatchLayoutSizeChange = useCallback(() => {
    if (layoutWrapperRef && isEdit) {
      const { top } =
        layoutWrapperRef.current?.getClientRects()?.[0] ?? ({} as DOMRect);
      top !== undefined &&
        setLayoutWrapperStyle({
          height: document.body.clientHeight - top,
          overflow: "scroll",
        });
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) {
      handleWatchLayoutSizeChange();
      setLayouts(layoutsProps || []); // 编辑的情况下需要动态改变一些布局
      window.addEventListener("resize", handleWatchLayoutSizeChange);

      return () => {
        window.removeEventListener("resize", handleWatchLayoutSizeChange);
      };
    }
  }, [isEdit, handleWatchLayoutSizeChange, layoutsProps, setLayouts]);

  return (
    <div className="grid-layout-wrapper" ref={gridLayoutRef}>
      {isEdit && (
        <div className="component-wrapper">
          <div className="component-title">{cardTitle}</div>
          <div className="component-list">
            <WrappedCheckbox
              options={computedOptions}
              value={computedSelectedComponentKeys}
              onChange={handleCheckBoxChange as any}
            />
            <slot name="toolbar"></slot>
          </div>
        </div>
      )}
      <div
        className="layout-wrapper"
        ref={layoutWrapperRef}
        style={layoutWrapperStyle}
      >
        {isEdit && (
          <div className="actions-wrapper">
            <WrappedButton type="primary" onClick={handleSave}>
              保存
            </WrappedButton>
            <WrappedButton onClick={handleCancel}>取消</WrappedButton>
            <WrappedDropdownButton
              btnText="更多"
              icon={{
                lib: "antd",
                icon: "down",
              }}
              actions={[
                ...(isAdmin
                  ? [{ text: "另存为模板", event: "saveAsTemplate" }]
                  : []),
                { text: "从模版加载", event: "loadFromTemplate" },
                { text: "清空所有", danger: true, event: "clear" },
              ]}
              onActionClick={(e) => {
                handleActionClick(e.detail);
              }}
              data-testid="edit-layout-actions"
            />
          </div>
        )}
        <ResponsiveReactGridLayout
          className="layout"
          draggableCancel=".delete-icon,.edit-actions,.ignore-item"
          breakpoints={{ lg: 1300, md: 1024, sm: 768 }}
          rowHeight={1}
          cols={{ lg: 3, md: 3, sm: isEdit ? 3 : 1 }}
          isResizable={false}
          isDraggable={isEdit}
          onDrag={handleDragCallback}
          onLayoutChange={handleLayoutChange}
          onBreakpointChange={handleBreakpointChange}
        >
          {renderChild}
        </ResponsiveReactGridLayout>
      </div>
    </div>
  );
});

/**
 * 工作台布局
 * @deprecated Please use eo-workbench-layout-v2 which support global styles instead
 */
export
@defineElement("eo-workbench-layout", {
  styleTexts: [styleText],
})
class EoWorkbenchLayout extends ReactNextElement {
  #componentRef = createRef<EoWorkbenchLayoutComponentRef>();

  @property()
  accessor cardTitle: string | undefined;

  @property({
    type: Boolean,
  })
  accessor isEdit: boolean | undefined;

  @property({
    attribute: false,
  })
  accessor layouts: Layout[] | undefined;

  @property({
    attribute: false,
  })
  accessor componentList: Item[] | undefined;

  @event({
    type: "change",
  })
  accessor #changeEvent!: EventEmitter<Layout[]>;

  #handleChange = (layouts: Layout[]) => {
    this.#changeEvent.emit(layouts);
  };

  @event({
    type: "save",
  })
  accessor #saveEvent!: EventEmitter<Layout[]>;

  #handleSave = (layouts: Layout[]) => {
    this.#saveEvent.emit(layouts);
  };

  @event({
    type: "cancel",
  })
  accessor #cancelEvent!: EventEmitter<void>;

  #handleCancel = () => {
    this.#cancelEvent.emit();
  };

  /**
   * 操作点击事件
   * @detail {
        action: SimpleAction;
        layouts: Layout[];
      }
   */
  @event({
    type: "action.click",
  })
  accessor #actionClickEvent!: EventEmitter<{
    action: SimpleAction;
    layouts: Layout[];
  }>;

  #handleActionClick = (action: SimpleAction, layouts: Layout[]): void => {
    this.#actionClickEvent.emit({ action, layouts });
    action.event &&
      this.dispatchEvent(new CustomEvent(action.event, { detail: layouts }));
  };

  @method()
  setLayouts(layouts: Layout[]) {
    this.#componentRef.current?.setLayouts(layouts);
  }

  render() {
    return (
      <EoWorkbenchLayoutComponent
        cardTitle={this.cardTitle}
        layouts={this.layouts}
        componentList={this.componentList}
        isEdit={this.isEdit}
        onChange={this.#handleChange}
        onSave={this.#handleSave}
        onCancel={this.#handleCancel}
        onActionClick={this.#handleActionClick}
        ref={this.#componentRef}
      />
    );
  }
}
