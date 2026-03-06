---
tagName: eo-resizable-box
displayName: WrappedEoResizableBox
description: 可以左右或上下调整尺寸的容器。
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoResizableBox

> 可以左右或上下调整尺寸的容器。

注意与 v2 构件 `basic-bricks.resizable-box` 的差别：

- 移除属性 `resizable`，改为使用 `disabled` 控制是否可调整尺寸；
- 放在 `containers-NB` 包，而不是 `basic-bricks-NB`。

## 导入

```tsx
import { WrappedEoResizableBox } from "@easyops/wrapped-components";
```

## Props

| 属性                    | 类型                                     | 必填 | 默认值        | 说明                                                                                                  |
| ----------------------- | ---------------------------------------- | ---- | ------------- | ----------------------------------------------------------------------------------------------------- |
| resizeDirection         | `"left" \| "right" \| "top" \| "bottom"` | 否   | `"right"`     | 调整方向，控制拖拽条出现在容器的哪一侧                                                                |
| storageKey              | `string`                                 | 否   | -             | 用于存放当前尺寸的 localStorage key，设置后尺寸会持久化                                               |
| defaultSize             | `number`                                 | 否   | `200`         | 默认尺寸（px）                                                                                        |
| minSize                 | `number`                                 | 否   | `defaultSize` | 最小尺寸（px）                                                                                        |
| minSpace                | `number`                                 | 否   | `300`         | 留给其他部分的最小空间（px）。控制尺寸不超过 `documentElement.clientWidth - minSpace`（水平方向时）。 |
| disabled                | `boolean`                                | 否   | -             | 禁用 resize                                                                                           |
| variant                 | `"dashboard" \| "default"`               | 否   | `"default"`   | 拖拽条样式变体                                                                                        |
| boxStyle                | `React.CSSProperties`                    | 否   | -             | 盒子容器自定义样式                                                                                    |
| boxStyleWhenNotResizing | `React.CSSProperties`                    | 否   | -             | 非拖拽状态时盒子容器自定义样式                                                                        |
| syncSizeWithHost        | `boolean`                                | 否   | -             | 是否将尺寸同步到宿主元素，设置后宿主元素的宽度或高度会随拖拽同步更新                                  |

## Slots

| 名称     | 说明   |
| -------- | ------ |
| （默认） | 内容区 |

## Examples

### Basic

展示可调整尺寸容器的基本用法，拖拽右侧分隔条调整宽度。

```tsx
<div
  style={{
    display: "flex",
    height: "calc(100vh - 4em)",
    border: "1px solid var(--theme-gray-border-color)",
  }}
>
  <WrappedEoResizableBox storageKey="demo-basic">Hello</WrappedEoResizableBox>
  <div
    style={{ flex: 1, borderLeft: "1px solid var(--theme-gray-border-color)" }}
  >
    World
  </div>
</div>
```

### Direction

通过 `resizeDirection` 属性控制拖拽方向，支持上下调整。

```tsx
<div
  style={{
    display: "flex",
    flexDirection: "column",
    height: "calc(100vh - 4em)",
    border: "1px solid var(--theme-gray-border-color)",
  }}
>
  <WrappedEoResizableBox storageKey="demo-direction" resizeDirection="bottom">
    Hello
  </WrappedEoResizableBox>
  <div
    style={{ flex: 1, borderTop: "1px solid var(--theme-gray-border-color)" }}
  >
    World
  </div>
</div>
```

### Sizing

通过 `minSize` 和 `minSpace` 控制尺寸范围，限制最小和最大可调整尺寸。

```tsx
<div
  style={{
    display: "flex",
    height: "calc(100vh - 4em)",
    border: "1px solid var(--theme-gray-border-color)",
  }}
>
  <WrappedEoResizableBox storageKey="demo-sizing" minSize={100} minSpace={100}>
    Hello
  </WrappedEoResizableBox>
  <div
    style={{ flex: 1, borderLeft: "1px solid var(--theme-gray-border-color)" }}
  >
    World
  </div>
</div>
```

### Dashboard

通过 `variant` 属性设置拖拽条的 dashboard 样式变体。

```tsx
<div
  style={{
    display: "flex",
    height: "calc(100vh - 4em)",
    border: "1px solid var(--theme-gray-border-color)",
  }}
>
  <WrappedEoResizableBox storageKey="demo-dashboard" variant="dashboard">
    Hello
  </WrappedEoResizableBox>
  <div
    style={{ flex: 1, borderLeft: "1px solid var(--theme-gray-border-color)" }}
  >
    World
  </div>
</div>
```

### Disabled

通过 `disabled` 属性禁用 resize 功能。

```tsx
<div
  style={{
    display: "flex",
    height: "calc(100vh - 4em)",
    border: "1px solid var(--theme-gray-border-color)",
  }}
>
  <WrappedEoResizableBox disabled={true} defaultSize={200}>
    Fixed (disabled resize)
  </WrappedEoResizableBox>
  <div
    style={{ flex: 1, borderLeft: "1px solid var(--theme-gray-border-color)" }}
  >
    World
  </div>
</div>
```

### Box Style

通过 `boxStyle` 和 `boxStyleWhenNotResizing` 自定义容器样式。

```tsx
<div
  style={{
    display: "flex",
    height: "calc(100vh - 4em)",
    border: "1px solid var(--theme-gray-border-color)",
  }}
>
  <WrappedEoResizableBox
    storageKey="demo-style"
    boxStyle={{ background: "var(--palette-blue-2)" }}
    boxStyleWhenNotResizing={{ transition: "width 0.1s ease" }}
  >
    Styled box
  </WrappedEoResizableBox>
  <div
    style={{ flex: 1, borderLeft: "1px solid var(--theme-gray-border-color)" }}
  >
    World
  </div>
</div>
```
