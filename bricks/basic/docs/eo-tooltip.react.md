---
tagName: eo-tooltip
displayName: WrappedEoTooltip
description: 文字提示构件，鼠标悬停或点击时显示提示气泡，支持多种弹出方向、图标模式、自定义内容插槽及手动控制显隐
category: feedback-and-tooltip
source: "@next-bricks/basic"
---

# WrappedEoTooltip

> 文字提示构件，鼠标悬停或点击时显示提示气泡，支持多种弹出方向、图标模式、自定义内容插槽及手动控制显隐

## 导入

```tsx
import { WrappedEoTooltip } from "@easyops/wrapped-components";
```

## Props

| 属性      | 类型               | 必填 | 默认值    | 说明                                                                         |
| --------- | ------------------ | ---- | --------- | ---------------------------------------------------------------------------- |
| icon      | `GeneralIconProps` | -    | -         | 图标                                                                         |
| content   | `string`           | -    | -         | 内容                                                                         |
| placement | `Placement`        | -    | -         | 弹出位置                                                                     |
| disabled  | `boolean`          | -    | `false`   | 是否禁用                                                                     |
| open      | `boolean`          | -    | -         | 是否显示                                                                     |
| trigger   | `string`           | -    | -         | 激活方式，包括 `click` \| `hover` \| `focus` \| `manual`，可以多选用空格分隔 |
| hoist     | `boolean`          | -    | -         | 是否使用固定定位防止内容被裁切                                               |
| maxWidth  | `string`           | -    | `"250px"` | 最大长度                                                                     |

## Events

| 事件              | detail                   | 说明                                     |
| ----------------- | ------------------------ | ---------------------------------------- |
| onOpenChange      | `boolean` — 当前是否可见 | 当提示可见性开始变化时触发               |
| onAfterOpenChange | `boolean` — 当前是否可见 | 当提示可见性变化完成并完成所有动画后触发 |

## Methods

| 方法 | 参数 | 返回值 | 说明     |
| ---- | ---- | ------ | -------- |
| show | -    | `void` | 显示提示 |
| hide | -    | `void` | 隐藏提示 |

## Slots

| 名称      | 说明               |
| --------- | ------------------ |
| (default) | 提示的目标元素     |
| content   | 放置在提示中的元素 |

## Examples

### Basic

通过 `content` 设置提示文本，使用 `trigger` 指定触发方式，`onOpenChange` 和 `onAfterOpenChange` 事件监听可见性变化。

```tsx
<div style={{ margin: 50 }}>
  <WrappedEoTooltip
    content="This is a tooltip"
    trigger="hover"
    onOpenChange={(e) => console.log("open.change", e.detail)}
    onAfterOpenChange={(e) => console.log("after.open.change", e.detail)}
  >
    <WrappedEoButton type="primary">hover</WrappedEoButton>
  </WrappedEoTooltip>
</div>
```

### Icon

通过 `icon` 属性为提示配置一个图标作为触发目标。

```tsx
<div style={{ margin: 50 }}>
  <WrappedEoTooltip
    content="This is a tooltip"
    icon={{ lib: "antd", icon: "search" }}
    trigger="hover"
    onOpenChange={(e) => console.log("open.change", e.detail)}
    onAfterOpenChange={(e) => console.log("after.open.change", e.detail)}
  />
</div>
```

### Trigger

`trigger` 属性支持 `hover`、`click`、`focus`、`manual` 四种触发方式。

```tsx
<div style={{ margin: 50, display: "flex", gap: 100 }}>
  <WrappedEoTooltip content="This is a tooltip" trigger="hover">
    <WrappedEoButton type="primary">hover</WrappedEoButton>
  </WrappedEoTooltip>
  <WrappedEoTooltip content="This is a tooltip" trigger="click">
    <WrappedEoButton type="primary">click</WrappedEoButton>
  </WrappedEoTooltip>
  <WrappedEoTooltip content="This is a tooltip" trigger="focus">
    <WrappedEoInput type="primary">focus</WrappedEoInput>
  </WrappedEoTooltip>
</div>
```

### Placement

通过 `placement` 属性控制提示弹出的方向位置。

