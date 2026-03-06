---
tagName: eo-easy-view
displayName: WrappedEoEasyView
description: 基于网格的简易布局容器
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoEasyView

> 基于网格的简易布局容器

## 导入

```tsx
import { WrappedEoEasyView } from "@easyops/wrapped-components";
```

## Props

| 属性                | 类型                                   | 必填 | 默认值 | 说明                                                                                               |
| ------------------- | -------------------------------------- | ---- | ------ | -------------------------------------------------------------------------------------------------- |
| gridAreas           | `Record<string, (string \| number)[]>` | 否   | -      | 以键值对形式定义多个 grid-area，键为区域名称，值为 `[row-start, col-start, row-end, col-end]` 数组 |
| gridTemplateAreas   | `string[][]`                           | 否   | -      | 定义 grid-template-areas，二维数组，每个子数组代表一行，`.` 表示空白格                             |
| gridTemplateColumns | `string \| string[]`                   | 否   | -      | 定义 grid-template-columns，可传字符串或字符串数组（自动 join 为空格分隔）                         |
| gridTemplateRows    | `string \| string[]`                   | 否   | -      | 定义 grid-template-rows，可传字符串或字符串数组                                                    |
| containerStyle      | `React.CSSProperties`                  | 否   | -      | 定义网格容器的样式                                                                                 |
| styleByAreas        | `Record<string, React.CSSProperties>`  | 否   | -      | 定义网格内各区域的样式，键为区域名称                                                               |

## Examples

### GridAreas & GridTemplateRows

通过 `gridAreas` 以键值对方式精确指定每个区域的起止行列位置。

```tsx
<WrappedEoEasyView
  gridTemplateRows="100px 200px"
  gridTemplateColumns="repeat(12, 1fr)"
  gridAreas={{
    a: [1, 1, 2, 13],
    b: [2, 1, 3, 5],
    c: [2, 5, 3, 13],
  }}
>
  <div slot="a" className="box a">
    A
  </div>
  <div slot="b" className="box b">
    B
  </div>
  <div slot="c" className="box c">
    C
  </div>
</WrappedEoEasyView>
```

### Grid Template Areas

通过 `gridTemplateAreas` 二维数组描述区域布局，`.` 表示空白格。

```tsx
<WrappedEoEasyView
  gridTemplateAreas={[
    ["a", "a", "a"],
    ["b", ".", "d"],
    ["b", "c", "d"],
  ]}
>
  <div slot="a" className="box a">
    A
  </div>
  <div slot="b" className="box b">
    B
  </div>
  <div slot="c" className="box c">
    C
  </div>
  <div slot="d" className="box d">
    D
  </div>
</WrappedEoEasyView>
```

### Container Style

使用 `containerStyle` 自定义网格容器整体样式，`styleByAreas` 自定义各区域样式。

```tsx
<WrappedEoEasyView
  containerStyle={{ marginTop: 30, height: 200 }}
  gridAreas={{
    a: [1, 1, 4, 4],
    b: [1, 4, 3, 13],
    c: [3, 4, 3, 13],
  }}
  styleByAreas={{
    a: { border: "2px solid #fff" },
  }}
>
  <div slot="a" className="box a">
    A
  </div>
  <div slot="b" className="box b">
    B
  </div>
  <div slot="c" className="box c">
    C
  </div>
</WrappedEoEasyView>
```
