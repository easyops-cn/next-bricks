---
tagName: eo-icon
displayName: WrappedEoIcon
description: 通用图标构件
category: display-component
source: "@next-bricks/icons"
---

# WrappedEoIcon

> 通用图标构件

## 导入

```tsx
import { WrappedEoIcon } from "@easyops/wrapped-components";
```

## Props

| 属性                 | 类型                                      | 必填 | 默认值       | 说明                                                                                                    |
| -------------------- | ----------------------------------------- | ---- | ------------ | ------------------------------------------------------------------------------------------------------- |
| lib                  | `"antd" \| "easyops" \| "fa" \| "lucide"` | -    | -            | 图标库，支持 antd、easyops、fa（FontAwesome）、lucide 四种图标库                                        |
| theme                | `string`                                  | -    | `"outlined"` | Ant Design 图标主题                                                                                     |
| icon                 | `string`                                  | -    | -            | 图标名                                                                                                  |
| category             | `string`                                  | -    | `"default"`  | EasyOps 图标分类                                                                                        |
| prefix               | `string`                                  | ✅   | `"fas"`      | FontAwesome 图标前缀                                                                                    |
| strokeWidth          | `number`                                  | -    | `2`          | Lucide 图标描线粗线，限制在区间 `[0.5, 3]`                                                              |
| fill                 | `boolean`                                 | -    | -            | Lucide 图标是否填充（注意：仅部分图片有效）                                                             |
| fallback             | `GeneralIconProps`                        | -    | -            | 设置当图标未找到时的回退图标                                                                            |
| startColor           | `string`                                  | -    | -            | 渐变色起始颜色（不适用于 EasyOps 图标）                                                                 |
| endColor             | `string`                                  | -    | -            | 渐变色终止颜色（不适用于 EasyOps 图标）                                                                 |
| gradientDirection    | `GradientDirection`                       | -    | -            | 渐变色方向（不适用于 EasyOps 图标）                                                                     |
| spinning             | `boolean`                                 | -    | -            | 是否自动旋转                                                                                            |
| imgSrc               | `string`                                  | -    | -            | 图片地址                                                                                                |
| imgStyle             | `CSSProperties`                           | -    | -            | 图片样式                                                                                                |
| imgLoading           | `"lazy" \| "eager"`                       | -    | -            | 加载方式                                                                                                |
| noPublicRoot         | `boolean`                                 | -    | -            | 是否不自动拼接公共路径前缀（仅在使用 imgSrc 时生效）                                                    |
| keepSvgOriginalColor | `boolean`                                 | -    | -            | 如果是 svg 图片，默认将转换该图标颜色为自动跟随文本色，设置 `keepSvgOriginalColor: true` 可保留原始颜色 |

## Examples

### Basic

展示四种图标库的基本用法。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon lib="antd" icon="bell" />
  <WrappedEoIcon lib="fa" icon="heart" />
  <WrappedEoIcon lib="easyops" icon="honeycomb" />
  <WrappedEoIcon lib="lucide" icon="activity" />
</div>
```

### Ant Design

展示 Ant Design 图标的不同主题（outlined、filled、twotone）。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon lib="antd" icon="bell" />
  <WrappedEoIcon lib="antd" theme="filled" icon="bell" />
  <WrappedEoIcon lib="antd" theme="twotone" icon="bell" />
</div>
```

### Font Awesome

展示 FontAwesome 图标的不同前缀（fas、far、fab）。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon lib="fa" icon="heart" />
  <WrappedEoIcon lib="fa" prefix="far" icon="heart" />
  <WrappedEoIcon lib="fa" prefix="fab" icon="github" />
</div>
```

### Lucide

展示 Lucide 图标库的基本用法。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon lib="lucide" icon="activity" />
  <WrappedEoIcon lib="lucide" icon="languages" />
  <WrappedEoIcon lib="lucide" icon="ambulance" />
</div>
```

### EasyOps

展示 EasyOps 图标库的不同分类。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon lib="easyops" icon="honeycomb" />
  <WrappedEoIcon lib="easyops" category="monitor" icon="host" />
  <WrappedEoIcon lib="easyops" category="model" icon="app" />
</div>
```

### Image

使用 imgSrc 展示图片图标，包括 SVG 跟随文本色与保留原始颜色。

```tsx
<div
  style={{
    display: "flex",
    gap: "1em",
    fontSize: "32px",
    color: "var(--palette-green-6)",
  }}
>
  <WrappedEoIcon imgSrc="https://img.icons8.com/cotton/64/like--v1.png" />
  <WrappedEoIcon imgSrc="https://img.icons8.com/color/48/happy--v1.png" />
  <WrappedEoIcon imgSrc="https://img.icons8.com/flat-round/64/cottage.png" />
  <WrappedEoIcon imgSrc="https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg" />
  <WrappedEoIcon
    imgSrc="https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg"
    keepSvgOriginalColor={true}
  />
