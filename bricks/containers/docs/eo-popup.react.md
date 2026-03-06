---
tagName: eo-popup
displayName: WrappedEoPopup
description: 可拖拽浮层弹窗容器。
category: container-display
source: "@next-bricks/containers"
---

# WrappedEoPopup

> 可拖拽浮层弹窗容器。

## 导入

```tsx
import { WrappedEoPopup } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型                                                                   | 必填 | 默认值     | 说明                                                            |
| ------------- | ---------------------------------------------------------------------- | ---- | ---------- | --------------------------------------------------------------- |
| popupId       | `string`                                                               | 否   | -          | 浮层 ID，设置后开启位置记录功能，下次打开时恢复上次的位置和尺寸 |
| popupWidth    | `string \| number`                                                     | 否   | `500`      | 弹窗宽度                                                        |
| popupHeight   | `string \| number`                                                     | 否   | -          | 弹窗高度                                                        |
| popupTitle    | `string`                                                               | 否   | -          | 弹窗标题                                                        |
| openDirection | `"leftTop" \| "leftBottom" \| "rightTop" \| "rightBottom" \| "center"` | 否   | `"center"` | 弹窗打开位置                                                    |
| visible       | `boolean`                                                              | 否   | -          | 是否显示模态框                                                  |
| headerStyle   | `React.CSSProperties`                                                  | 否   | -          | 用于设置 popup 头部的样式                                       |
| wrapperStyle  | `React.CSSProperties`                                                  | 否   | -          | 用于设置 popup 容器的样式                                       |
| noPadding     | `boolean`                                                              | 否   | -          | 内容没有边距                                                    |
| resizable     | `boolean`                                                              | 否   | -          | 是否可调整尺寸                                                  |

## Methods

| 方法  | 参数 | 返回值 | 说明     |
| ----- | ---- | ------ | -------- |
| open  | -    | `void` | 显示弹窗 |
| close | -    | `void` | 关闭弹窗 |

## Slots

| 名称     | 说明           |
| -------- | -------------- |
| （默认） | 内容区         |
| toolbar  | 头部工具栏插槽 |

## Examples

### Basic

展示浮层弹窗的基本用法。

```tsx
<WrappedEoPopup popupTitle="Popup" popupHeight="300px" visible={true}>
  <div>Hello, I'm content!</div>
</WrappedEoPopup>
```

### Method & PopupId

通过 `open` / `close` 方法控制弹窗显示，`popupId` 开启位置记录功能。

```tsx
import { useRef } from "react";

const popupRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => popupRef.current?.open()}>
    Open Popup
  </WrappedEoButton>
  <WrappedEoButton onClick={() => popupRef.current?.close()}>
    Close Popup
  </WrappedEoButton>
  <WrappedEoPopup
    ref={popupRef}
    popupTitle="Button Open"
    popupHeight="400px"
    popupId="popupA"
  >
    <div>Hello, I'm content!</div>
  </WrappedEoPopup>
</>;
```

### Resizable

通过 `resizable` 属性允许用户调整弹窗尺寸。

```tsx
<WrappedEoPopup popupTitle="resizable" visible={true} resizable={true}>
  <div>Hello, I'm content!</div>
</WrappedEoPopup>
```

### Toolbar Slot

使用 `toolbar` 插槽在头部右侧放置工具按钮。

```tsx
<WrappedEoPopup popupTitle="resizable" popupHeight="200px" visible={true}>
  <div>Hello, I'm content!</div>
  <WrappedEoIcon
    slot="toolbar"
    icon="edit"
    lib="antd"
    style={{ cursor: "pointer" }}
    onClick={() => console.log("edit")}
  />
</WrappedEoPopup>
```

### Open Direction

通过 `openDirection` 控制弹窗初始出现的位置。

```tsx
import { useRef } from "react";

const ltRef = useRef<any>();
const rbRef = useRef<any>();

<>
  <WrappedEoButton onClick={() => ltRef.current?.open()}>
    Left Top
  </WrappedEoButton>
  <WrappedEoButton onClick={() => rbRef.current?.open()}>
    Right Bottom
  </WrappedEoButton>
  <WrappedEoPopup
    ref={ltRef}
    popupTitle="Left Top"
    popupHeight="200px"
    openDirection="leftTop"
  >
    <div>Opened from left top</div>
  </WrappedEoPopup>
  <WrappedEoPopup
    ref={rbRef}
    popupTitle="Right Bottom"
    popupHeight="200px"
    openDirection="rightBottom"
  >
    <div>Opened from right bottom</div>
  </WrappedEoPopup>
</>;
```

### No Padding

通过 `noPadding` 去除内容区边距，适用于全尺寸内容场景。

```tsx
<WrappedEoPopup
  popupTitle="No Padding"
  popupHeight="300px"
  visible={true}
  noPadding={true}
>
  <div
    style={{
      background: "var(--palette-blue-2)",
      padding: "16px",
      height: "100%",
    }}
  >
    Full-width content without padding
  </div>
</WrappedEoPopup>
```
