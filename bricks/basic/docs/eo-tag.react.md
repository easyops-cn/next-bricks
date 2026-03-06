---
tagName: eo-tag
displayName: WrappedEoTag
description: 标签构件
category: display-component
source: "@next-bricks/basic"
---

# WrappedEoTag

> 标签构件

## 导入

```tsx
import { WrappedEoTag } from "@easyops/wrapped-components";
```

## Props

| 属性          | 类型                                     | 必填 | 默认值     | 说明                 |
| ------------- | ---------------------------------------- | ---- | ---------- | -------------------- |
| size          | `"large" \| "medium" \| "small" \| "xs"` | 否   | `"medium"` | 按钮大小             |
| icon          | `GeneralIconProps`                       | 否   | -          | 图标                 |
| color         | `TagColor \| string`                     | 否   | -          | 颜色                 |
| outline       | `boolean`                                | 否   | -          | 是否有边线           |
| disabled      | `boolean`                                | 否   | -          | 是否禁用             |
| closable      | `boolean`                                | 否   | -          | 是否允许关闭         |
| ellipsisWidth | `string`                                 | 否   | -          | 超过宽度文本隐藏宽度 |
| checkable     | `boolean`                                | 否   | -          | 是否允许选择         |
| checked       | `boolean`                                | 否   | -          | 是否选择             |
| tagStyle      | `React.CSSProperties`                    | 否   | -          | 标签自定义样式       |

## Events

| 事件    | detail                                                                                                                                                                                                                   | 说明     |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| onCheck | `TagProps` — { size: 标签大小, icon: 图标, color: 颜色, outline: 是否有边线, closable: 是否可关闭, disabled: 是否禁用, checkable: 是否可选择, checked: 当前选中状态, ellipsisWidth: 超出隐藏宽度, tagStyle: 自定义样式 } | 选择事件 |
| onClose | `TagProps` — { size: 标签大小, icon: 图标, color: 颜色, outline: 是否有边线, closable: 是否可关闭, disabled: 是否禁用, checkable: 是否可选择, checked: 当前选中状态, ellipsisWidth: 超出隐藏宽度, tagStyle: 自定义样式 } | 关闭事件 |

## Examples

### Basic

展示默认标签的基本用法。

```tsx
<WrappedEoTag>Normal Item</WrappedEoTag>
```

### Closable & Event

设置 `closable` 为 `true` 使标签可关闭，关闭时触发 `onClose` 事件。

```tsx
<WrappedEoTag>Normal Item</WrappedEoTag>
<WrappedEoTag
  closable={true}
  onClose={(e) => console.log(JSON.stringify(e.detail))}
>
  Closable Item
</WrappedEoTag>
```

### Checkable & Event

设置 `checkable` 为 `true` 使标签可选择，选择时触发 `onCheck` 事件。

```tsx
<WrappedEoTag
  checkable={true}
  onCheck={(e) => console.log(JSON.stringify(e.detail))}
>
  Check Item
</WrappedEoTag>
<WrappedEoTag
  checkable={true}
  checked={true}
  onCheck={(e) => console.log(JSON.stringify(e.detail))}
>
  Default Checked Item
</WrappedEoTag>
```

### Disabled

设置 `disabled` 为 `true` 禁用标签，禁用后关闭和选择功能均不可用。

```tsx
<WrappedEoTag closable={true} checkable={true} disabled={true}>
  Disabled Item
</WrappedEoTag>
```

### Size

通过 `size` 属性控制标签大小，支持 `large`、`medium`、`small`、`xs` 四种尺寸。

```tsx
<WrappedEoTag size="large">Large Item</WrappedEoTag>
<WrappedEoTag size="medium">Medium Item</WrappedEoTag>
<WrappedEoTag size="small">Small Item</WrappedEoTag>
```

### Color

通过 `color` 属性设置标签颜色，支持预设颜色和自定义颜色值。

