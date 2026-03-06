---
tagName: eo-main-view
displayName: WrappedEoMainView
description: 主内容视图
category: container-layout
source: "@next-bricks/containers"
---

# WrappedEoMainView

> 主内容视图

## 导入

```tsx
import { WrappedEoMainView } from "@easyops/wrapped-components";
```

## Props

| 属性              | 类型             | 必填 | 默认值     | 说明                                                                                       |
| ----------------- | ---------------- | ---- | ---------- | ------------------------------------------------------------------------------------------ |
| contentGap        | `MainViewGap`    | -    | `"medium"` | 标题栏和内容区之间的间隔。如果内容区已包含一些视觉上的留白，可以设置 `contentGap: small`。 |
| narrow            | `NarrowViewSize` | -    | `"full"`   | 设置窄布局模式（居中）。可选值：`"full"`、`"small"`、`"medium"`、`"large"`                 |
| fillContainer     | `boolean`        | -    | -          | 设置是否铺满容器                                                                           |
| bannerAlone       | `boolean`        | -    | -          | 设置仅使用 banner 时，面包屑、标题和工具栏将不会显示                                       |
| bannerTitle       | `string`         | -    | -          | Banner 标题，仅在 bannerAlone 模式下生效                                                   |
| bannerDescription | `string`         | -    | -          | Banner 描述文字，仅在 bannerAlone 模式下生效                                               |
| bannerImage       | `string`         | -    | -          | Banner 背景图片，使用 CSS background-image 语法（如 url(...)）                             |
| bannerSunk        | `boolean`        | -    | -          | Banner 是否下沉显示                                                                        |
| showBanner        | `boolean`        | -    | `true`     | 是否展示 banner（包括面包屑、页面标题、工具栏）                                            |
| noPadding         | `boolean`        | -    | -          | 是否没有边距                                                                               |
| showFooter        | `boolean`        | -    | -          | 是否显示底栏（通常放置按钮）。已废弃，请使用 eo-page-view 的 footer                        |
| showDashboardLogo | `boolean`        | -    | `true`     | 是否展示 logo（dashboard 模式）                                                            |
| showDashboardExit | `boolean`        | -    | `true`     | 是否展示退出按钮（dashboard 模式）                                                         |

## Events

| 事件            | detail | 说明                                  |
| --------------- | ------ | ------------------------------------- |
| onDashboardExit | -      | 点击退出按钮退出 dashboard 模式时触发 |

## Slots

| 名称       | 说明                                                        |
| ---------- | ----------------------------------------------------------- |
| ""         | 内容区                                                      |
| breadcrumb | 面包屑                                                      |
| pageTitle  | 页面标题                                                    |
| toolbar    | 工具栏                                                      |
| banner     | Banner 内容                                                 |
| footer     | 底栏（通常放置按钮），已废弃，请使用 eo-page-view 的 footer |

## Examples

### 基本用法

展示包含面包屑、页面标题、工具栏和内容区的主视图基本布局。

```tsx
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
  <div>Say hello to everyone!</div>
  <WrappedEoButton
    slot="toolbar"
    type="primary"
    textContent="Toolbar Button"
    icon={{ lib: "antd", icon: "search" }}
  />
</WrappedEoMainView>
```

### 铺满容器

启用 fillContainer 使主视图铺满父容器高度。

```tsx
<WrappedEoMainView fillContainer={true} style={{ height: "300px" }}>
  <WrappedEoFrameBreadcrumb
    slot="breadcrumb"
    breadcrumb={[
      { text: "Home", to: "/Home" },
      { text: "Detail", to: "/Detail" },
      { text: "List", to: "/List" },
    ]}
  />
  <WrappedEoPageTitle slot="pageTitle" pageTitle="Hello World" />
  <div style={{ height: "100%", border: "1px solid gray" }}>
    Say hello to everyone!
  </div>
</WrappedEoMainView>
```

### 窄布局

使用 narrow 属性设置小尺寸窄布局居中显示。

```tsx
<WrappedEoMainView narrow="small">
  <WrappedEoFrameBreadcrumb
    slot="breadcrumb"
    breadcrumb={[
      { text: "Home", to: "/Home" },
      { text: "Detail", to: "/Detail" },
      { text: "List", to: "/List" },
    ]}
  />
  <WrappedEoPageTitle slot="pageTitle" pageTitle="Hello World" />
  <div style={{ border: "1px solid gray" }}>Say hello to everyone!</div>
</WrappedEoMainView>
```

### Banner 独立模式

启用 bannerAlone 并配置 bannerTitle、bannerDescription 和 bannerImage，此时面包屑、标题和工具栏不显示。

```tsx
<WrappedEoMainView
  bannerAlone={true}
  bannerTitle="hello"
  bannerDescription="abc"
  bannerImage="url(https://img2.baidu.com/it/u=2221802320,2425828997&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500)"
>
  <div style={{ height: "100%" }}>Say hello to everyone!</div>
</WrappedEoMainView>
```

### 无边距且隐藏 Banner

设置 noPadding 去除边距，showBanner 为 false 隐藏 banner 区域。

```tsx
<WrappedEoMainView noPadding={true} showBanner={false}>
  <div style={{ height: "100%" }}>Say hello to everyone!</div>
</WrappedEoMainView>
```

### 内容间隔与 Banner 下沉

使用 contentGap 设置小间隔，bannerSunk 使 banner 下沉显示，并通过 showFooter 显示底栏。

```tsx
<WrappedEoMainView contentGap="small" bannerSunk={true} showFooter={true}>
  <WrappedEoFrameBreadcrumb
    slot="breadcrumb"
    breadcrumb={[
      { text: "Home", to: "/Home" },
      { text: "Detail", to: "/Detail" },
    ]}
  />
  <WrappedEoPageTitle slot="pageTitle" pageTitle="Hello World" />
  <div>主内容区域</div>
  <div slot="banner">Banner 内容</div>
  <WrappedEoButton slot="footer" type="primary" textContent="底栏按钮" />
</WrappedEoMainView>
```

### Dashboard 模式配置

配置 showDashboardLogo 和 showDashboardExit 控制 dashboard 模式下的 logo 和退出按钮显示，监听 onDashboardExit 事件。

```tsx
<WrappedEoMainView
  showDashboardLogo={true}
  showDashboardExit={true}
  onDashboardExit={() => console.log()}
>
  <WrappedEoPageTitle slot="pageTitle" pageTitle="Dashboard Page" />
  <div>Dashboard 模式内容</div>
</WrappedEoMainView>
```
