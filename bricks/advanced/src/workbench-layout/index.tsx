import React, { useCallback, useMemo, useRef, useState } from "react";
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
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
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

type Item = UseSingleBrickConf & {
  position: Layout;
  key: string;
  title: string;
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
  @property({
    type: Boolean,
  })
  accessor isEdit: boolean | undefined;

  @property({
    attribute: false,
  })
  accessor layouts: Layout[];

  @property({
    attribute: false,
  })
  accessor componentList: Item[];

  @event({
    type: "save.layout",
  })
  accessor #saveLayoutEvent!: EventEmitter<Layout[]>;

  #handleSaveLayout = (layout: Layout[]) => {
    this.#saveLayoutEvent.emit(layout);
  };

  render() {
    return (
      <EoWorkbenchLayoutComponent
        layouts={this.layouts}
        componentList={this.componentList}
        isEdit={this.isEdit}
        onSave={this.#handleSaveLayout}
      />
    );
  }
}

export interface EoWorkbenchLayoutProps {
  layouts: Layout[];
  componentList: Item[];
  isEdit?: boolean;
  onSave?: (layout: Layout[]) => void;
}

const getRealKey = (key: string): string =>
  key?.includes(":") ? key.split(":")[0] : key;

export function EoWorkbenchLayoutComponent(props: EoWorkbenchLayoutProps) {
  const ResponsiveReactGridLayout = useMemo(
    () => WidthProvider(Responsive),
    []
  );
  const gridLayoutRef = useRef<HTMLDivElement>();
  const layoutCacheRef = useRef<Layout[]>();

  const [componentList, setComponentList] = useState<Item[]>(
    props.componentList
  );
  const [layouts, setLayouts] = useState<Layout[]>(props.layouts);
  const [cols, setCols] = useState<number>(3);

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
        setLayouts((items) =>
          items.map((item) => {
            const matchLayout = layoutCacheRef.current.find(
              (layout) => getRealKey(layout.i) === getRealKey(item.i)
            );
            // should update key to refresh layout
            const key = `${getRealKey(item.i)}:${Math.random()}`;
            return {
              ...matchLayout,
              i: key,
            };
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

  const handleSave = () => {
    props.onSave?.(
      layouts.map((item) => ({
        ...item,
        i: getRealKey(item.i),
      }))
    );
  };

  const handleDeleteItem = useCallback(
    (e: React.MouseEvent, deteleItem: Item) => {
      e.stopPropagation();
      setLayouts((items) => {
        return items.filter((item) => getRealKey(item.i) !== deteleItem.key);
      });
    },
    []
  );

  const renderChild = useMemo(
    () =>
      layouts.map((layout) => {
        const component = componentList.find(
          (item) => item.key === getRealKey(layout.i)
        );
        return (
          <div
            key={layout.i}
            data-grid={{
              ...(component?.position ?? {}),
              ...layout,
            }}
            className="drag-box"
          >
            <ReactUseBrick useBrick={component} />
            {props.isEdit && (
              <WrappedIcon
                icon="delete"
                lib="antd"
                className="delete-icon"
                onClick={(e) => handleDeleteItem(e, component)}
              />
            )}
          </div>
        );
      }),
    [componentList, handleDeleteItem, layouts, props.isEdit]
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

  return (
    <div className="grid-layout-wrapper" ref={gridLayoutRef}>
      {props.isEdit && (
        <div className="component-wrapper">
          <div className="component-title">构件列表</div>
          <div className="component-list">
            <WrappedCheckbox
              options={computedOptions}
              value={computedSelectedComponentKeys}
              onChange={handleCheckBoxChange as any}
            />
          </div>
        </div>
      )}
      <div className="layout-wrapper">
        {props.isEdit && (
          <div className="actions-wrapper">
            <WrappedButton danger={true} onClick={handleClearLayout}>
              清除
            </WrappedButton>
            <WrappedButton type="primary" onClick={handleSave}>
              保存
            </WrappedButton>
            <WrappedButton>取消</WrappedButton>
          </div>
        )}
        <ResponsiveReactGridLayout
          className="layout"
          draggableCancel=".delete-icon"
          breakpoints={{ lg: 1300, md: 1024, sm: 768 }}
          cols={{ lg: 3, md: 3, sm: 1 }}
          isResizable={false}
          isDraggable={props.isEdit}
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