</div>
```

### Colors

通过 CSS color 或渐变色属性（startColor、endColor、gradientDirection）自定义图标颜色。

```tsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    justifyItems: "center",
    fontSize: "32px",
    gap: "0.5em",
  }}
>
  <WrappedEoIcon lib="antd" theme="outlined" icon="branches" />
  <WrappedEoIcon lib="fa" prefix="far" icon="bell" />
  <WrappedEoIcon lib="easyops" category="default" icon="account" />
  <WrappedEoIcon lib="lucide" icon="ambulance" />
  <WrappedEoIcon
    lib="antd"
    theme="outlined"
    icon="branches"
    style={{ color: "cyan" }}
  />
  <WrappedEoIcon
    lib="fa"
    prefix="far"
    icon="bell"
    style={{ color: "orange" }}
  />
  <WrappedEoIcon
    lib="easyops"
    category="default"
    icon="account"
    style={{ color: "gray" }}
  />
  <WrappedEoIcon lib="lucide" icon="ambulance" style={{ color: "red" }} />
  <WrappedEoIcon
    lib="antd"
    theme="outlined"
    icon="branches"
    startColor="yellow"
    endColor="red"
  />
  <WrappedEoIcon
    lib="antd"
    theme="outlined"
    icon="function"
    startColor="green"
    endColor="blue"
    gradientDirection="left-to-right"
  />
  <WrappedEoIcon
    lib="fa"
    prefix="far"
    icon="bell"
    startColor="pink"
    endColor="purple"
  />
  <WrappedEoIcon
    lib="lucide"
    icon="ambulance"
    gradientDirection="left-to-right"
    startColor="pink"
    endColor="red"
  />
</div>
```

### Spinning

展示图标自动旋转效果。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon spinning={true} lib="antd" theme="outlined" icon="loading" />
  <WrappedEoIcon spinning={true} lib="fa" icon="spinner" />
  <WrappedEoIcon
    spinning={true}
    lib="easyops"
    category="third-menu"
    icon="placeholder-third-menu"
  />
  <WrappedEoIcon spinning={true} lib="lucide" icon="loader-circle" />
</div>
```

### Fallback

当图标未找到时使用 fallback 指定回退图标。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon
    lib="antd"
    icon="oops"
    fallback={{ lib: "fa", icon: "question" }}
  />
  <WrappedEoIcon
    lib="fa"
    icon="oops"
    fallback={{ lib: "fa", icon: "question" }}
  />
  <WrappedEoIcon
    lib="easyops"
    icon="oops"
    fallback={{ lib: "fa", icon: "question" }}
  />
  <WrappedEoIcon
    lib="lucide"
    icon="oops"
    fallback={{ lib: "fa", icon: "question" }}
  />
  <WrappedEoIcon
    lib="antd"
    icon="oops"
    fallback={{
      imgSrc:
        "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg",
    }}
  />
  <WrappedEoIcon
    imgSrc="https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/x-chart.svg"
    fallback={{
      imgSrc:
        "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/pie-chart.svg",
    }}
  />
  <WrappedEoIcon
    imgSrc="https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/x-chart.svg"
    fallback={{
      imgSrc:
        "https://cdn.jsdelivr.net/npm/lucide-static@0.16.29/icons/y-chart.svg",
    }}
  />
</div>
```

### Lucide Stroke Width

Lucide 图标支持设置 strokeWidth，默认为 2，限制在 [0.5, 3] 区间。

```tsx
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    width: "fit-content",
    gap: "0.25em 1em",
    fontSize: "36px",
  }}
>
  {[0.5, 1, 1.5, 2, 2.5, 3].map((sw) => (
    <WrappedEoIcon key={sw} lib="lucide" icon="ambulance" strokeWidth={sw} />
  ))}
  {[0.5, 1, 1.5, 2, 2.5, 3].map((sw) => (
    <span key={sw} style={{ fontSize: "16px", justifySelf: "center" }}>
      {sw}
    </span>
  ))}
</div>
```

### Lucide Fill

Lucide 图标的 fill 填充模式。

```tsx
<div style={{ display: "flex", gap: "1em", fontSize: "32px" }}>
  <WrappedEoIcon lib="lucide" icon="heart" />
  <WrappedEoIcon lib="lucide" icon="heart" fill={true} />
</div>
```

### Image Style and Loading

通过 imgStyle 和 imgLoading 控制图片图标的样式和加载方式。

```tsx
<div style={{ display: "flex", gap: "1em", alignItems: "center" }}>
  <WrappedEoIcon
    imgSrc="https://img.icons8.com/cotton/64/like--v1.png"
    imgStyle={{ width: "48px", height: "48px", borderRadius: "8px" }}
    imgLoading="lazy"
  />
  <WrappedEoIcon
    imgSrc="https://img.icons8.com/color/48/happy--v1.png"
    imgStyle={{ width: "32px", height: "32px" }}
    imgLoading="eager"
    noPublicRoot={true}
  />
</div>
```
