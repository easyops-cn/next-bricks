---
tagName: eo-popover
displayName: WrappedEoPopover
description: 通用弹出层构件
category: container-display
source: "@next-bricks/basic"
---

# WrappedEoPopover

> 通用弹出层构件

## 导入

```tsx
import { WrappedEoPopover } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型                                 | 必填 | 默认值       | 说明                             |
| ------------- | ------------------------------------ | ---- | ------------ | -------------------------------- |
| placement     | `Placement \| undefined`             | 否   | -            | 弹出层放置位置                   |
| trigger       | `TriggerEvent \| undefined`          | 否   | `"click"`    | 弹出触发方式                     |
| active        | `boolean \| undefined`               | 否   | `false`      | 弹出层是否已激活                 |
| arrow         | `boolean \| undefined`               | 否   | `true`       | 弹出层是否显示箭头               |
| shiftPadding  | `number \| undefined`                | 否   | -            | 发生移位行为之前超出的填充量     |
| arrowColor    | `string \| undefined`                | 否   | -            | 箭头颜色                         |
| strategy      | `"absolute" \| "fixed" \| undefined` | 否   | `"absolute"` | 弹出层如何定位                   |
| sync          | `Sync \| undefined`                  | 否   | -            | 将弹出层的宽高与 anchor 元素同步 |
| disabled      | `boolean \| undefined`               | 否   | -            | 是否禁用                         |
| distance      | `number \| undefined`                | 否   | -            | 弹出窗口与其锚点之间的距离       |
| anchorDisplay | `CSSProperties["display"]`           | 否   | -            | 触发器的显示类型                 |
| zIndex        | `number \| undefined`                | 否   | -            | 弹出层的 Z 轴顺序                |
| themeVariant  | `"default" \| "elevo" \| undefined`  | 否   | -            | 主题变体                         |

## Events

| 事件                  | detail                   | 说明                       |
| --------------------- | ------------------------ | -------------------------- |
| onVisibleChange       | `boolean` — 当前是否可见 | 当弹出层可见性变化之后触发 |
| onBeforeVisibleChange | `boolean` — 当前是否可见 | 当弹出层可见性变化时触发   |

## Slots

| 名称      | 说明             |
| --------- | ---------------- |
| (default) | 弹出层内容       |
| anchor    | 触发弹出层的元素 |

## CSS Parts

| 名称  | 说明                                                                           |
| ----- | ------------------------------------------------------------------------------ |
| popup | The popup's container. Useful for setting a background color, box shadow, etc. |

## Examples

### Triggers

展示 click 和 hover 两种触发方式。

```tsx
<>
  <WrappedEoPopover placement="bottom">
    <WrappedEoButton slot="anchor">Click me</WrappedEoButton>
    <div
      style={{
        width: 100,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      I'm popover
    </div>
  </WrappedEoPopover>

  <WrappedEoPopover trigger="hover" placement="bottom">
    <WrappedEoButton slot="anchor">Hover me</WrappedEoButton>
    <div
      style={{
        width: 100,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      I'm popover
    </div>
  </WrappedEoPopover>
</>
```

### Placements

展示弹出层在不同方位的放置效果。

```tsx
<WrappedEoPopover placement="bottom-start">
  <WrappedEoButton slot="anchor">Bottom Start</WrappedEoButton>
  <div>I'm popover</div>
</WrappedEoPopover>
```

### Custom Style

通过 arrowColor 自定义箭头颜色，并使用 CSS Part 自定义弹出层容器样式。

```tsx
<>
  <WrappedEoPopover trigger="click" placement="bottom">
    <WrappedEoButton slot="anchor">Normal</WrappedEoButton>
    <div>I'm popover</div>
  </WrappedEoPopover>

  <WrappedEoPopover
    trigger="click"
    placement="bottom"
    arrow={true}
    arrowColor="pink"
  >
    <WrappedEoButton slot="anchor">Custom Style</WrappedEoButton>
    <div style={{ background: "pink" }}>I'm popover</div>
  </WrappedEoPopover>
</>
```

### Disabled

禁用状态下弹出层不会响应触发操作。

```tsx
<WrappedEoPopover placement="bottom" disabled>
  <WrappedEoButton slot="anchor">Click me</WrappedEoButton>
  <div>I'm popover</div>
</WrappedEoPopover>
```

### Events

监听弹出层可见性变化事件。

```tsx
<WrappedEoPopover
  placement="bottom"
  strategy="fixed"
  zIndex={100}
  onVisibleChange={(e) => console.log("visible changed", e.detail)}
  onBeforeVisibleChange={(e) => console.log("before visible changed", e.detail)}
>
  <WrappedEoButton slot="anchor">Click me</WrappedEoButton>
  <div style={{ padding: 12 }}>I'm popover content</div>
</WrappedEoPopover>
```
