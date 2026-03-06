---
tagName: eo-flex-layout
displayName: WrappedEoFlexLayout
description: flex 布局容器
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoFlexLayout

> flex 布局容器

## 导入

```tsx
import { WrappedEoFlexLayout } from "@easyops/wrapped-components";
```

## Props

| 属性           | 类型                              | 必填 | 默认值 | 说明                                                  |
| -------------- | --------------------------------- | ---- | ------ | ----------------------------------------------------- |
| flexDirection  | `CSSProperties["flexDirection"]`  | 否   | -      | 定义 flex-direction，控制主轴方向，如 `row`、`column` |
| justifyContent | `CSSProperties["justifyContent"]` | 否   | -      | 定义 justify-content，控制主轴上的对齐方式            |
| alignItems     | `CSSProperties["alignItems"]`     | 否   | -      | 定义 align-items，控制交叉轴上单行的对齐方式          |
| alignContent   | `CSSProperties["alignContent"]`   | 否   | -      | 定义 align-content，控制多行在交叉轴上的对齐方式      |
| flexWrap       | `CSSProperties["flexWrap"]`       | 否   | -      | 定义 flex-wrap，控制换行方式，如 `wrap`、`nowrap`     |
| gap            | `string`                          | 否   | -      | 定义 gap，设置子元素之间的间距                        |

## Slots

| 名称      | 说明                |
| --------- | ------------------- |
| (default) | flex 容器内的子元素 |

## Examples

### Justify Content

通过 `justifyContent` 控制子元素在主轴上的对齐方式。

```tsx
<div style={{ width: "100%", background: "#abc" }}>
  <WrappedEoFlexLayout justifyContent="start">
    <div className="box a">Start</div>
  </WrappedEoFlexLayout>
  <WrappedEoFlexLayout justifyContent="center">
    <div className="box b">Center</div>
  </WrappedEoFlexLayout>
  <WrappedEoFlexLayout justifyContent="end">
    <div className="box c">End</div>
  </WrappedEoFlexLayout>
</div>
```

### Flex Direction

通过 `flexDirection` 切换主轴方向，实现横向或纵向排列。

```tsx
<div style={{ width: "100%", background: "#abc" }}>
  <WrappedEoFlexLayout flexDirection="row">
    <div className="box a">a</div>
    <div className="box b">b</div>
  </WrappedEoFlexLayout>
  <div style={{ height: 20 }} />
  <WrappedEoFlexLayout flexDirection="column">
    <div className="box a">a</div>
    <div className="box b">b</div>
  </WrappedEoFlexLayout>
</div>
```

### Align Items & Wrap

通过 `alignItems` 控制交叉轴对齐，通过 `flexWrap` 允许子元素换行，`gap` 设置间距。

```tsx
<WrappedEoFlexLayout
  flexWrap="wrap"
  alignItems="center"
  gap="12px"
  style={{ width: 300, background: "#eee", padding: 8 }}
>
  <div className="box">1</div>
  <div className="box">2</div>
  <div className="box">3</div>
  <div className="box">4</div>
  <div className="box">5</div>
</WrappedEoFlexLayout>
```
