---
tagName: eo-grid-layout
displayName: WrappedEoGridLayout
description: 多行多列的响应式网格布局
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoGridLayout

> 多行多列的响应式网格布局

## 导入

```tsx
import { WrappedEoGridLayout } from "@easyops/wrapped-components";
```

## Props

| 属性            | 类型                              | 必填 | 默认值                   | 说明                                                                |
| --------------- | --------------------------------- | ---- | ------------------------ | ------------------------------------------------------------------- |
| columns         | `number`                          | 否   | -                        | 网格布局列数（各列等宽），不设置则为单列                            |
| rows            | `number`                          | 否   | `1`                      | 网格布局行数                                                        |
| rowSpan         | `number`                          | 否   | `1`                      | 在父级网格中所占行数                                                |
| columnSpan      | `number`                          | 否   | `1`                      | 在父级网格中所占列数                                                |
| templateColumns | `string`                          | 否   | -                        | 网格布局模板列，优先于 `columns` 生效，如 `"repeat(3, 1fr) 2fr"`    |
| alignItems      | `CSSProperties["alignItems"]`     | 否   | -                        | 设置单元格的垂直位置                                                |
| alignContent    | `CSSProperties["alignContent"]`   | 否   | -                        | 设置整个内容区域的垂直位置                                          |
| justifyItems    | `CSSProperties["justifyItems"]`   | 否   | -                        | 设置单元格内容的水平位置                                            |
| justifyContent  | `CSSProperties["justifyContent"]` | 否   | -                        | 设置整个内容区域在容器里面的水平位置                                |
| autoFlow        | `CSSProperties["gridAutoFlow"]`   | 否   | -                        | 子元素自动排布顺序，如 `row`、`column`、`row dense`                 |
| responsive      | `ResponsiveSettings`              | 否   | -                        | 响应式布局设置，根据视口宽度自动切换网格配置                        |
| gap             | `string`                          | 否   | `"var(--page-card-gap)"` | 子元素之间的间距                                                    |
| showGridBorder  | `boolean`                         | 否   | `false`                  | 是否展示网格布局边框                                                |
| gridBorderColor | `string`                          | 否   | -                        | 网格布局边框颜色，`showGridBorder` 为 true 时生效，默认为 `#454547` |

## Slots

| 名称      | 说明                                             |
| --------- | ------------------------------------------------ |
| (default) | 网格布局内的子元素，每个直接子元素占一个网格单元 |

## Examples

### Basic Columns

通过 `columns` 设置等宽列数，`gap` 控制间距。

```tsx
<WrappedEoGridLayout
  columns={2}
  gap="20px"
  style={{ width: 900, background: "pink", marginBottom: 20 }}
>
  <div style={{ background: "yellow" }}>第一个 div</div>
  <div style={{ background: "orange" }}>第二个 div</div>
  <div style={{ background: "blue" }}>第三个 div</div>
  <div style={{ background: "red" }}>第四个 div</div>
</WrappedEoGridLayout>
```

### Grid Border

通过 `showGridBorder` 展示网格边框，`gridBorderColor` 自定义边框颜色。

```tsx
<WrappedEoGridLayout
  columns={3}
  gap="20px"
  showGridBorder={true}
  gridBorderColor="#1890ff"
  style={{ width: 900, marginBottom: 20 }}
>
  <div style={{ background: "yellow", padding: 8 }}>第一个 div</div>
  <div style={{ background: "orange", padding: 8 }}>第二个 div</div>
  <div style={{ background: "blue", padding: 8 }}>第三个 div</div>
  <div style={{ background: "red", padding: 8 }}>第四个 div</div>
</WrappedEoGridLayout>
```

### Template Columns

使用 `templateColumns` 自定义每列宽度，比等宽的 `columns` 更灵活。

```tsx
<WrappedEoGridLayout
  templateColumns="200px 1fr 2fr"
  gap="16px"
  style={{ width: 900 }}
>
  <div style={{ background: "rgb(228, 119, 119)", padding: 8, color: "#fff" }}>
    固定 200px
  </div>
  <div style={{ background: "rgb(61, 145, 225)", padding: 8, color: "#fff" }}>
    1fr
  </div>
  <div style={{ background: "rgb(180, 242, 180)", padding: 8 }}>2fr</div>
</WrappedEoGridLayout>
```

### Responsive Layout

通过 `responsive` 配置在不同视口宽度下自动切换列数。

```tsx
<WrappedEoGridLayout
  columns={4}
  gap="16px"
  responsive={{
    small: { columns: 2 },
    xs: { columns: 1 },
  }}
  style={{ width: "100%" }}
>
  <div style={{ background: "rgb(228, 119, 119)", padding: 16, color: "#fff" }}>
    Item 1
  </div>
  <div style={{ background: "rgb(61, 145, 225)", padding: 16, color: "#fff" }}>
    Item 2
  </div>
  <div style={{ background: "rgb(180, 242, 180)", padding: 16 }}>Item 3</div>
  <div style={{ background: "rgb(238, 238, 78)", padding: 16 }}>Item 4</div>
</WrappedEoGridLayout>
```

### Alignment & AutoFlow

通过 `alignItems`、`justifyItems` 控制单元格内容对齐，`autoFlow` 控制自动排布顺序。

```tsx
<WrappedEoGridLayout
  columns={3}
  gap="16px"
  alignItems="center"
  justifyItems="center"
  autoFlow="row dense"
  style={{ width: 900, height: 200 }}
>
  <div style={{ background: "rgb(228, 119, 119)", padding: 8, color: "#fff" }}>
    A
  </div>
  <div style={{ background: "rgb(61, 145, 225)", padding: 16, color: "#fff" }}>
    B
  </div>
  <div style={{ background: "rgb(180, 242, 180)", padding: 24 }}>C</div>
</WrappedEoGridLayout>
```

### Nested Grid (rowSpan & columnSpan)

将 `WrappedEoGridLayout` 嵌套使用，子网格通过 `columnSpan` 和 `rowSpan` 跨越父级网格的多个单元格。

```tsx
<WrappedEoGridLayout columns={3} rows={2} gap="12px" style={{ width: 900 }}>
  <WrappedEoGridLayout
    columnSpan={2}
    style={{ background: "rgb(228, 119, 119)", padding: 8, color: "#fff" }}
  >
    <div>跨2列</div>
  </WrappedEoGridLayout>
  <div style={{ background: "rgb(61, 145, 225)", padding: 8, color: "#fff" }}>
    单列
  </div>
  <div style={{ background: "rgb(180, 242, 180)", padding: 8 }}>Item 3</div>
  <div style={{ background: "rgb(238, 238, 78)", padding: 8 }}>Item 4</div>
</WrappedEoGridLayout>
```
