---
tagName: eo-narrow-view
displayName: WrappedEoNarrowView
description: 窄布局视图（居中）
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoNarrowView

> 窄布局视图（居中）

## 导入

```tsx
import { WrappedEoNarrowView } from "@easyops/wrapped-components";
```

## Props

| 属性 | 类型                                       | 必填 | 默认值     | 说明                                     |
| ---- | ------------------------------------------ | ---- | ---------- | ---------------------------------------- |
| size | `"small" \| "medium" \| "large" \| "full"` | 否   | `"medium"` | 窄布局尺寸，控制内容区最大宽度及居中显示 |

## Slots

| 名称     | 说明   |
| -------- | ------ |
| （默认） | 内容区 |

## Examples

### Basic

展示 WrappedEoNarrowView 的基本用法，内容居中显示。

```tsx
<WrappedEoNarrowView>Hello world</WrappedEoNarrowView>
```

### Size

通过 `size` 属性控制内容区宽度，支持 `small`、`medium`、`large`、`full` 四个级别。

```tsx
<>
  <WrappedEoNarrowView size="small">
    <div style={{ background: "var(--palette-blue-2)", padding: "8px" }}>
      Small narrow view
    </div>
  </WrappedEoNarrowView>
  <WrappedEoNarrowView size="medium">
    <div style={{ background: "var(--palette-green-2)", padding: "8px" }}>
      Medium narrow view (default)
    </div>
  </WrappedEoNarrowView>
  <WrappedEoNarrowView size="large">
    <div style={{ background: "var(--palette-orange-2)", padding: "8px" }}>
      Large narrow view
    </div>
  </WrappedEoNarrowView>
  <WrappedEoNarrowView size="full">
    <div style={{ background: "var(--palette-red-2)", padding: "8px" }}>
      Full size (no centering)
    </div>
  </WrappedEoNarrowView>
</>
```
