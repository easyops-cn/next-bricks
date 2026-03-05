---
tagName: eo-page-view
displayName: WrappedEoPageView
description: 页面视图
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoPageView

> 页面视图

## 导入

```tsx
import { WrappedEoPageView } from "@easyops/wrapped-components";
```

## Props

| 属性           | 类型                                       | 必填 | 默认值   | 说明                                                                                                   |
| -------------- | ------------------------------------------ | ---- | -------- | ------------------------------------------------------------------------------------------------------ |
| narrow         | `"small" \| "medium" \| "large" \| "full"` | 否   | `"full"` | 设置窄布局模式（居中）。`"full"` 为全尺寸，`"small"` / `"medium"` / `"large"` 为不同尺寸的居中窄布局。 |
| showFooter     | `boolean`                                  | 否   | -        | 是否显示底栏（通常放置按钮）                                                                           |
| fixedFooter    | `boolean`                                  | 否   | -        | 底栏始终固定在底部。未设置时 footer 默认为 sticky，屏幕高度足够时底栏跟随内容区上移。                  |
| reversedFooter | `boolean`                                  | 否   | -        | 设置为 `true` 时，底栏子构件靠于右侧；默认不设置时靠于左侧。                                           |

## Slots

| 名称       | 说明                 |
| ---------- | -------------------- |
| （默认）   | 内容区               |
| header     | 顶栏                 |
| sidebar    | 侧边栏               |
| subSidebar | 子侧边栏             |
| footer     | 底栏（通常放置按钮） |

## Examples

### Basic

展示页面视图的基本布局，包含顶栏、侧边栏、子侧边栏和内容区。

```tsx
<WrappedEoPageView style={{ height: "300px" }}>
  <div slot="header" style={{ height: "50px", background: "green" }}>
    Header
  </div>
  <div
    slot="sidebar"
    style={{ width: "220px", height: "100%", background: "purple" }}
  >
    Sidebar
  </div>
  <div
    slot="subSidebar"
    style={{ width: "208px", height: "100%", background: "red" }}
  >
    Sub-Sidebar
  </div>
  <div style={{ width: "100%", height: "100%", background: "blue" }}>
    Content
  </div>
</WrappedEoPageView>
```

### With Main View

配合 WrappedEoMainView 等构件组合成完整的页面布局。

```tsx
<WrappedEoPageView style={{ height: "300px" }}>
  <div slot="header" style={{ height: "50px", background: "green" }}>
    Header
  </div>
  <div
    slot="sidebar"
    style={{ width: "220px", height: "100%", background: "purple" }}
  >
    Sidebar
  </div>
  <div
    slot="subSidebar"
    style={{ width: "208px", height: "100%", background: "red" }}
  >
    Sub-Sidebar
  </div>
  <WrappedEoMainView>
    <WrappedEoFrameBreadcrumb
      slot="breadcrumb"
      breadcrumb={[
        { text: "Home", to: "/Home" },
        { text: "Detail", to: "/Detail" },
        { text: "List", to: "/List" },
      ]}
    />
    <WrappedEoPageTitle slot="pageTitle" pageTitle="Hello World" />
    <div>Say hello to everyone! And then say goodbye to everyone!</div>
  </WrappedEoMainView>
</WrappedEoPageView>
```

### With Footer

通过 `showFooter` 显示底栏，通过 `fixedFooter` 控制是否固定在底部。

```tsx
<WrappedEoPageView
  showFooter={true}
  fixedFooter={true}
  style={{ height: "300px" }}
>
  <div style={{ padding: "16px" }}>Page Content</div>
  <WrappedEoButton slot="footer" type="primary">
    保存
  </WrappedEoButton>
  <WrappedEoButton slot="footer">取消</WrappedEoButton>
</WrappedEoPageView>
```

### Narrow Layout

通过 `narrow` 属性设置内容区的窄布局居中模式。

```tsx
<WrappedEoPageView narrow="medium" style={{ height: "300px" }}>
  <div style={{ background: "var(--palette-blue-2)", padding: "16px" }}>
    Centered medium narrow content
  </div>
</WrappedEoPageView>
```

### Reversed Footer

通过 `reversedFooter` 使底栏子构件靠于右侧。

```tsx
<WrappedEoPageView
  showFooter={true}
  reversedFooter={true}
  style={{ height: "300px" }}
>
  <div style={{ padding: "16px" }}>Page Content</div>
  <WrappedEoButton slot="footer" type="primary">
    保存
  </WrappedEoButton>
  <WrappedEoButton slot="footer">取消</WrappedEoButton>
</WrappedEoPageView>
```
