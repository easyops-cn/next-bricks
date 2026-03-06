---
tagName: eo-card
displayName: WrappedEoCard
description: 通用卡片构件
category: card-info
source: "@next-bricks/containers"
---

# WrappedEoCard

> 通用卡片构件

## 导入

```tsx
import { WrappedEoCard } from "@easyops/wrapped-components";
```

## Props

| 属性             | 类型                   | 必填 | 默认值      | 说明                                                                                             |
| ---------------- | ---------------------- | ---- | ----------- | ------------------------------------------------------------------------------------------------ |
| cardTitle        | `string`               | -    | -           | 标题                                                                                             |
| headerIcon       | `GeneralIconProps`     | -    | -           | 头部图标                                                                                         |
| fillVertical     | `boolean`              | -    | -           | 自动撑满父容器。注意不可以同时使用 `fillVertical` 和 `verticalCenter`                            |
| verticalCenter   | `boolean`              | -    | -           | 垂直居中。注意不可以同时使用 `fillVertical` 和 `verticalCenter`                                  |
| hasExtraSlot     | `boolean`              | -    | -           | 是否右上角有操作区 slot                                                                          |
| operationButtons | `OperationButton[]`    | -    | `[]`        | 右上角的操作按钮列表                                                                             |
| headerStyle      | `React.CSSProperties`  | -    | -           | 头部样式                                                                                         |
| bodyStyle        | `React.CSSProperties`  | -    | -           | 内容区域样式                                                                                     |
| background       | `boolean \| string`    | -    | -           | 背景设置。传 `false` 可去除背景，传字符串可自定义背景色（如 CSS 颜色值），默认使用标准背景填充色 |
| outline          | `CardOutline`          | -    | `"default"` | 卡片轮廓。默认情况下，使用默认背景填充色，8.2 下默认则为无描边且无填充。                         |
| hideSplit        | `boolean`              | -    | -           | 是否隐藏分割线                                                                                   |
| themeVariant     | `"default" \| "elevo"` | -    | -           | 主题变体，可选 `"default"` 或 `"elevo"`                                                          |

## Slots

| 名称        | 说明             |
| ----------- | ---------------- |
| _(默认)_    | 卡片内容         |
| extra       | 头部右侧拓展元素 |
| titleSuffix | 标题后缀的插槽   |

## Examples

### Basic

展示带标题的基本卡片用法。

```tsx
<WrappedEoCard cardTitle="卡片标题">
  <div>Content</div>
</WrappedEoCard>
```

### Fill Vertical

展示卡片自动撑满父容器高度的效果。

```tsx
<div style={{ height: "300px" }}>
  <WrappedEoCard
    cardTitle="Hello"
    fillVertical={true}
    style={{ height: "100%" }}
  >
    <div style={{ background: "var(--palette-green-2)", height: "100%" }}>
      World
    </div>
  </WrappedEoCard>
</div>
```

### Vertical Center

展示卡片内容垂直居中的效果。

```tsx
<WrappedEoCard cardTitle="卡片标题" verticalCenter={true}>
  <div style={{ height: "50px" }}>Content</div>
</WrappedEoCard>
```

### Hide Split

展示隐藏标题和内容之间分割线的效果。

```tsx
<WrappedEoCard cardTitle="卡片标题" hideSplit={true}>
  <div
    style={{
      display: "flex",
      background: "pink",
      height: "200px",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "22px",
      fontWeight: 500,
      color: "#fff",
    }}
  >
    Content
  </div>
</WrappedEoCard>
```

### Extra Slot

展示在卡片头部右侧使用 extra 插槽放置额外操作元素。

```tsx
<WrappedEoCard cardTitle="卡片标题" hasExtraSlot={true}>
  <WrappedEoButton slot="extra">Extra Button</WrappedEoButton>
</WrappedEoCard>
```

### titleSuffix Slot

展示在卡片标题后缀插槽中放置提示图标。

```tsx
<WrappedEoCard cardTitle="卡片标题">
  <WrappedEoTooltip
    slot="titleSuffix"
    content="This is a tooltip"
    trigger="hover"
  >
    <WrappedEoIcon
      lib="antd"
      category="filled"
      icon="info-circle"
      style={{
        height: "14px",
        lineHeight: "14px",
        fontSize: "14px",
        marginLeft: "6px",
        color: "var(--color-normal-text)",
      }}
    />
  </WrappedEoTooltip>
</WrappedEoCard>
```

### Header Icon

展示卡片标题前带有图标的效果。

```tsx
<WrappedEoCard
  cardTitle="卡片标题"
  headerIcon={{ lib: "antd", icon: "search" }}
>
  <div>Content</div>
</WrappedEoCard>
```

### Header Style

展示自定义卡片头部样式。

```tsx
<WrappedEoCard
  cardTitle="卡片标题"
  headerStyle={{ background: "#abc", color: "#fff", fontSize: "22px" }}
>
  <div>Content</div>
</WrappedEoCard>
```

### Background

展示卡片去除背景和自定义背景色的效果。

```tsx
<>
  <WrappedEoCard cardTitle="卡片标题" background={false}>
    <div>Content</div>
  </WrappedEoCard>
  <div style={{ height: "10px" }} />
  <WrappedEoCard cardTitle="卡片标题" background="#abc">
    <div>Content</div>
  </WrappedEoCard>
</>
```

### Outline

展示不同卡片轮廓样式（border、shadow、background、none）的效果。

```tsx
<div style={{ display: "grid", flexDirection: "column", gap: "1em" }}>
  <WrappedEoCard cardTitle="卡片标题">outline: (not set)</WrappedEoCard>
  <WrappedEoCard cardTitle="卡片标题" outline="border" hideSplit={true}>
    outline: border
  </WrappedEoCard>
  <WrappedEoCard cardTitle="卡片标题" hideSplit={true} outline="shadow">
    outline: shadow
  </WrappedEoCard>
  <WrappedEoCard
    cardTitle="卡片标题"
    outline="background"
    background="var(--color-fill-bg-base-4)"
  >
    outline: background
  </WrappedEoCard>
</div>
```

### Operation Buttons

展示在卡片头部右上角配置操作按钮列表。

```tsx
<WrappedEoCard
  cardTitle="卡片标题"
  operationButtons={[
    {
      id: "btn-edit",
      eventName: "edit",
      text: "编辑",
      configProps: { type: "text" },
    },
    {
      id: "btn-delete",
      eventName: "delete",
      text: "删除",
      configProps: { type: "text", danger: true },
    },
  ]}
>
  <div>Content</div>
</WrappedEoCard>
```

### Body Style and Theme Variant

展示自定义内容区域样式以及使用 elevo 主题变体。

```tsx
<WrappedEoCard
  cardTitle="卡片标题"
  bodyStyle={{ padding: "24px", background: "var(--palette-blue-1)" }}
  themeVariant="elevo"
>
  <div>Content with custom body style and elevo theme</div>
</WrappedEoCard>
```
