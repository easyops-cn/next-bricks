import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EventEmitter, createDecorators } from "@next-core/element";
import { ReactNextElement, wrapBrick } from "@next-core/react-element";
import { UseSingleBrickConf } from "@next-core/types";
import { ReactUseBrick } from "@next-core/react-runtime";
import {
  ItemCallback,
  Layout,
  Layouts,
  Responsive,
  WidthProvider,
} from "react-grid-layout";
import "@next-core/theme";
import styleText from "./styles.shadow.css";
import type {
  GeneralIcon,
  GeneralIconProps,
} from "@next-bricks/icons/general-icon";
import type { Button, ButtonProps } from "@next-bricks/basic/button";
import type {
  Checkbox,
  CheckboxOptionType,
  CheckboxProps,
} from "@next-bricks/form/checkbox";

const { defineElement, property, event } = createDecorators();

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
const WrappedIcon = wrapBrick<GeneralIcon, GeneralIconProps>("eo-icon");
const WrappedCheckbox = wrapBrick<
  Checkbox,
  CheckboxProps,
  CheckboxEvents,
  CheckboxEventsMap
>("eo-checkbox", {
  onChange: "change",
});

/**
 * 工作台布局
 */
export
@defineElement("eo-workbench-layout", {
  styleTexts: [styleText],
})
class EoWorkbenchLayout extends ReactNextElement {
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
    type: "save",
  })
  accessor #saveLayoutEvent!: EventEmitter<Layout[]>;

  #handleSaveLayout = (layout: Layout[]) => {
    this.#saveLayoutEvent.emit(layout);
  };

  @event({
    type: "cancel",
  })
  accessor #cancelEvent!: EventEmitter<void>;

  #handleCancel = () => {
    this.#cancelEvent.emit();
  };

  render() {
    return (
      <EoWorkbenchLayoutComponent
        cardTitle={this.cardTitle}
        layouts={this.layouts}
        componentList={this.componentList}
        isEdit={this.isEdit}
        onSave={this.#handleSaveLayout}
        onCancel={this.#handleCancel}
      />
    );
  }
}

export interface EoWorkbenchLayoutProps {
  cardTitle?: string;
  layouts?: Layout[];
  componentList?: Item[];
  isEdit?: boolean;
  onSave?: (layout: Layout[]) => void;
  onCancel?: () => void;
}

const getRealKey = (key: string): string =>
  key?.includes(":") ? key.split(":")[0] : key;

export function EoWorkbenchLayoutComponent({
  cardTitle = "卡片列表",
  layouts: layoutsProps,
  componentList = [],
  isEdit,
  onSave,
  onCancel,
}: EoWorkbenchLayoutProps) {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );
  const gridLayoutRef = useRef<HTMLDivElement>(null);
  const layoutCacheRef = useRef<Layout[]>();
  const layoutWarpperRef = useRef<HTMLDivElement>(null);

  const [layouts, setLayouts] = useState<Layout[]>(layoutsProps ?? []);
  const [cols, setCols] = useState<number>(3);
  const [layoutWrapperStyle, setLayoutWrapperStyle] =
    useState<React.CSSProperties>();

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
    (currentLayout: Layout[], allLayouts: Layouts) => {
      if (!layoutCacheRef.current) {
        layoutCacheRef.current = currentLayout;
      }
      let isAllowAction = true;
      for (let t = 0; t < currentLayout.length; t++) {
        const { x, w } = currentLayout[t];
        if (w > 1 && x > 0) {
          isAllowAction = false;
          break;
        }
      }
      if (!isAllowAction) {
        setLayouts(
          (items) =>
            items?.map((item) => {
              const matchLayout = layoutCacheRef.current?.find(
                (layout) => getRealKey(layout.i) === getRealKey(item.i)
              );
              // should update key to refresh layout
              const key = `${getRealKey(item.i)}:${Math.random()}`;
              return {
                ...matchLayout,
                i: key,
              } as Layout;
            })
        );
        return;
      }

      layoutCacheRef.current = currentLayout;
    },
    []
  );

  const handleBreakpointChange = (newBreakpoint: string, newCols: number) => {
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

      setLayouts((layouts) => {
        return layouts
          .filter((layout) => checkedKeys.includes(getRealKey(layout.i)))
          .concat(addItems);
      });
    },
    [layouts, cols]
  );

  const handleClearLayout = () => {
    setLayouts([]);
  };

  const handleSave = useCallback(() => {
    onSave?.(
      (layoutCacheRef.current ?? []).map((item) => ({
        ...item,
        i: getRealKey(item.i),
      }))
    );
  }, [onSave]);

  const handleCancel = () => {
    onCancel?.();
  };

  const handleDeleteItem = useCallback(
    (e: React.MouseEvent, deteleItem: Item) => {
      e.stopPropagation();
      setLayouts(
        layoutCacheRef.current?.filter(
          (item) => getRealKey(item.i) !== deteleItem.key
        ) ?? []
      );
    },
    []
  );

  const handleEditMaskClcik = (e: React.MouseEvent) => {
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
                <div className="edit-mask" onMouseDown={handleEditMaskClcik} />
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
    if (layoutWarpperRef && isEdit) {
      const { top } =
        layoutWarpperRef.current?.getClientRects()?.[0] ?? ({} as DOMRect);
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
      window.addEventListener("resize", handleWatchLayoutSizeChange);

      return () => {
        window.removeEventListener("resize", handleWatchLayoutSizeChange);
      };
    }
  }, [isEdit, handleWatchLayoutSizeChange]);

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
        ref={layoutWarpperRef}
        style={layoutWrapperStyle}
      >
        {isEdit && (
          <div className="actions-wrapper">
            <WrappedButton type="primary" onClick={handleSave}>
              保存
            </WrappedButton>
            <WrappedButton danger={true} onClick={handleClearLayout}>
              清除
            </WrappedButton>
            <WrappedButton onClick={handleCancel}>取消</WrappedButton>
          </div>
        )}
        <ResponsiveReactGridLayout
          className="layout"
          draggableCancel=".delete-icon,.edit-actions,.ingore-item"
          breakpoints={{ lg: 1300, md: 1024, sm: 768 }}
          rowHeight={1}
          cols={{ lg: 3, md: 3, sm: 1 }}
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
}