```tsx
const placements = [
  "top-start",
  "top",
  "top-end",
  "right-start",
  "right",
  "right-end",
  "bottom-start",
  "bottom",
  "bottom-end",
  "left-start",
  "left",
  "left-end",
];

<div
  style={{
    margin: 150,
    display: "grid",
    gridTemplateAreas: `
      ". top-start top top-end ."
      "left-start . . . right-start"
      "left . . . right"
      "left-end . . . right-end"
      ". bottom-start bottom bottom-end ."
    `,
    gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
    gridTemplateRows: "1fr 1fr 1fr 1fr 1fr",
    gap: 20,
  }}
>
  {placements.map((placement) => (
    <WrappedEoTooltip
      key={placement}
      content="This is a tooltip"
      trigger="hover"
      placement={placement as any}
      style={{ gridArea: placement }}
    >
      <WrappedEoButton type="primary">{placement}</WrappedEoButton>
    </WrappedEoTooltip>
  ))}
</div>;
```

### Disabled

设置 `disabled` 属性禁用提示，鼠标悬停时不再弹出。

```tsx
<div style={{ margin: 50, display: "flex", gap: 100 }}>
  <WrappedEoTooltip content="This is a tooltip" trigger="hover" disabled>
    <WrappedEoButton type="primary">disabled tooltip</WrappedEoButton>
  </WrappedEoTooltip>
  <WrappedEoTooltip
    content="This is a tooltip"
    trigger="hover"
    disabled={false}
  >
    <WrappedEoButton type="primary">enabled tooltip</WrappedEoButton>
  </WrappedEoTooltip>
</div>
```

### MaxWidth

通过 `maxWidth` 属性控制提示气泡的最大宽度，默认 250px。

```tsx
<div style={{ margin: 50, display: "flex", gap: 100 }}>
  <WrappedEoTooltip
    content="这是一段非常长的提示文本，用于展示默认宽度下的换行效果，当内容超出最大宽度时会自动换行显示。"
    trigger="hover"
  >
    <WrappedEoButton type="primary">默认宽度</WrappedEoButton>
  </WrappedEoTooltip>
  <WrappedEoTooltip
    content="这是一段非常长的提示文本，用于展示自定义宽度下的换行效果，当内容超出最大宽度时会自动换行显示。"
    trigger="hover"
    maxWidth="400px"
  >
    <WrappedEoButton type="primary">maxWidth 400px</WrappedEoButton>
  </WrappedEoTooltip>
</div>
```

### Hoist

`hoist={true}` 使用固定定位，避免提示内容被父元素的 `overflow: hidden` 裁切。

```tsx
<div
  style={{
    position: "relative",
    display: "flex",
    margin: 50,
    padding: 20,
    border: "1px solid red",
    overflow: "hidden",
    gap: 100,
  }}
>
  <WrappedEoTooltip content="This is a tooltip" trigger="hover" hoist={false}>
    <WrappedEoButton type="primary">hover</WrappedEoButton>
  </WrappedEoTooltip>
  <WrappedEoTooltip content="This is a tooltip" trigger="hover" hoist>
    <WrappedEoButton type="primary">hover</WrappedEoButton>
  </WrappedEoTooltip>
</div>
```

### Slot

使用 `content` 插槽可以放置富文本内容作为提示内容，比纯文本的 `content` 属性更灵活。

```tsx
<div style={{ margin: 50, display: "flex", gap: 100 }}>
  <WrappedEoTooltip content="This is a tooltip" trigger="hover">
    <WrappedEoButton type="primary">hover</WrappedEoButton>
  </WrappedEoTooltip>
  <WrappedEoTooltip trigger="hover">
    <strong slot="content" style={{ color: "red" }}>
      This is a tooltip
    </strong>
    <WrappedEoButton type="primary">hover</WrappedEoButton>
  </WrappedEoTooltip>
</div>
```

### Methods

调用 `show()` 方法以编程方式显示提示，调用 `hide()` 方法隐藏提示。

```tsx
const tooltipRef = useRef<any>();

<div style={{ margin: 50, display: "flex", gap: 20 }}>
  <WrappedEoTooltip
    ref={tooltipRef}
    content="This is a tooltip"
    trigger="manual"
  >
    <WrappedEoButton type="primary">Target</WrappedEoButton>
  </WrappedEoTooltip>
  <button onClick={() => tooltipRef.current?.show()}>Show</button>
  <button onClick={() => tooltipRef.current?.hide()}>Hide</button>
</div>;
```
