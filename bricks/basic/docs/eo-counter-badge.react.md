---
tagName: eo-counter-badge
displayName: WrappedEoCounterBadge
description: 通用徽标构件
category: display-component
source: "@next-bricks/basic"
---

# WrappedEoCounterBadge

> 通用徽标构件

## 导入

```tsx
import { WrappedEoCounterBadge } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型               | 必填 | 默认值                     | 说明                                                                     |
| ------------- | ------------------ | ---- | -------------------------- | ------------------------------------------------------------------------ |
| count         | `number`           | 否   | `0`                        | 展示的数字，大于 overflowCount 时显示为 `${overflowCount}+`，为 0 时隐藏 |
| overflowCount | `number`           | 否   | `99`                       | 展示封顶的数字值                                                         |
| dot           | `boolean`          | 否   | -                          | 不展示数字，只有一个小圆点                                               |
| showZero      | `boolean`          | 否   | -                          | 当数值为 0 时，是否展示徽标                                              |
| color         | `string`           | 否   | `"var(--theme-red-color)"` | 徽标的背景颜色                                                           |
| fontColor     | `string`           | 否   | `"#ffffff"`                | 徽标的字体颜色                                                           |
| offset        | `[number, number]` | 否   | `[0, 0]`                   | 设置状态点的位置偏移，格式为 [x, y]                                      |
| icon          | `GeneralIconProps` | 否   | -                          | 在内容中使用图标                                                         |

## Slots

| 名称     | 说明   |
| -------- | ------ |
| （默认） | 内容区 |

## Examples

### Basic

展示基本徽标用法，通过 `count` 和 `overflowCount` 控制显示数字。

```tsx
<WrappedEoCounterBadge count={15} overflowCount={99}>
  我的通知
</WrappedEoCounterBadge>
```

### Slot

使用默认插槽在徽标内嵌入自定义内容，当数值为 0 时通过 `showZero` 控制是否显示徽标。

```tsx
<WrappedEoCounterBadge showZero={true} count={100}>
  <div style={{ fontSize: "16px" }}>我的待办</div>
</WrappedEoCounterBadge>
```

### Icon

使用 `icon` 属性在徽标中展示图标。

```tsx
<WrappedEoCounterBadge
  showZero={false}
  count={99}
  dot={false}
  icon={{ lib: "antd", theme: "outlined", icon: "star" }}
/>
```

### Dot

启用 `dot` 属性以小圆点代替数字展示徽标。

```tsx
<WrappedEoCounterBadge showZero={false} count={99} dot={true}>
  统计总数
</WrappedEoCounterBadge>
```

### 自定义颜色

通过 `color` 和 `fontColor` 自定义徽标的背景色和字体颜色，`overflowCount` 控制封顶显示数字。

```tsx
<WrappedEoCounterBadge
  color="var(--theme-green-color)"
  fontColor="#ffffff"
  count={1000000}
  overflowCount={500}
>
  已解决问题
</WrappedEoCounterBadge>
```

### Offset

使用 `offset` 属性调整徽标的位置偏移。

```tsx
<WrappedEoCounterBadge count={15} overflowCount={99} offset={[10, -5]}>
  偏移示例
</WrappedEoCounterBadge>
```

### 单独使用（无内容）

不传入内容插槽时，徽标作为独立元素展示。

```tsx
<WrappedEoCounterBadge count={15} overflowCount={99} />
```