```tsx
<div>Normal:</div>
<WrappedEoTag color="gray">灰色</WrappedEoTag>
<WrappedEoTag color="red">红色</WrappedEoTag>
<WrappedEoTag color="orange">橙色</WrappedEoTag>
<WrappedEoTag color="yellow">黄色</WrappedEoTag>
<WrappedEoTag color="blue">蓝色</WrappedEoTag>
<WrappedEoTag color="geekblue">深蓝色</WrappedEoTag>
<WrappedEoTag color="grayblue">灰蓝色</WrappedEoTag>
<WrappedEoTag color="cyan">浅蓝色</WrappedEoTag>
<WrappedEoTag color="green">绿色</WrappedEoTag>
<WrappedEoTag color="purple">紫色</WrappedEoTag>
<WrappedEoTag color="teal">青绿色</WrappedEoTag>
<WrappedEoTag color="pink">粉色</WrappedEoTag>
<div style={{ flexBasis: "100%" }} />
<div>Outline:</div>
<WrappedEoTag color="gray" outline={true}>灰色</WrappedEoTag>
<WrappedEoTag color="red" outline={true}>红色</WrappedEoTag>
<WrappedEoTag color="orange" outline={true}>橙色</WrappedEoTag>
<WrappedEoTag color="yellow" outline={true}>黄色</WrappedEoTag>
<WrappedEoTag color="blue" outline={true}>蓝色</WrappedEoTag>
<WrappedEoTag color="geekblue" outline={true}>深蓝色</WrappedEoTag>
<WrappedEoTag color="grayblue" outline={true}>灰蓝色</WrappedEoTag>
<WrappedEoTag color="cyan" outline={true}>浅蓝色</WrappedEoTag>
<WrappedEoTag color="green" outline={true}>绿色</WrappedEoTag>
<WrappedEoTag color="purple" outline={true}>紫色</WrappedEoTag>
<WrappedEoTag color="teal" outline={true}>青绿色</WrappedEoTag>
<WrappedEoTag color="pink" outline={true}>粉色</WrappedEoTag>
<div style={{ flexBasis: "100%" }} />
<div>Inverse:</div>
<WrappedEoTag color="gray-inverse">灰色</WrappedEoTag>
<WrappedEoTag color="red-inverse">红色</WrappedEoTag>
<WrappedEoTag color="orange-inverse">橙色</WrappedEoTag>
<WrappedEoTag color="yellow-inverse">黄色</WrappedEoTag>
<WrappedEoTag color="blue-inverse">蓝色</WrappedEoTag>
<WrappedEoTag color="geekblue-inverse">深蓝色</WrappedEoTag>
<WrappedEoTag color="grayblue-inverse">灰蓝色</WrappedEoTag>
<WrappedEoTag color="cyan-inverse">浅蓝色</WrappedEoTag>
<WrappedEoTag color="green-inverse">绿色</WrappedEoTag>
<WrappedEoTag color="purple-inverse">紫色</WrappedEoTag>
<WrappedEoTag color="teal-inverse">青绿色</WrappedEoTag>
<WrappedEoTag color="pink-inverse">粉色</WrappedEoTag>
```

### Icon

通过 `icon` 属性为标签添加图标。

```tsx
<WrappedEoTag icon={{ lib: "antd", icon: "star" }}>Star Tag</WrappedEoTag>
```

### TagStyle

通过 `tagStyle` 属性自定义标签样式。

```tsx
<WrappedEoTag tagStyle={{ color: "#abc", width: "200px" }}>
  TagStyle
</WrappedEoTag>
```

### EllipsisWidth

通过 `ellipsisWidth` 属性设置文本超出宽度时的省略截断宽度。

```tsx
<WrappedEoTag ellipsisWidth="100px">
  Hello World, This is over flow test
</WrappedEoTag>
<WrappedEoTag ellipsisWidth="150px">
  Hello World, This is over flow test
</WrappedEoTag>
<WrappedEoTag ellipsisWidth="300px">
  Hello World, This is over flow test
</WrappedEoTag>
```
