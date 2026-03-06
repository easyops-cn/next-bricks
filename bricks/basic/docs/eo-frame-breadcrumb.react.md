---
tagName: eo-frame-breadcrumb
displayName: WrappedEoFrameBreadcrumb
description: 面包屑 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。
category: layout-component
source: "@next-bricks/basic"
---

# WrappedEoFrameBreadcrumb

> 面包屑 已迁移至 `nav` 构件包，后续在在 `basic` 构件包中将不再更新。

> **已废弃（Deprecated）：** 此构件已迁移至 `nav` 构件包，请使用 `nav` 包中的面包屑构件代替。

## 导入

```tsx
import { WrappedEoFrameBreadcrumb } from "@easyops/wrapped-components";
```

## Props

| 属性         | 类型                                | 必填 | 默认值 | 说明                 |
| ------------ | ----------------------------------- | ---- | ------ | -------------------- |
| breadcrumb   | `BreadcrumbItemConf[] \| undefined` | 否   | -      | 面包屑配置           |
| noCurrentApp | `boolean \| undefined`              | 否   | -      | 是否隐藏当前应用名称 |
| menu         | `Menu \| undefined`                 | 否   | -      | 菜单配置             |

## Examples

### Basic

展示基础面包屑，自动读取当前应用和导航配置构建面包屑路径。

```tsx
<WrappedEoFrameBreadcrumb />
```

### Custom Breadcrumb

自定义面包屑路径，覆盖默认从导航配置中读取的面包屑项。

```tsx
<WrappedEoFrameBreadcrumb
  breadcrumb={[
    { text: "首页", to: "/" },
    { text: "资源管理", to: "/resource" },
    { text: "主机列表" },
  ]}
/>
```

### Hide Current App

隐藏当前应用名称，仅展示自定义面包屑路径。

```tsx
<WrappedEoFrameBreadcrumb
  noCurrentApp={true}
  breadcrumb={[{ text: "首页", to: "/" }, { text: "主机列表" }]}
/>
```

### With Menu

配置菜单项，当应用开启 useCurrentMenuTitle 时，在面包屑中显示当前菜单标题。

```tsx
<WrappedEoFrameBreadcrumb
  menu={{
    title: "主机管理",
    icon: { lib: "antd", icon: "desktop", theme: "outlined" },
    link: "/host",
  }}
  breadcrumb={[{ text: "首页", to: "/" }]}
/>
```
